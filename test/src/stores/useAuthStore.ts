import { create } from 'zustand';
import { login as loginApi, getProfile } from '@/api/user';
import { clearToken, getToken, setToken } from '@/utils/auth';
import type { LoginParams, UserInfo } from '@/types/user';

interface AuthState {
  token: string | null;
  userInfo: UserInfo | null;
  permissions: string[];
  isLoggedIn: boolean;
  login: (params: LoginParams) => Promise<void>;
  fetchProfile: () => Promise<void>;
  logout: () => void;
  hasPermission: (code: string) => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: getToken(),
  userInfo: null,
  permissions: [],
  isLoggedIn: !!getToken(),

  login: async (params: LoginParams) => {
    const res = await loginApi(params);
    setToken(res.token);
    set({
      token: res.token,
      userInfo: res.userInfo,
      permissions: res.userInfo.permissions,
      isLoggedIn: true,
    });
  },

  fetchProfile: async () => {
    const userInfo = await getProfile();
    set({ userInfo, permissions: userInfo.permissions });
  },

  logout: () => {
    clearToken();
    set({ token: null, userInfo: null, permissions: [], isLoggedIn: false });
  },

  hasPermission: (code: string) => get().permissions.includes(code),
}));
