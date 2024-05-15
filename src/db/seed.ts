import "dotenv/config";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { faker } from "@faker-js/faker";
import { logger } from "../extensions/helpers/logger.helper";
import { logistics, users } from "./schema";
import generateDate from "../extensions/libs/generate-date";

const pool = new Pool({
  connectionString: process.env.DB_URL,
});

const db = drizzle(pool);

async function main() {
  logger.info("[Seeding] started");
  let userId = "";
  for (let index = 0; index < 10; index++) {
    const user = await db
      .insert(users)
      .values({
        email: faker.internet.email(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
      })
      .returning();

    userId = user[0].id;

    const newLogistics = await db
      .insert(logistics)
      .values({
        name: faker.commerce.productName(),
        userId: userId,
        pickUpDate: generateDate(),
        pickUpLocation: faker.location.streetAddress(),
        dropOffLocation: faker.location.streetAddress(),
      })
      .returning();
  }

  logger.info("[Seeding] Completed");
  process.exit(0);
}

main()
  .then()
  .catch((err) => {
    logger.error(err);
    process.exit(0);
  });
