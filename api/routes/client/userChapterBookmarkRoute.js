import express from "express"
import { addToChapterBookmark, getAllChapterBookmark } from "../../controllers/userChapterBookmark.js"
import { verifyToken } from "../../middleware/authUser.js"

const router  = express.Router()

router.post("/bookmarks/:mangaId/:chapterId", verifyToken, addToChapterBookmark)
router.get("/bookmarks/chapter", verifyToken, getAllChapterBookmark)

export default router