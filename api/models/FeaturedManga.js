import mongoose from "mongoose"
const { Schema } = mongoose

const featuredMangaSchema = new Schema({
  manga: [{
    type: Schema.Types.ObjectId,
    ref: "Manga",
    required: true,
  }],
}, { timestamps: true })

export default mongoose.model("FeaturedManga", featuredMangaSchema)
