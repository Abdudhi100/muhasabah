// src/types/user.ts
export interface Profile {
  id: number;
  username: string; // ✅ align with Navbar
  role: "student" | "sitting_head" | "overall_head" | string;
}



export interface Notification {
  id: number;
  message: string;
  is_read: boolean; // ✅ align with Navbar
}

export interface Notifications {
  unread_count: number;
  notifications: Notification[];
}
