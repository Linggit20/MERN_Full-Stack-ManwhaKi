import express from "express"
import { getUsers } from "../../controllers/admin.js"
import { verifyToken } from "../../middleware/authAdmin.js"

const router = express.Router()

router.get("/users/all", verifyToken, getUsers)

export default router