export interface User {
  id: number;
  username: string;
}

export interface Symptom {
  id: number;
  name: string;
  intensity: number;
  notes?: string;
  timestamp: string;
}

export type InsertUser = Omit<User, "id">;
export type InsertSymptom = Omit<Symptom, "id" | "timestamp">;
