import express from "express"
import { getAllRecommended} from "../../controllers/recommended.js"


const router = express.Router()

router.get("/recommend", getAllRecommended)

export default router