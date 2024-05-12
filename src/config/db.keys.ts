import "dotenv/config"

let DATABASEURL =
  process.env.NODE_ENV === "test" ? process.env.TEST_DB_URL : process.env.DB_URL

export const {
  DB_NAME,
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DATABASE = DATABASEURL,
} = process.env
