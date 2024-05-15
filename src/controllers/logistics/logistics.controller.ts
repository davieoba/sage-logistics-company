import { NextFunction, Request, Response } from "express"
import catchAsync from "../../extensions/libs/catch-async"
import {
  getLogisticsStatusSchema,
  logisticsSchema,
  updateLogisticsSchema,
} from "../../extensions/schemas/logistics.schema"
import AppError from "../../extensions/libs/app-error"
import { db } from "../../db"
import { Logistics, NewLogistics, logistics } from "../../db/schema"
import generateTrackingNumber, {
  generateTrackingNumberHash,
} from "../../extensions/libs/generate-tracking-number"
import { eq, sql } from "drizzle-orm"
import checkLogisticsStatus from "../../extensions/handlers/check-logistics-status"

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

  static getAllLogistics = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { page = 1, limit = 10 } = req.query
      const pageNumber = parseInt(page as string, 10)
      const limitNumber = parseInt(page as string, 10)
      const allLogistics: Logistics[] = await db
        .select()
        .from(logistics)
        .limit(limitNumber)
        .offset((pageNumber - 1) * limitNumber)

      const countRecords = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(logistics)

      const totalPages = Math.ceil(countRecords[0].count / limitNumber)

      res.status(200).json({
        message: "ok",
        totalCount: countRecords,
        totalPages,
        data: allLogistics,
      })
    }
  )

  static getPackage = catchAsync(
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

  static getPackageStatus = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params

      const packageTrackingNumber = generateTrackingNumberHash(id)
      const logisticsPackage: Logistics[] = await db
        .select()
        .from(logistics)
        .where(eq(logistics.trackingId, packageTrackingNumber))

      res.status(200).json({
        message: "ok",
        logistics: {
          status: logisticsPackage[0].status,
          isPackageReadyForPickup: logisticsPackage[0].isPackageReadyForPickup,
        },
      })
    }
  )

  static trackPackage = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { error, value } = getLogisticsStatusSchema.validate(req.body)

      if (error) {
        return next(new AppError("Tracking number is required", 400))
      }

      const status = await checkLogisticsStatus(value.trackingId)

      if (!status) {
        return next(new AppError("Error getting status", 400))
      }

      res.status(200).json({
        message: "ok",
        status,
      })
    }
  )

  static updatePackage = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params
      const { error, value } = updateLogisticsSchema.validate(req.body)
      if (error) {
        return next(new AppError(error.details[0].message, 400))
      }

      const packageTrackingNumber = generateTrackingNumberHash(id)
      const logisticsPackage = await db
        .update(logistics)
        .set({
          status: value.status,
          isPackageReadyForPickup: value.isPackageReadyForPickup,
          updatedAt: new Date(),
        })
        .where(eq(logistics.trackingId, packageTrackingNumber))
        .returning()

      return res.status(200).json({
        message: "ok",
        logisticsPackage,
      })
    }
  )
}

export default LogisticsController
