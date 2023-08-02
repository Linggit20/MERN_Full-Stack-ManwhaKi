import mongoose from "mongoose"
const { Schema } = mongoose

const userSchema = new Schema({
  username:  {
    type: String,
    required: true,
    unique: true,
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
  resetToken: {
    type: String,
    default: null,
  },
  resetTokenExpires: {
    type: Date,
    default: null,
  },
}, { timestamps: true })

export default mongoose.model("User", userSchema)