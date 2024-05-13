import { NextFunction, Request, Response } from "express"
import catchAsync from "../../extensions/libs/catch-async"
import { logisticsSchema } from "../../extensions/schemas/logistics.schema"
import AppError from "../../extensions/libs/app-error"
import { db } from "../../db"
import { Logistics, NewLogistics, logistics } from "../../db/schema"
import generateTrackingNumber, {
  generateTrackingNumberHash,
} from "../../extensions/libs/generate-tracking-number"
import { eq } from "drizzle-orm"

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
          pickUpLocation: value.pickUpLocation,
          dropOffLocation: value.dropOffLocation,
          pickUpDate: value.pickUpDate,
          trackingId: hash,
          userId: req.user?.id as string,
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

      const packageTrackingNumber = generateTrackingNumberHash(id)
      const logisticsPackage: Logistics[] = await db
        .select()
        .from(logistics)
        .where(eq(logistics.trackingId, packageTrackingNumber))

      if (!logisticsPackage) {
        return next(new AppError("Invalid Tracking number", 404))
      }

      if (!req.user?.role) {
        return next(new AppError("Error", 401))
      }

      if (req.user?.id !== logisticsPackage[0].userId) {
        if (!["admin", "staff"].includes(req.user.role)) {
          return res.status(403).json({
            message: "You do not have permission to view this resource",
          })
        }
      }

      res.status(200).json({
        message: "ok",
        logistics: {
          name: logisticsPackage[0].name,
          trackingId: logisticsPackage[0].trackingId,
          status: logisticsPackage[0].status,
          pickUpLocation: logisticsPackage[0].pickUpLocation,
          pickUpDate: logisticsPackage[0].pickUpDate,
          isPackageReadyForPickup: logisticsPackage[0].isPackageReadyForPickup,
        },
      })
    }
  )

  static updatePackage = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      // this will be an restricted route that only the people with the right priviledge can update the status of the package
      // the admin and the staff person can change the status of the package the location of the package etc
      // remember to update the timestamp (write a function to create a timestamp that can be updated) I can just call the function and it will give me the current timestamp which I can use to update the updated_at attribute of the package
      const { id } = req.params
      // get the package from the id
    }
  )
}

export default LogisticsController
