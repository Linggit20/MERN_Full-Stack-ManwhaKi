import mongoose from "mongoose"
const { Schema } = mongoose

const bookmarkCountSchema = new Schema({
  mangaId: {
    type: Schema.Types.ObjectId,
    ref: "MangaList",
    unique: true,
  },
  count: {
    type: Number,
    default: 0,
  }
}, { timestamps: true })

export default mongoose.model("BookmarkCount", bookmarkCountSchema)
