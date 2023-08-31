import express from "express"
import { register, login, logout, resetPassword, findAccount, updatePassword, handleRefreshToken} from "../../controllers/authAdmin.js"
import { verifyToken } from "../../middleware/authAdmin.js"

const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.post("/logout", verifyToken, logout)
router.get("/find/:email", findAccount)
router.post("/reset-password/:email", resetPassword)
router.post("/reset-password/:adminId/:token", updatePassword)
router.get("/refresh", handleRefreshToken)

export default router