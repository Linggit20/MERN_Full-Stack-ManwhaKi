import User from "../models/User.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


/**=============================================================== CLIENT CONTROLLER ============================================================*/

//  Create new account
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body
    const hashPassword = await bcrypt.hash(password, 15)

    const isExist = await User.findOne({ $or: [{ email: email }, { username: username }] })
    if (isExist) {
      if (isExist.email === email) {
        return res.status(409).send("Email is already taken")
      }
      if (isExist.username === username) {
        return res.status(409).send("Username is already taken")
      }
    }

    const user = new User({
      username,
      email,
      password: hashPassword
    })

    await user.save()

    const token = jwt.sign({ id: user._id }, process.env.JWT_USER_KEY)

    const { password: _, ...info } = user._doc
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: true,
    }).status(200).send("Account created successfully")
  } catch (err) {
    console.log(err)
    res.status(500).send("Something went wrong")
  }
}


//  Login
export const login = async (req, res) => {
  try {
    const { username, password } = req.body

    const user = await User.findOne({ username })
    if (!user) return res.status(404).json({ error: "User not found" })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(401).json({ error: "Incorrect username or password" })

    const token = jwt.sign({ id: user._id }, process.env.JWT_USER_KEY)
    
    const { password: _, ...info } = user._doc
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: true, 
    }).status(200).json(info)
  } catch (err) {
    console.log(err)
    res.status(500).send("Something went wrong")
  }
}


//  Logout
export const logout = async (req, res) => {
  res.clearCookie("accessToken", {
    sameSite: "none",
    secure: true,
  }).status(200).send("Logged out successfully")
}