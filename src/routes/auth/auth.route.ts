import { Request, Response, Router } from "express"
import AuthController from "../../controllers/auth/auth.controller"
import { authLimiter } from "../../middleware"

const router = Router()

router.post("/register", authLimiter, AuthController.register)
router.get(
  "/test",
  AuthController.authenticate,
  (_req: Request, res: Response) => {
    console.log("the code got here, to the test controller")
    res.end()
  }
)
export default router
