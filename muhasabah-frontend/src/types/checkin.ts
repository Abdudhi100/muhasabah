// src/types/checkin.ts
export interface Checkin {
  id: number;
  date: string;        // ISO date string (YYYY-MM-DD)
  todo_item: string;
  notes?: string;
  is_completed: boolean;
}

export type CheckinPayload = Omit<Checkin, "id">; // used for creation/updating
