import express from "express"
import { getMangaViews } from "../../controllers/mangaViews.js"
import { verifyToken } from "../../middleware/authAdmin.js"

const router = express.Router()

router.get("/views/all", verifyToken, getMangaViews)

export default router