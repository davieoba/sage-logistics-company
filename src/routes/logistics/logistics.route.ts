import { Router } from "express"
import LogisticsController from "../../controllers/logistics/logistics.controller"
import AuthController from "../../controllers/auth/auth.controller"
import { restrictTo } from "../../middleware"

const router = Router()

router.get(
  "/",
  AuthController.authenticate,
  restrictTo("admin"),
  LogisticsController.getAllLogistics
)
router.post("/", AuthController.authenticate, LogisticsController.createPackage)
router.get(
  "/track",
  AuthController.authenticate,
  LogisticsController.trackPackage
)
router.get("/:id", AuthController.authenticate, LogisticsController.getPackage)
router.get(
  "/status/:id",
  // AuthController.authenticate,
  LogisticsController.getPackageStatus
)
router.patch(
  "/:id",
  AuthController.authenticate,
  restrictTo("admin", "staff"),
  LogisticsController.updatePackage
)

export default router
