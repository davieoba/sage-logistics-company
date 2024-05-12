import "dotenv/config"
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from "./schema"
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_USER } from "../config/db.keys"

if (!DB_HOST || !DB_NAME || !DB_USER || !DB_PASSWORD) {
  throw new Error("Database credentials missing.")
}
const pool = new Pool({
  port: 5432,
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
})

export const db: NodePgDatabase<typeof schema> = drizzle(pool, { schema })
