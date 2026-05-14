export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "admin" | "member";
}

export interface Meeting {
  _id: string;
  title: string;
  hostId: string;
  participants: User[];
  startTime: string;
  endTime?: string;
  status: "scheduled" | "live" | "ended";
  summary?: string;
  actionItems?: ActionItem[];
  recording?: string;
}

export interface ActionItem {
  _id: string;
  text: string;
  assignee: User;
  status: "pending" | "done";
  meetingId: string;
}

export interface Message {
  _id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  text: string;
  timestamp: string;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  assignee?: User;
  status: "todo" | "inprogress" | "done";
  priority: "low" | "medium" | "high";
}

export interface Notification {
  _id: string;
  message: string;
  read: boolean;
  createdAt: string;
  type: "mention" | "action_item" | "meeting";
}