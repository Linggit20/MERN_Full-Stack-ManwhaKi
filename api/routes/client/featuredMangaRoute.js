import express from "express"
import { getAllFeaturedManga } from "../../controllers/featuredManga.js"


const router = express.Router()

router.get("/featured",  getAllFeaturedManga)



export default router