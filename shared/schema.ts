import { pgTable, text, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const dummyTable = pgTable("dummy", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

export const insertDummySchema = createInsertSchema(dummyTable);
export type Dummy = typeof dummyTable.$inferSelect;
export type InsertDummy = z.infer<typeof insertDummySchema>;
