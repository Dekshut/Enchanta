import Cookies from 'js-cookie';
import { useStoryStore } from './storyStore';
import { useSubscriptionStore } from './subscriptionStore';
import { useRecordStore } from './useRecordStore';
import { useUserStore } from './userStore';

let API = '';
let google = '';

if (process.env.NODE_ENV === 'development') {
  API = 'http://localhost:8000';
  google = 'http://localhost:8000/api/auth';
}
else {
  //prod
  // API = 'https://mage-of-storytelling.herokuapp.com';
  // google = 'https://mage-of-storytelling.herokuapp.com/api/auth';
  //dev
  API = 'https://mage-of-storytelling-dev.herokuapp.com';
  google = 'https://mage-of-storytelling-dev.herokuapp.com/api/auth';
}

const config = { headers: { Authorization: '' } };
config.headers.Authorization = 'Bearer ' +
  (Cookies.get('jwtToken') || '');

export {
  API,
  google,
  config,
  useUserStore,
  useStoryStore,
  useSubscriptionStore,
  useRecordStore,
};
