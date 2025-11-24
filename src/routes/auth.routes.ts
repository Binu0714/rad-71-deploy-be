import { Router } from "express"
import {
  getMyDetails,
  handleRefreshToken,
  login,
  register,
  registerAdmin
} from "../controllers/auth.controller"
import { authenticate } from "../middleware/auth"
import { requireRole } from "../middleware/role"
import { Role } from "../models/User"

const router = Router()

router.post("/register", register)
router.post("/login", login)
router.post("/refresh", handleRefreshToken)

// protected (USER, AUTHOR, ADMIN)
// requireRole([Role.USER])
router.get("/me", authenticate, getMyDetails)

// protected
// ADMIN only
// need create middleware for check req is from ADMIN

//   requireRole([Role.ADMIN, Role.AUTHOR]) // for admin and author both can access
router.post(
  "/admin/register",
  authenticate,
  requireRole([Role.ADMIN]),
  registerAdmin
)



// Refresh token end point

export default router
