import axios from "axios"
import { BASE_URL } from "../../config/app.keys"
import { db } from "../../db"
import { logistics } from "../../db/schema"
import { generateTrackingNumberHash } from "../libs/generate-tracking-number"
import { eq } from "drizzle-orm"

const checkLogisticsStatus = async (trackingId: string) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/v1/logistics/status/${trackingId}`
    )
    const packageTrackingNumber = generateTrackingNumberHash(trackingId)
    await db
      .update(logistics)
      .set({ status: response.data.logistics.status, updatedAt: new Date() })
      .where(eq(logistics.trackingId, packageTrackingNumber))

    return response.data.logistics.status
  } catch (error) {
    return null
  }
}

export default checkLogisticsStatus
