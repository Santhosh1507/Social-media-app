import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js"
import { getMessage, sendMessage } from "../controllers/messages.controller.js"

const router = express.Router()

router.get("/:id", protectRoute, getMessage)
router.post("/send/:id", protectRoute, sendMessage)

export default router
