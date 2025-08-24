// types/dashboard.ts
// src/types/dashboard.ts

export interface JoinRequest {
  id: number;
  member_name: string;
  requested_at: string;  // or Date if you want
  status: "pending" | "approved" | "rejected";
}



export type SittingHeadData = {
  totalMeetings: number;
  activeMembers: number;
  pendingTasks: number;
  member_progress: MemberProgress[];
  pending_requests: JoinRequest[];
};
export interface Sitting {
  id: number;
  name?: string;
  progress?: number;
}

export interface OverallHeadTabData {
  total_sittings: number;
  average_progress: number;
  top_sittings: Sitting[];
  bottom_sittings: Sitting[];
}

// src/types/dashboard.ts

export interface Comment {
  id: number;
  text: string;
  created_at: string;
  author_name: string;
}

export interface MemberData {
  todos_today: string[];
  progress_percent: number;
  streak_count: number;
  recent_comments: Comment[];
}
export interface MemberProgress {
  member: string;
  progress_percent: number; // ✅ matches API
}

