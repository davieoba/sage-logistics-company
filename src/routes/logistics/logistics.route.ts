import { Router } from "express"
import LogisticsController from "../../controllers/logistics/logistics.controller"
import AuthController from "../../controllers/auth/auth.controller"
import { restrictTo } from "../../middleware"

const router = Router()

router.post("/", AuthController.authenticate, LogisticsController.createPackage)
router.get(
  "/:id",
  AuthController.authenticate,
  LogisticsController.trackPackage
)
router.patch(
  "/:id",
  AuthController.authenticate,
  restrictTo("admin", "staff"),
  LogisticsController.updatePackage
)

export default router
