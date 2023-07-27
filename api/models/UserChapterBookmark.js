import mongoose from "mongoose"
const { Schema } = mongoose

const userChapterBookmarkSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  mangaId: {
    type: Schema.Types.ObjectId,
    ref: "MangaList"
  },
  chapters: []

}, { timestamps: true })

export default mongoose.model("UserChapterBookmark", userChapterBookmarkSchema)