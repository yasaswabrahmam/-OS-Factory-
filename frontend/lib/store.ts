import { create } from 'zustand';

export interface UserProfile {
  email: string;
  name: string;
  role: string;
  site: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  msg: string;
  time: string;
  severity: 'critical' | 'warning' | 'info';
  read: boolean;
}

interface FactoryOSStore {
  // Auth State
  isAuthenticated: boolean;
  token: string | null;
  user: UserProfile;
  login: (token: string, user: UserProfile) => void;
  logout: () => void;

  // Site Selector
  activeSite: string;
  setActiveSite: (site: string) => void;

  // UI State
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  isCommandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;

  // Notifications
  notifications: NotificationItem[];
  markAllNotificationsRead: () => void;

  // Toast System
  toasts: Array<{ id: string; msg: string; type: 'success' | 'info' | 'warning' | 'danger' }>;
  addToast: (msg: string, type?: 'success' | 'info' | 'warning' | 'danger') => void;
  removeToast: (id: string) => void;

  // Global Refresh Trigger
  refreshCounter: number;
  triggerRefresh: () => void;
}

export const useFactoryOSStore = create<FactoryOSStore>((set) => ({
  isAuthenticated: true,
  token: 'demo-jwt-token-alexander-vance',
  user: {
    email: 'alexander.vance@factoryos.ai',
    name: 'Alexander Vance',
    role: 'Plant Manager / Enterprise Admin',
    site: 'Nevada Gigafactory Line 1-4',
  },
  login: (token, user) => set({ isAuthenticated: true, token, user }),
  logout: () => set({ isAuthenticated: false, token: null }),

  activeSite: 'Nevada Gigafactory — Line 1-4',
  setActiveSite: (site) => set({ activeSite: site }),

  isSidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),

  isCommandPaletteOpen: false,
  setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),

  notifications: [
    { id: '1', title: 'Schuler Press Critical Alert', msg: 'Hydraulic pressure decay on Cylinder B-2.', time: '5m ago', severity: 'critical', read: false },
    { id: '2', title: 'Vibration Limit Exceeded', msg: 'Laser Weld Cell 03 bearing vibration spike (2.8 mm/s).', time: '12m ago', severity: 'warning', read: false },
    { id: '3', title: 'SAP Requisition Synced', msg: 'Carbon fiber reorder PO-44912 confirmed.', time: '1h ago', severity: 'info', read: true },
  ],
  markAllNotificationsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),

  toasts: [],
  addToast: (msg, type = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({ toasts: [...state.toasts, { id, msg, type }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 4000);
  },
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),

  refreshCounter: 0,
  triggerRefresh: () => set((state) => ({ refreshCounter: state.refreshCounter + 1 })),
}));
