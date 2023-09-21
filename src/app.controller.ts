import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import { StoryService } from './story/story.service';

@Controller()
export class AppController {
  constructor(private readonly storyService: StoryService) {}

  @Get(['/', '/dashboard', '/sign-in'])
  async getIndex(@Req() req: Request, @Res() res: Response) {
    fs.readFile(
      path.join(__dirname, '..', 'client', 'build', 'index.html'),
      'utf8',
      (err, html) => {
        if (err) {
          console.log(err);
          return res.status(500).end();
        }

        const ogUrl = 'https://' + req.get('host') + req.originalUrl;

        html = html
          .replace('__OG_TYPE__', 'article')
          .replace(
            '__OG_TITLE__',
            'Enchanta Web App | Craft Personalized Children’s ' +
              'Storybooks & Audiobooks for Imaginative Adventures',
          )
          .replace(
            '__OG_DESCRIPTION__',
            'Unleash your creativity with Enchanta’s Web App - an ' +
              'AI-powered storytelling platform designed to help you craft unique, ' +
              'personalized children’s stories. Nurture young minds and inspire a ' +
              'love for reading with custom storybooks that spark their imagination.',
          )
          .replace(
            '__OG_IMAGE__',
            'https://uploads-ssl.webflow.com/6415884bb5ad31286de5cf83/' +
              '6425e33e13d22eccddfef3e4_enchanta-open_graph-web_app.png',
          )
          .replace('__OG_URL__', ogUrl);

        res.send(html);
      },
    );
  }
  @Get('/story/:link')
  async getHello(
    @Param('link') link: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    fs.readFile(
      path.join(__dirname, '..', 'client', 'build', 'index.html'),
      'utf8',
      (err, html) => {
        if (err) return res.status(500).end();

        this.storyService
          .getStoryMeta(link)
          .then((meta) => {
            const ogUrl = 'https://' + req.get('host') + req.originalUrl;

            html = html
              .replace('__OG_TYPE__', 'article')
              .replace('__OG_TITLE__', 'ENCHANTA | ' + meta.title)
              .replace(
                '__OG_DESCRIPTION__',
                'Created with Enchanta - The Sorcerer Of Storytelling. Try it out today and unlock a world of storytelling possibilities.',
              )
              .replace('__OG_URL__', ogUrl)
              .replace('__OG_IMAGE__', meta.image);

            res.send(html);
          })
          .catch((err) => {
            console.log(err);
            res.status(500).end();
          });
      },
    );
  }
}
