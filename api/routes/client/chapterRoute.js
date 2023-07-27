import express from "express"
import { allChapter, getSingleChapter } from "../../controllers/chapter.js"

const router = express.Router()

router.get("/chapter/:slug/all", allChapter)
router.get("/chapter/:slug", getSingleChapter)

export default router