import * as crypto from "crypto"
import { v4 as uuidv4 } from "uuid"

const generateTrackingNumber = (): { token: string; hash: string } => {
  const token = uuidv4()
  const md5 = crypto.createHash("sha256").update(token).digest("hex")

  return { hash: md5, token }
}

export default generateTrackingNumber

export const generateTrackingNumberHash = (token: string): string => {
  const hash = crypto.createHash("sha256").update(token).digest("hex")

  return hash
}
