import axios from 'axios';
import Cookies from 'js-cookie';
import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { API, config } from '.';

const initState: ISubscriptionStore = {
  storiesLeft: 0,
  stripeUrl: '',
};

export const useSubscriptionStore =
  create<ISubscriptionStore & ISubscriptionActions>()(
    devtools(
      persist((
        (set, get) => ({
          ...initState,
          getUserCredits: async () => {
            try {
              const response = await axios
                .get(`${API}/api/user/get-user-credits`, config);
              set({ storiesLeft: response.data.quantity });
            } catch (error: any) {
              if (error['response']?.status === 401) {
                Cookies.remove('jwtToken');
                window.location.href = '/sign-in';
              } else set({ storiesLeft: 0 });
            }
          },
          getStripeUrl: async (data: CheckoutUrlParams) => {
            const { priceId, email } = data;
            try {
              const response = await axios.get(
                `${API}/api/stripe/get-checkout-url?quantity=1` +
                `&priceId=${priceId}&email=${email}`,
                config);
              set({ stripeUrl: response.data.url });
            } catch (error: any) {
              if (error['response']?.status === 401) {
                Cookies.remove('jwtToken');
                window.location.href = '/sign-in';
              }
            }
          },
          setSessionInfo: async (sessionId: string) => {
            try {
              await axios.get(
                `${API}/api/stripe/get-session-info?session_id=${sessionId}`,
                config);
              get().getUserCredits();
            } catch (error: any) {
              if (error['response']?.status === 401) {
                Cookies.remove('jwtToken');
                window.location.href = '/sign-in';
              }
            }
          },
          resetStripeUrl: () => set({ stripeUrl: '' }),
          resetSubscriptionStore: () => set({ ...initState }),
        })),
      {
        name: 'subscription',
      },
      ),
    ),
  );
