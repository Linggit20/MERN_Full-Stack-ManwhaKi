import express from "express"
import { scrapeData } from "../../controllers/scrapeWebsite.js"
import { verifyToken } from "../../middleware/authAdmin.js"

const router = express.Router()

router.get("/scrape", verifyToken, scrapeData)

export default router