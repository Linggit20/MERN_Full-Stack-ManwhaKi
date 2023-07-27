import express from "express"
import { uploadManga, updateManga, deleteManga, getMangaList, getMangaListPaginated } from "../../controllers/manga.js"
import { checkPermissions } from "../../middleware/checkPermission.js"
import { verifyToken } from "../../middleware/authAdmin.js"


const router = express.Router()

router.post("/upload/manga", verifyToken, checkPermissions, uploadManga)
router.put("/update/manga/:mangaId", verifyToken, checkPermissions, updateManga)
router.delete("/manga/delete/:mangaId", verifyToken, checkPermissions, deleteManga)
router.get("/manga/all", verifyToken, getMangaList)
router.get("/manga/all/paginated", verifyToken, getMangaListPaginated)


export default router