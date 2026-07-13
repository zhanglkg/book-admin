import { create } from 'zustand';

interface AppState {
  /** 侧边栏是否折叠 */
  collapsed: boolean;
  /** 主题色模式（预留切换） */
  themeMode: 'light' | 'dark';
  toggleCollapsed: () => void;
  setCollapsed: (value: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  collapsed: false,
  themeMode: 'light',
  toggleCollapsed: () => set((state) => ({ collapsed: !state.collapsed })),
  setCollapsed: (value) => set({ collapsed: value }),
}));
