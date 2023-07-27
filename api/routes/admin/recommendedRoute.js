import express from "express"
import { addRecommended, getAllRecommended, removeRecommended } from "../../controllers/recommended.js"
import { verifyToken } from "../../middleware/authAdmin.js"
import { checkPermissions } from "../../middleware/checkPermission.js"

const router = express.Router()

router.post("/add/recommend/:mangaId", verifyToken, checkPermissions, addRecommended)
router.delete("/remove/recommend/:mangaId", verifyToken, checkPermissions, removeRecommended)
router.get("/recommend/all", verifyToken, getAllRecommended)


export default router