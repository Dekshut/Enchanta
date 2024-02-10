import Cookies from 'js-cookie';
import { useStoryStore } from './storyStore';
import { useSubscriptionStore } from './subscriptionStore';
import { useRecordStore } from './useRecordStore';
import { useUserStore } from './userStore';

let API = 'http://localhost:8000';
let google = 'http://localhost:8000/api/auth';

const config = { headers: { Authorization: '' } };
config.headers.Authorization = 'Bearer ' + (Cookies.get('jwtToken') || '');

export {
  API,
  google,
  config,
  useUserStore,
  useStoryStore,
  useSubscriptionStore,
  useRecordStore,
};
