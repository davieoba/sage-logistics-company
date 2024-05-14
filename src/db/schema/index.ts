import {
  relations,
  type InferInsertModel,
  type InferSelectModel,
} from "drizzle-orm"
import { boolean, uuid } from "drizzle-orm/pg-core"
import {
  pgEnum,
  pgTable,
  serial,
  text,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core"

export const roleEnum = pgEnum("role", ["user", "staff", "admin"])
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  role: roleEnum("role").notNull().default("user"),
  fullName: varchar("full_name", { length: 256 }).notNull(),
  email: varchar("email", { length: 256 }).unique().notNull(),
  token: varchar("token"),
  apiKey: varchar("apiKey"),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
})

export const userRelations = relations(users, ({ many }) => ({
  logistics: many(logistics),
}))

export type User = InferSelectModel<typeof users>
export type NewUser = InferInsertModel<typeof users>

export const statusEnum = pgEnum("status", [
  "processing",
  "in-transit",
  "delivered",
])
export const logistics = pgTable("logistics", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  userId: uuid("user_id").notNull(),
  status: statusEnum("status").default("processing"),
  trackingId: varchar("trackingId").notNull(),
  pickUpDate: varchar("pickUpDate", { length: 256 }).notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  pickUpLocation: varchar("pickUpLocation", { length: 256 }).notNull(),
  dropOffLocation: varchar("dropOffLocation", { length: 256 }).notNull(),
  isPackageReadyForPickup: boolean("isPackageReadyForPickup").default(false),
})

export const logisticsRelation = relations(logistics, ({ one }) => ({
  user: one(users, {
    fields: [logistics.userId],
    references: [users.id],
  }),
}))

export type Logistics = InferSelectModel<typeof logistics>
export type NewLogistics = InferInsertModel<typeof logistics>
