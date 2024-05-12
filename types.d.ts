import { User } from "./src/db/schema"

declare global {
  namespace Express {
    interface Request {
      user?: User
    }
  }
}

// declare namespace Express {
//   export interface Request {
//     user: User
//   }
//   export interface Response {
//     user: User
//   }
// }
