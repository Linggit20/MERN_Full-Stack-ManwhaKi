import express from "express"
import { register, login, logout, updateCredentials, findAccount, requestResetLink, resetPassword } from "../../controllers/authUser.js"
import { verifyToken } from "../../middleware/authUser.js"

const router = express.Router()

router.post("/user/register", register)
router.post("/user/login", login)
router.post("/user/logout", verifyToken, logout)
router.put("/user/update", verifyToken, updateCredentials)
router.post("/user/find/:email", findAccount )
router.post("/reset/link/:username", requestResetLink )
router.post("/reset-password/:userId/:token", resetPassword)


export default router