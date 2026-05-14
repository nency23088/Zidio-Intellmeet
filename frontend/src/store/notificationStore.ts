import { create } from "zustand";
import { Notification } from "@/types";

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (n: Notification) => void;
}

const mockNotifications: Notification[] = [
  {
    _id: "n1",
    message: "Sarah Connor mentioned you in Sprint Planning",
    read: false,
    createdAt: new Date(Date.now() - 300000).toISOString(),
    type: "mention",
  },
  {
    _id: "n2",
    message: "Action item assigned: Complete API integration",
    read: false,
    createdAt: new Date(Date.now() - 900000).toISOString(),
    type: "action_item",
  },
  {
    _id: "n3",
    message: "Meeting 'Product Design Review' starts in 15 minutes",
    read: false,
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    type: "meeting",
  },
  {
    _id: "n4",
    message: "Mike Ross completed his action item",
    read: true,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    type: "action_item",
  },
  {
    _id: "n5",
    message: "Q1 Quarterly Review recording is now available",
    read: true,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    type: "meeting",
  },
];

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: mockNotifications,
  unreadCount: mockNotifications.filter((n) => !n.read).length,

  markAsRead: (id) =>
    set((state) => {
      const updated = state.notifications.map((n) =>
        n._id === id ? { ...n, read: true } : n
      );
      return {
        notifications: updated,
        unreadCount: updated.filter((n) => !n.read).length,
      };
    }),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),

  addNotification: (n) =>
    set((state) => ({
      notifications: [n, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    })),
}));