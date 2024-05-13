import AppError from "../extensions/libs/app-error"
import { NextFunction, Request, Response } from "express"

export const restrictTo = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req?.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      )
    }

    next()
  }
}
