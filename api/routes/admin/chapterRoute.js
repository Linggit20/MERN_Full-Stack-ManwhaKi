import express from "express"
import { uploadChapter, updateChapter, deleteChapter, getAllChapter, updateContentURLs } from "../../controllers/chapter.js"
import { verifyToken } from "../../middleware/authAdmin.js"
import { checkPermissions } from "../../middleware/checkPermission.js"

const router = express.Router()

router.post("/upload/chapter/:mangaId", verifyToken, checkPermissions, uploadChapter)
router.put("/chapter/update/:chapterId", verifyToken, checkPermissions, updateChapter)
router.put("/content/domain/:id", verifyToken, checkPermissions, updateContentURLs)
router.delete("/manga/chapter/delete/:chapterId", verifyToken, checkPermissions, deleteChapter)
router.get("/manga/:mangaId", verifyToken, getAllChapter)


export default router