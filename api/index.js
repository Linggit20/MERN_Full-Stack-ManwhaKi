import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
import morgan from "morgan"

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
import featuredCollectionRouter from "./routes/client/featuredMangaRoute.js"
import recommendCollectionRouter from "./routes/client/recommendedRoute.js"


const app = express()
dotenv.config()

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://manwhaki-admin.netlify.app",
    "https://manwhaki.netlify.app",
  ],
  credentials: true
}))

app.use(express.json())
app.use(cookieParser())
app.use(morgan("dev"))


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
app.use("/api", featuredCollectionRouter)
app.use("/api", recommendCollectionRouter)


app.listen(process.env.PORT, async () => {
  try {
    await connect()
    console.log(`Listening on port ${process.env.PORT}`)
  } catch (err) {
    console.log(err)
  }
})