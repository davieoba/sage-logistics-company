import * as joi from "joi"

export const logisticsSchema = joi.object({
  name: joi.string().required(),
  pickUpDate: joi.string().required(),
  pickUpLocation: joi.string().required(),
  dropOffLocation: joi.string().required(),
})

export const getLogisticsStatusSchema = joi.object({
  trackingId: joi.string().required(),
})

export const updateLogisticsSchema = joi.object({
  status: joi.string().required(),
  isPackageReadyForPickup: joi.boolean().required(),
})
