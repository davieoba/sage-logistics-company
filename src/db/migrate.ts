import "dotenv/config"
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres"
import { migrate } from "drizzle-orm/node-postgres/migrator"
import { Pool } from "pg"

async function main() {
  const pool = new Pool({
    connectionString: process.env.DB_URL,
  })
  const db: NodePgDatabase = drizzle(pool)
  console.log("[Migrate] migration has started ....")
  await migrate(db, { migrationsFolder: "src/db/drizzle" })
  console.log("[Migrate] migration ended")
  await pool.end()
}

main().catch((err) => {
  console.log(err)
})
