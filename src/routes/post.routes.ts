import { Router } from "express"
import { getAllPost, getMyPost, savePost } from "../controllers/post.controller"
import { authenticate } from "../middleware/auth"
import { requireRole } from "../middleware/role"
import { Role } from "../models/User"
import { upload } from "../middleware/upload"
import { generateContext } from "../controllers/ai.controller"

const route = Router()

route.post(
  "/create",
  authenticate,
  requireRole([Role.ADMIN, Role.AUTHOR]),
  upload.single("image"), // form data key name
  savePost
)

route.get("/", getAllPost)

route.get(
  "/me",
  authenticate,
  requireRole([Role.ADMIN, Role.AUTHOR]),
  getMyPost
)

route.post("/ai/generate", generateContext)

export default route
