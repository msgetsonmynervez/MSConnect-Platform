import { type Dummy, type InsertDummy } from "@shared/schema";

export interface IStorage {
  getDummies(): Promise<Dummy[]>;
  createDummy(dummy: InsertDummy): Promise<Dummy>;
}

export class MemStorage implements IStorage {
  private dummies: Map<number, Dummy>;
  private currentId: number;

  constructor() {
    this.dummies = new Map();
    this.currentId = 1;
  }

  async getDummies(): Promise<Dummy[]> {
    return Array.from(this.dummies.values());
  }

  async createDummy(insertDummy: InsertDummy): Promise<Dummy> {
    const id = this.currentId++;
    const dummy: Dummy = { ...insertDummy, id };
    this.dummies.set(id, dummy);
    return dummy;
  }
}

export const storage = new MemStorage();
