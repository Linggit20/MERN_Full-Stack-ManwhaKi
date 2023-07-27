import mongoose from "mongoose"
const { Schema } = mongoose

const userBookmarkSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  mangaIds: [{
    type: Schema.Types.ObjectId,
    ref: "Manga",
  }],
}, { timestamps: true })

export default mongoose.model("UserBookmark", userBookmarkSchema)
