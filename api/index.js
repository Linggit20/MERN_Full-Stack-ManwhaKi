import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"

// Admin dashboard
import authAdminRouter from "./routes/admin/authAdminRoute.js"
import chapterRouter from "./routes/admin/chapterRoute.js"
import featuredMangaRouter from "./routes/admin/featuredMangaRoute.js"
import mangaRouter from "./routes/admin/mangaRoute.js"
import mangaViewRouter from "./routes/admin/mangaViewRoute.js"
import adminRouter from "./routes/admin/adminRoute.js"
import scrapeWebsiteRouter from "./routes/admin/scrapeWebsiteRoute.js"
import recommendedRouter from "./routes/admin/recommendedRoute.js"

// Client
import authUserRouter from "./routes/client/authUserRoute.js"
import mangaCollectionRouter from "./routes/client/mangaRoute.js"
import chapterCollectionRouter from "./routes/client/chapterRoute.js"
import userBookmarkRouter from "./routes/client/userBookmarkRoute.js"
import userChapterBookmarkRouter from "./routes/client/userChapterBookmarkRoute.js"


const app = express()
dotenv.config()
app.use(cors({ origin: "http://localhost:5173", credentials: true }))
app.use(express.json())
app.use(cookieParser())


const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log("Connected to MongoDB")
  } catch (err) {
    console.log(err)
  }
}

// Admin dashboard routes
app.use("/api/auth/admin", authAdminRouter)
app.use("/api", mangaRouter)
app.use("/api", chapterRouter)
app.use("/api", featuredMangaRouter)
app.use("/api", mangaViewRouter)
app.use("/api", adminRouter)
app.use("/api", scrapeWebsiteRouter)
app.use("/api", recommendedRouter)

// Client routes
app.use("/api/auth", authUserRouter)
app.use("/api", mangaCollectionRouter)
app.use("/api", chapterCollectionRouter)
app.use("/api", userBookmarkRouter)
app.use("/api", userChapterBookmarkRouter)

app.listen(3001, async () => {
  try {
    await connect()
    console.log("Listening on port 3001")
  } catch (err) {
    console.log(err)
  }
})