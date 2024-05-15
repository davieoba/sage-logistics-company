import * as joi from "joi"

export const registerSchema = joi.object({
  email: joi.string().email().required(),
  firstName: joi.string().required().max(256).min(2),
  lastName: joi.string().required().max(256).min(2),
})
