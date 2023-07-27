import express from "express"
import { addToBookmarks, removeFromBookmarks, getBookmarkedManga } from "../../controllers/userBookmark.js"
import { verifyToken } from "../../middleware/authUser.js"

const router = express.Router()

router.post("/bookmark/add/manga/:mangaId", verifyToken, addToBookmarks)
router.post("/bookmark/remove/manga/:mangaId", verifyToken, removeFromBookmarks)
router.get("/users/bookmarks", verifyToken, getBookmarkedManga)

export default router