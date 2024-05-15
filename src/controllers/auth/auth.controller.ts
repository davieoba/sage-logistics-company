import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { NewUser, users } from "../../db/schema"
import { db } from "../../db"
import { ACCESS_TOKEN, ACCESS_TOKEN_EXPIRY } from "../../config/app.keys"
import { registerSchema } from "../../extensions/schemas/auth.schema"
import AppError from "../../extensions/libs/app-error"
import catchAsync from "../../extensions/libs/catch-async"
import { logger } from "../../extensions/helpers/logger.helper"

class AuthController {
  static register = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { error, value } = registerSchema.validate(req.body)
      if (error) {
        return new AppError(error.message, 400)
      }

      const salt = await bcrypt.genSalt(10)
      const apiKey = await bcrypt.hash(value.email, salt)

      const token = jwt.sign({ apiKey: apiKey }, String(ACCESS_TOKEN), {
        expiresIn: ACCESS_TOKEN_EXPIRY,
      })

      if (!token) {
        return next(new AppError("Error creating token, please try again", 400))
      }

      const newUser: NewUser[] = await db
        .insert(users)
        .values({
          firstName: value.firstName,
          lastName: value.lastName,
          email: value.email,
          token: token,
          apiKey: apiKey,
        })
        .returning()

      if (!newUser) {
        return next(new AppError("User not created", 400))
      }

      logger.info("User key generated")

      res.status(200).json({
        message: "ok",
        token: apiKey,
      })
    }
  )

  static authenticate = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      let apiKey: string = ""

      if (req.headers["authorization"]) {
        apiKey = req.headers["authorization"] as string
      }

      if (!apiKey) return next(new AppError("Register to access resource", 401))

      const user = await db.query.users.findFirst({
        where(users, { eq }) {
          return eq(users.apiKey, apiKey)
        },
      })

      if (!user) {
        return next(
          new AppError("You don't have permission to use this resource.", 401)
        )
      }

      let decoded: any = null
      try {
        decoded = jwt.verify(user?.token as string, String(ACCESS_TOKEN))
      } catch (err) {
        return next(new AppError("Invalid credentials", 401))
      }

      const auth = apiKey === decoded.apiKey
      if (!auth) {
        return next(new AppError("Invalid credentials", 401))
      }

      req.user = user
      next()
    }
  )
}

export default AuthController
