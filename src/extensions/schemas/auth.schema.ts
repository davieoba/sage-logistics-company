import * as joi from "joi"

export const registerSchema = joi.object({
  email: joi.string().email().required(),
  fullName: joi.string().required().max(256).min(5),
})
