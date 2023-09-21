import axios from 'axios';
import Cookies from 'js-cookie';
import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { API, config } from '.';

const initState: IUserStoreState = {
  userId: 0,
  firstName: '',
  lastName: '',
  email: '',
  avatar: '',
};

export const useUserStore = create<IUserStoreState & IUserStoreActions>()(
  devtools(
    persist(
      (set) => ({
        ...initState,
        setUser: async () => {
          try {
            const response = await axios
              .get(`${API}/api/user/get-user-info`, config);
            set({
              userId: response.data.id,
              firstName: response.data.firstName,
              lastName: response.data.lastName,
              email: response.data.email,
              avatar: response.data.image,
            });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (error: any) {
            if (error['response']?.status === 401) {
              Cookies.remove('jwtToken');
              window.location.href = '/sign-in';
            }
          }
        },
        resetUser: () => set({ ...initState }),
      }),
      {
        name: 'user',
      },
    )
  )
);
