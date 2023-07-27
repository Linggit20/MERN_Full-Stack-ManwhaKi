import express from "express"
import { register, login, logout } from "../../controllers/authUser.js"
import { verifyToken } from "../../middleware/authUser.js"

const router = express.Router()

router.post("/user/register", register)
router.post("/user/login", login)
router.post("/user/logout", verifyToken, logout)


export default router