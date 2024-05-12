import * as joi from "joi"

export const logisticsSchema = joi.object({
  name: joi.string().required(),
  pickUpDate: joi.string().required(),
})
