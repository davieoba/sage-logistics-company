import "dotenv/config"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { ACCESS_TOKEN, ACCESS_TOKEN_EXPIRY } from "../../config/app.keys"

const generateToken = async (
  email: string
): Promise<{ token: string; apiKey: string }> => {
  const salt = await bcrypt.genSalt(10)
  const apiKey = await bcrypt.hash(email, salt)

  const token = jwt.sign({ apiKey: apiKey }, String(ACCESS_TOKEN), {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  })

  return { token, apiKey }
}

export default generateToken
