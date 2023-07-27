import mongoose from "mongoose"
const { Schema } = mongoose

const mangaSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  coverURL: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    default: "",
  },
  synopsis: {
    type: String,
    default: "",
  },
  genre: {
    type: Array,
    default: [],
  },
  type: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: ""
  },
  released: {
    type: String,
    default: "",
  },
}, { timestamps: true })

export default mongoose.model("Manga", mangaSchema)