import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { StatisticEntity } from '../entities/statistic.entity';
import { StoryEntity } from '../entities/story.entity';
import { LogEntity } from '../entities/log.entity';

export enum ActionType {
  AUTH = 'AUTH',
  STORY_CREATED = 'STORY_CREATED',
  AUDIO_CREATED = 'AUDIO_CREATED',
  MUSIC_PLAYED = 'MUSIC_PLAYED',
  FEEDBACK_LEFT = 'FEEDBACK_LEFT',
  STORY_SHARED = 'STORY_SHARED',
  IMAGE_CHANGED = 'IMAGE_CHANGED',
  UPDATE_STORY = 'UPDATE_STORY',
  DELETE_STORY = 'DELETE_STORY',
  DELETE_PAGE = 'DELETE_PAGE',
  SESSION_TIME = 'SESSION_TIME',
}
@Injectable()
export class StatisticService {
  constructor(
    @InjectRepository(StatisticEntity)
    private readonly statisticRepository: Repository<StatisticEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(StoryEntity)
    private readonly storyRepository: Repository<StoryEntity>,
    @InjectRepository(LogEntity)
    private readonly logRepository: Repository<LogEntity>,
  ) {}

  async createStatistic(): Promise<StatisticEntity> {
    const existStatistic = await this.statisticRepository.findOne({
      where: { date: this.getFormattedDate(new Date()) },
    });
    if (existStatistic) return existStatistic;

    const statistic = await this.statisticRepository.save({
      date: this.getFormattedDate(new Date()),
    });

    const users = await this.userRepository.find();

    for (const user of users) {
      const isSubscriptionExpired = user.subscription_end
        ? this.checkSubscriptionExpired(user.subscription_end)
        : true;

      if (isSubscriptionExpired) user.isSubscription = false;
      else statistic.active_subscriptions += 1;

      this.userRepository
        .save({
          ...user,
          newStoryCreated: false,
          audioWasCreated: false,
          musicWasPlayed: false,
          feedbackWasLeft: false,
          storyWasShared: false,
          imageWasChanged: false,
        })
        .catch(console.log);
    }

    statistic.total_users = await this.userRepository.count();
    statistic.total_stories = await this.storyRepository.count();

    return await this.statisticRepository.save(statistic);
  }

  async createLog(userId: number): Promise<LogEntity> {
    return await this.logRepository.save({
      date: this.getFormattedDate(new Date()),
      userId,
    });
  }

  async logAction(type: ActionType, userId: number) {
    const log = await this.getTodayLog(userId);

    if (type === ActionType.SESSION_TIME) {
      log.total_time += 1;
      log.retention = +((log.total_time / 1440) * 100).toFixed(2);
    } else log.total_actions += 1;

    if (type === ActionType.STORY_CREATED) log.story_created += 1;
    else if (type === ActionType.AUDIO_CREATED) log.audio_created += 1;
    else if (type === ActionType.MUSIC_PLAYED) {
      log.playing_music += 1;
      log.playing_music_in_percent = +(
        (log.playing_music / log.total_actions) *
        100
      ).toFixed(2);
    } else if (type === ActionType.FEEDBACK_LEFT) {
      log.leave_feedback += 1;
      log.leave_feedback_in_percent = +(
        (log.leave_feedback / log.total_actions) *
        100
      ).toFixed(2);
    } else if (type === ActionType.STORY_SHARED) {
      log.story_shared += 1;
      log.story_shared_in_percent = +(
        (log.story_shared / log.total_actions) *
        100
      ).toFixed(2);
    } else if (type === ActionType.IMAGE_CHANGED) {
      log.image_changed += 1;
      log.image_changed_in_percent = +(
        (log.image_changed / log.total_actions) *
        100
      ).toFixed(2);
    }

    await this.logRepository.save(log);
  }

  async newRegistration() {
    await this.updateStatistic('new_registration');
    await this.updateStatistic('total_users');
  }

  async newSubscription(
    registrationDate: Date,
    subscriptionDate: Date,
    isNewUser: boolean,
  ) {
    if (isNewUser) {
      await this.updateStatistic('new_subscription');

      if (
        this.getFormattedDate(registrationDate) ===
        this.getFormattedDate(subscriptionDate)
      )
        await this.updateStatistic('unique_subscription');
    } else {
      await this.updateStatistic('renew_subscription');
    }
  }

  async newStory(isFirstPerDay: boolean, userId: number) {
    await this.updateStatistic('new_stories');
    await this.updateStatistic('total_stories');
    isFirstPerDay && (await this.updateStatistic('new_stories_by_user'));
    await this.logAction(ActionType.STORY_CREATED, userId);
  }

  async playMusic(isFirstPerDay: boolean, userId: number) {
    isFirstPerDay && (await this.updateStatistic('play_music_by_user'));
    await this.logAction(ActionType.MUSIC_PLAYED, userId);
  }

  async newFeedback(isFirstPerDay: boolean, userId: number) {
    isFirstPerDay && (await this.updateStatistic('feedback_by_user'));
    await this.logAction(ActionType.FEEDBACK_LEFT, userId);
  }

  async newSharing(isFirstPerDay: boolean, userId: number) {
    isFirstPerDay && (await this.updateStatistic('sharing_by_user'));
    await this.logAction(ActionType.STORY_SHARED, userId);
  }

  async newAudio(
    isFirstPerDay: boolean,
    isFirstRecord: boolean,
    userId: number,
  ) {
    if (isFirstRecord) {
      await this.updateStatistic('new_audio');
      isFirstPerDay && (await this.updateStatistic('new_audio_by_user'));
    }
    await this.logAction(ActionType.AUDIO_CREATED, userId);
  }

  async newImage(isFirstPerDay: boolean, userId: number) {
    isFirstPerDay && (await this.updateStatistic('edit_image_by_user'));
    await this.logAction(ActionType.IMAGE_CHANGED, userId);
  }

  private async updateStatistic(key: string) {
    try {
      const statistic = await this.getTodayStatistic();

      statistic[key] += 1;

      if (key === 'unique_subscription') {
        statistic.unique_subscription_in_percent = +(
          (statistic.unique_subscription / statistic.new_registration) *
          100
        ).toFixed(2);
      } else if (key === 'new_stories_by_user') {
        statistic.new_stories_in_percent = +(
          (statistic.new_stories_by_user / statistic.total_users) *
          100
        ).toFixed(2);
      } else if (key === 'new_audio_by_user') {
        statistic.new_audio_in_percent = +(
          (statistic.new_audio_by_user / statistic.total_users) *
          100
        ).toFixed(2);
      } else if (key === 'play_music_by_user') {
        statistic.play_music_in_percent = +(
          (statistic.play_music_by_user / statistic.total_users) *
          100
        ).toFixed(2);
      } else if (key === 'feedback_by_user') {
        statistic.feedback_in_percent = +(
          (statistic.feedback_by_user / statistic.total_users) *
          100
        ).toFixed(2);
      } else if (key === 'sharing_by_user') {
        statistic.sharing_in_percent = +(
          (statistic.sharing_by_user / statistic.total_users) *
          100
        ).toFixed(2);
      } else if (key === 'edit_image_by_user') {
        statistic.edit_image_in_percent = +(
          (statistic.edit_image_by_user / statistic.total_users) *
          100
        ).toFixed(2);
      }

      await this.statisticRepository.save(statistic);
    } catch (e) {
      console.log('Error while updating statistic', e);
    }
  }

  private async getTodayStatistic(): Promise<StatisticEntity> {
    const today = this.getFormattedDate(new Date());
    const statistic = await this.statisticRepository.findOne({
      where: { date: today },
    });

    if (!statistic) return await this.createStatistic();
    else return statistic;
  }

  private async getTodayLog(userId: number): Promise<LogEntity> {
    const today = this.getFormattedDate(new Date());
    const log = await this.logRepository.findOne({
      where: { date: today, userId },
    });

    if (!log) return await this.createLog(userId);
    else return log;
  }

  private checkSubscriptionExpired(endDate) {
    const today = new Date();
    const end = new Date(endDate);

    if (this.getFormattedDate(today) === this.getFormattedDate(end))
      return false;

    return today > end;
  }

  private getFormattedDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
