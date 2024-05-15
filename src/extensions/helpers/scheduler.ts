import { eq } from "drizzle-orm"
import { db } from "../../db"
import { logistics } from "../../db/schema"
import checkLogisticsStatus from "../handlers/check-logistics-status"

// update the status of the logistics order in the database
const checkLogisticsScheduler = async () => {
  const packages = await db
    .select()
    .from(logistics)
    .where(eq(logistics.status, "delivered"))

  for (const pkg of packages) {
    await checkLogisticsStatus(pkg.trackingId as string)
  }
}

setInterval(checkLogisticsScheduler, 2 * 60 * 1000)

export default checkLogisticsScheduler
