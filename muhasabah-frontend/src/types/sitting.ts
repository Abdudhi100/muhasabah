// src/types/sitting.ts
export interface Sitting {
  id: number;
  name: string;
  location: string;
  sitting_head_name?: string;
  sitting_head?: string;
  day_of_week: string;
  max_members: number;
  status: "active" | "inactive";
  progress?: number;
}

export interface Profile {
  id: number;
  name: string;
  role: "overall_head" | "sitting_head" | "student";
}
