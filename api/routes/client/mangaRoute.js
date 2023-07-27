import express from "express"
import { getRecentUpdate, getAllManga, getSingleManga } from "../../controllers/manga.js"

const router = express.Router()

router.get("/manga/recent/all", getRecentUpdate)
router.get("/manga/", getAllManga)
router.get("/single/:slug", getSingleManga)

export default router