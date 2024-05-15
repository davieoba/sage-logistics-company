import "dotenv/config"
import { Pool } from "pg"
import { drizzle } from "drizzle-orm/node-postgres"
import { faker } from "@faker-js/faker"
import { logger } from "../extensions/helpers/logger.helper"
import { logistics, users } from "./schema"
import generateDate from "../extensions/libs/generate-date"
import generateTrackingNumber from "../extensions/libs/generate-tracking-number"
import generateToken from "../extensions/libs/generate-token"

const pool = new Pool({
  connectionString: process.env.DB_URL,
})

const db = drizzle(pool)

async function main() {
  logger.info("[Seeding] started")
  let userId = ""
  for (let index = 0; index < 20; index++) {
    const email = faker.internet.email()
    const { token: userToken, apiKey } = await generateToken(email)
    const user = await db
      .insert(users)
      .values({
        email: email,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        apiKey: apiKey,
        token: userToken,
      })
      .returning()

    userId = user[0].id
    const { hash, token } = generateTrackingNumber()
    const newLogistics = await db
      .insert(logistics)
      .values({
        name: faker.commerce.productName(),
        userId: userId,
        pickUpDate: generateDate(),
        trackingId: hash,
        pickUpLocation: faker.location.streetAddress(),
        dropOffLocation: faker.location.streetAddress(),
      })
      .returning()
  }

  logger.info("[Seeding] Completed")
  process.exit(0)
}

main()
  .then()
  .catch((err) => {
    logger.error(err)
    process.exit(0)
  })
