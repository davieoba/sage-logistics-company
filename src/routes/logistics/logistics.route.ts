import { Router } from "express"
import LogisticsController from "../../controllers/logistics/logistics.controller"
import AuthController from "../../controllers/auth/auth.controller"

const router = Router()

router.post("/", AuthController.authenticate, LogisticsController.createPackage)

export default router
