import mongoose from "mongoose"
const { Schema } = mongoose

const chapterSchema = new Schema({
  manga: {
    type: Schema.Types.ObjectId,
    ref: "Manga",
    required: true,
  },
  fullTitle: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  shortTitle: {
    type: String,
    required: true,
  },
  chapterNum: {
    type: Number,
    required: true,
  },
  chapterNav: {
    type: Object,
    default: "",
  },
  contentURL: {
    type: Array,
    required: true,
  },
}, { timestamps: true })

export default mongoose.model("Chapter", chapterSchema)