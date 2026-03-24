import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getCookie, setCookie, deleteCookie } from '../utils/cookie';


export type Role = 'HOC_VIEN' | 'GIA_SU';

interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: getCookie('accessToken') || null,
      setAuth: (user, token) => {
        setCookie('accessToken', token, 7); // Set for 7 days
        set({ user, token });
      },
      logout: () => {
        deleteCookie('accessToken');
        set({ user: null, token: null });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

