import { NextFunction, Request, Response } from "express"
import catchAsync from "../../extensions/libs/catch-async"
import { logisticsSchema } from "../../extensions/schemas/logistics.schema"
import AppError from "../../extensions/libs/app-error"
import { db } from "../../db"
import { NewLogistics, logistics } from "../../db/schema"
import generateTrackingNumber from "../../extensions/libs/generate-tracking-number"

class LogisticsController {
  static createPackage = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { error, value } = logisticsSchema.validate(req.body)
      if (error) {
        new AppError(error.message, 400)
      }

      const { hash, token } = generateTrackingNumber()

      const newLogistics: NewLogistics[] = await db
        .insert(logistics)
        .values({
          name: value.name,
          pickUpDate: value.pickUpDate,
          trackingId: hash,
        })
        .returning()

      if (!newLogistics) {
        return next(new AppError("Error creating logistics order", 400))
      }

      res.status(200).json({
        message: "ok",
        logistics: {
          orderId: token,
          name: newLogistics[0].name,
          pickUpDate: newLogistics[0].pickUpDate,
          status: newLogistics[0].status,
        },
      })
    }
  )

  static trackPackage = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params
      if (!id) {
        return next(new AppError("Invalid tracking Id", 400))
      }
    }
  )
}

export default LogisticsController
