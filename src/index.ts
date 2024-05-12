import express, { Request, Response } from "express"
import http from "http"
import { PORT, TEST_PORT } from "./config/app.keys"
import { logger } from "./extensions/helpers/logger.helper"
import cors from "cors"
import bodyParser from "body-parser"
import hpp from "hpp"
import helmet from "helmet"
import morgan from "morgan"
import xss from "xss"
import authRoute from "./routes/auth/auth.route"
import logisticsRoute from "./routes/logistics/logistics.route"
import { unknownEndpoint } from "./extensions/utils"
import { errorController } from "./extensions/handlers/error.controller"

const app = express()
app.use(helmet())
app.use(hpp())
// app.use(xss({}))
app.use(express.json({ limit: "10kb" }))
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors({ credentials: true }))

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"))
}
const API_PREFIX = "/api/v1"
app.get(`${API_PREFIX}/health`, (_req: Request, res: Response) => {
  res.status(200).send("Server is live")
})

app.use(API_PREFIX + "/auth", authRoute)
app.use(API_PREFIX + "/logistics", logisticsRoute)

app.use("*", unknownEndpoint)
app.use(errorController)

const server = http.createServer(app)
const SERVER_PORT = process.env.NODE_ENV === "test" ? TEST_PORT : PORT
server.listen(SERVER_PORT, () => {
  logger.info(`Server running on http://localhost:${SERVER_PORT}${API_PREFIX}`)
})
