import mongoose from "mongoose"
const { Schema } = mongoose

const mangaViewSchema = new Schema({
  mangaId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  viewedBy: [{
    type: Schema.Types.ObjectId,
    ref: "User",
  }],
}, { timestamps: true })

export default mongoose.model("MangaView", mangaViewSchema)
