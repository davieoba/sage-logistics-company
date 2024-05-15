import { Router } from "express"
import LogisticsController from "../../controllers/logistics/logistics.controller"
import AuthController from "../../controllers/auth/auth.controller"
import { limiter, restrictTo } from "../../middleware"

const router = Router()

router.get(
  "/",
  limiter,
  AuthController.authenticate,
  restrictTo("admin"),
  LogisticsController.getAllLogistics
)
router.post(
  "/",
  limiter,
  AuthController.authenticate,
  LogisticsController.createPackage
)
router.get(
  "/track",
  limiter,
  AuthController.authenticate,
  LogisticsController.trackPackage
)
router.get(
  "/:id",
  limiter,
  AuthController.authenticate,
  LogisticsController.getPackage
)
router.get(
  "/status/:id",
  limiter,
  // AuthController.authenticate,
  LogisticsController.getPackageStatus
)
router.patch(
  "/:id",
  limiter,
  AuthController.authenticate,
  restrictTo("admin", "staff"),
  LogisticsController.updatePackage
)

export default router
