export interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  createdAt?: string;
  updatedAt?: string;
  due_date?: string;
}

export interface TodoPayload {
  title: string;
  description?: string;
  completed?: boolean;
  due_date?: string;   // ✅ add this
  
}

export interface Todo extends TodoPayload {
  id: number;
}