import mongoose from "mongoose"
const { Schema } = mongoose

const recommendedSchema = new Schema({
  manga: [{
    type: Schema.Types.ObjectId,
    ref: "Manga",
    required: true,
  }],
}, { timestamps: true })

export default mongoose.model("Recommended", recommendedSchema)
