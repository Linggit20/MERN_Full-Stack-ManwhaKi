import User from "../models/User.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import nodemailer from "nodemailer"


/**=============================================================== CLIENT CONTROLLER ============================================================*/

//  Create new account
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body
    const hashPassword = await bcrypt.hash(password, 15)

    const isExist = await User.findOne({ $or: [{ email: email }, { username: username }] })
    if (isExist) {
      if (isExist.email === email) {
        return res.status(409).json({ error: "Email is already taken"})
      }
      if (isExist.username === username) {
        return res.status(409).json({ error: "Username is already taken" })
      }
    }

    const user = new User({
      username,
      email,
      password: hashPassword
    })

    await user.save()

    const token = jwt.sign({ id: user._id }, process.env.JWT_USER_KEY)
    const { password:_, _id, resetToken, resetTokenExpires, createdAt, updatedAt, __v, ...info } = user._doc
    res.cookie("accessToken", token, {
      httpOnly: false,
      sameSite: "none",
      secure: true,
    }).status(200).json({message: "Account created successfully", info})
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "Something went wrong" })
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
    const { password:_, _id, resetToken, resetTokenExpires, createdAt, updatedAt, __v, ...info } = user._doc
    res.cookie("accessToken", token, {
      httpOnly: false,
      sameSite: "none",
      secure: true, 
    }).status(200).json({message: "Successfully logged in", info})
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


// updata credentials
export const updateCredentials = async (req, res) => {
  try {
    const { currentPassword, username, newPassword } = req.body

    const user = await User.findById(req.id)
    if (!user) return res.status(404).json({ error: "User not found" })

    if (currentPassword) {
      const passwordMatch = await bcrypt.compare(currentPassword, user.password)
      if (!passwordMatch) return res.status(400).json({ error: "Current password is incorrect" })
    }

    if (username) {
      user.username = username;
    }

    if (newPassword) {
      const hashNewPassword = await bcrypt.hash(newPassword, 15);
      user.password = hashNewPassword;
    }

    await user.save()
    return res.status(200).send("Credentials updated successfully")
  } catch (err) {
    console.log(err)
    return res.status(500).send("Something went wrong")
  }
}


// find account
export const findAccount = async (req, res) => {
  try {
    const { email } = req.params

    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ error: "User not found"})

    const {_id, password, createdAt, updatedAt, __v, ...info } = user._doc
    res.status(200).json(info)
  } catch (err) {
    console.log(err)
  }
}


//  Request to reset password
export const requestResetLink = async (req, res) => {
  try {
    const { username } = req.params

    const user = await User.findOne({ username })
    if (!user) return res.status(404).json({ error: "Account not found" })

    if (user.resetToken && user.resetTokenExpires > Date.now()) {
      return res.status(400).json({ message: "A reset link has already been sent. Please check your email." })
    }

    const secret = process.env.JWT_RESET_KEY
    const token = jwt.sign({ email: user.email, id: user._id }, secret, {
      expiresIn: "5m",
    })

    const resetLink = `http://localhost:5173/reset-password?id=${user.id}&token=${token}`

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.USER_KEY,
        pass: process.env.PASSWORD_KEY,
      },
    })

    const mailOptions = {
      from: process.env.USER_KEY,
      to: user.email,
      subject: "Reset Password",
      html: `
        <h1>Reset Your Password</h1>
        <p>Dear ${user.username},</p>
        <p>Click the link below to reset your password:</p>
        <p><a href="${resetLink}">${resetLink}</a></p>
        <p>Please note that this link will expire in 5 minutes.</p>
        <p>If you did not request a password reset, please ignore this email.</p>
        <p>Best regards,</p>
        <p>Your Manga Project Team</p>
      `,
    }

    user.resetToken = token
    user.resetTokenExpires = Date.now() + 5 * 60 * 1000 // 5 minutes in milliseconds
    await user.save()

    
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error)
        res.status(500).json({ error: "Failed to send password reset email" })
      } else {
        console.log("Email sent:", info.response)
        res.status(200).json({ message: "Password reset link sent successfully" })
      }
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "Something went wrong" })
  }
}


//  Reset password using the reset password request
export const resetPassword = async (req, res) => {
  try {
    const { userId, token } = req.params
    const { newPassword } = req.body

    const decodedToken = jwt.verify(token, process.env.JWT_RESET_KEY, { ignoreExpiration: true })
    if (decodedToken.exp < Date.now() / 1000) return res.status(401).json({ error: "Token is expired. Please create new one" })

    if (decodedToken.id !== userId) return res.status(401).json({ error: "Invalid token" })

    const user = await User.findById(userId)
    if (!user) return res.status(404).json({ error: "User not found" })

    const hashedPassword = await bcrypt.hash(newPassword, 15)
    user.password = hashedPassword
    await user.save()
    res.status(200).json({ message: "Password updated successfully. You can now log in" })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "Internal server error" })
  }
}