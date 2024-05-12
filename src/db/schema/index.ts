import type { InferInsertModel, InferSelectModel } from "drizzle-orm"
import { smallserial, uuid } from "drizzle-orm/pg-core"
import {
  pgEnum,
  pgTable,
  serial,
  text,
  varchar,
  timestamp,
  date,
} from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  fullName: varchar("full_name", { length: 256 }).notNull(),
  email: varchar("email", { length: 256 }).unique().notNull(),
  token: varchar("token"),
  apiKey: varchar("apiKey"),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
})

export type User = InferSelectModel<typeof users>
export type NewUser = InferInsertModel<typeof users>

export const statusEnum = pgEnum("status", [
  "pending",
  "processing",
  "delivered",
])
export const logistics = pgTable("logistics", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  status: statusEnum("status").default("pending"),
  trackingId: varchar("trackingId").notNull(),
  pickUpDate: varchar("pickUpDate", { length: 256 }).notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
})

export type Logistics = InferSelectModel<typeof logistics>
export type NewLogistics = InferInsertModel<typeof logistics>
