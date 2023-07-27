import mongoose from "mongoose"
const { Schema } = mongoose

const adminSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "guest"],
    default: "guest",
  },
  resetToken: {
    type: String,
    default: null,
  },
  resetTokenExpires: {
    type: Date,
    default: null,
  },
}, { timestamps: true })

export default mongoose.model("Admin", adminSchema)
