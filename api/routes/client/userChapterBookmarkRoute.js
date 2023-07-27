import express from "express"
import { addToChapterBookmark } from "../../controllers/userChapterBookmark.js"
import { verifyToken } from "../../middleware/authUser.js"

const router  = express.Router()

router.post("/bookmarks/:mangaId/:chapterId", verifyToken, addToChapterBookmark)

export default router