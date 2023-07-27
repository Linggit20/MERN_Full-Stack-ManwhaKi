import express from "express"
import { createFeaturedManga, getAllFeaturedManga, removeFeaturedManga } from "../../controllers/featuredManga.js"
import { verifyToken } from "../../middleware/authAdmin.js"
import { checkPermissions } from "../../middleware/checkPermission.js"

const router = express.Router()

router.post("/add/featured/:mangaId", verifyToken, checkPermissions, createFeaturedManga)
router.get("/featured/all", verifyToken, getAllFeaturedManga)
router.delete("/remove/featured/:mangaId", verifyToken, checkPermissions, removeFeaturedManga)


export default router