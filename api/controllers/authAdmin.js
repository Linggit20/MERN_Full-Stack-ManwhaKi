import Admin from "../models/Admin.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import nodemailer from "nodemailer"


/**=============================================================== DASHBOARD CONTROLLER ============================================================*/

//  Add a new admin account
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body
    const hashPassword = await bcrypt.hash(password, 15)

    const isExist = await Admin.exists({ email: email })
    if (isExist) return res.status(409).json({ error: "Email is already taken" })

    const admin = new Admin({
      name,
      email,
      password: hashPassword
    })

    await admin.save()
    res.status(201).send("Account successfully created. You can now log in.")
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "Something went wrong" })
  }
}


// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const admin = await Admin.findOne({ email })
    if (!admin) return res.status(404).json({ error: "User not found" })

    const isMatch = await bcrypt.compare(password, admin.password)
    if (!isMatch) return res.status(401).json({ error: "Incorrect email or password" })

    const accessToken =  jwt.sign(
      { id: admin._id, role: admin.role},
      process.env.JWT_DASHBOARD_SECRET,
      { expiresIn: "15m" }
    )
    const refreshToken =  jwt.sign(
      { id: admin._id, role: admin.role},
      process.env.JWT_DASHBOARD_REFRESH_SECRET,
      { expiresIn: "1d" }
    )

    admin.refreshToken = refreshToken
    await admin.save()
    
    const { password: _, refreshToken:__, _id, role, createdAt, updatedAt, resetToken, resetTokenExpires, __v, ...info } = admin._doc

    res.cookie("tkn", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
    }).status(200).json({ accessToken, user: info, message: "You successfully logged in"})
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "Something went wrong" })
  }
}



// Logout
export const logout = async (req, res) => {
  try {
    const cookies = req.cookies.tkn
    if (!cookies) return res.sendStatus(204)

    const refreshToken = cookies

    const admin = await Admin.findOne({ refreshToken })
    if (admin) {
      admin.refreshToken= ""
      await admin.save()
      res.clearCookie("tkn", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      }).status(200).json({ message: "Logout successfully"})
    } else {
      res.clearCookie("tkn", {
        httpOnly: true,
        secure: true,
        sameSite: "none"
      }).status(200).json({ message: "Logout successfully"})
    }
  } catch (err) {
    console.log(err)
    res.status(500).send("Something went wrong during logout")
  }
}

// Handle Refresh Token
export const handleRefreshToken = async (req, res) => {
  try {
    const cookies = req.cookies.tkn
    if (!cookies) return res.status(401).json({ error: "Unauthorized"})
    
    const refreshToken = cookies
 
    const user = await Admin.findOne({ refreshToken })
    if(!user) return res.status(403).json({ error: "Forbidden"})

    jwt.verify(
      refreshToken,
      process.env.JWT_DASHBOARD_REFRESH_SECRET,
      (err, payload) => {
        if (err || user._id.toString() !== payload.id || user.role !== payload.role) {
          return res.status(403).json({ error: "Forbidden"})
        }

        const accessToken = jwt.sign(
          { id: payload.id, role: payload.role},
          process.env.JWT_DASHBOARD_SECRET,
          { expiresIn: "15m"}
        )

        res.status(201).json({ accessToken })
      }
    )
  } catch (err) {
    console.log(err)
    res.status(500).send("Something went wrong")
  }
}

//  Find the account to reset password
export const findAccount = async (req, res) => {
  try {
    const { email } = req.params

    const admin = await Admin.findOne({ email })
    if (!admin) return res.status(404).json({ message: "Account not found" })

    const { password, role, createdAt, updatedAt, __v, name, resetToken, resetTokenExpires, ...info } = admin._doc
    
    let maskedName = name
    if (name.length > 3) {
      const firstThreeChars = name.slice(0, 3)
      const lastChar = name.charAt(name.length - 1)
      maskedName = `${firstThreeChars}${"*".repeat(name.length - 4)}${lastChar}`
    }

    const maskedInfo = { ...info, name: maskedName }
    res.status(200).json({ maskedInfo })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "Something went wrong" })
  }
}


//  Request to reset password
export const resetPassword = async (req, res) => {
  try {
    const { email } = req.params

    const admin = await Admin.findOne({ email })
    if (!admin) return res.status(404).json({ error: "Account not found" })

    if (admin.resetToken && admin.resetTokenExpires > Date.now()) {
      return res.status(400).json({ message: "A reset link has already been sent. Please check your email." })
    }

    const secret = process.env.JWT_RESET_KEY
    const token = jwt.sign({ email: admin.email, id: admin._id }, secret, {
      expiresIn: "5m",
    })

    const resetLink = `https://manwhaki-admin.netlify.app/reset-password/update?id=${admin.id}&token=${token}`

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.USER_KEY,
        pass: process.env.PASSWORD_KEY,
      },
    })

    const mailOptions = {
      from: process.env.USER_KEY,
      to: admin.email,
      subject: "Reset Password",
      html: `
        <h1>Reset Your Password</h1>
        <p>Dear ${admin.name},</p>
        <p>Click the link below to reset your password:</p>
        <p><a href="${resetLink}">${resetLink}</a></p>
        <p>Please note that this link will expire in 5 minutes.</p>
        <p>If you did not request a password reset, please ignore this email.</p>
        <p>Best regards,</p>
        <p>Your Manga Project Team</p>
      `,
    }

    admin.resetToken = token
    admin.resetTokenExpires = Date.now() + 5 * 60 * 1000 // 5 minutes in milliseconds
    await admin.save()

    
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


//  Update password using the reset password request
export const updatePassword = async (req, res) => {
  try {
    const { adminId, token } = req.params
    const { newPassword } = req.body

    const decodedToken = jwt.verify(token, process.env.JWT_RESET_KEY, { ignoreExpiration: true })
    if (decodedToken.exp < Date.now() / 1000) return res.status(401).json({ error: "Token is expired. Please create new one" })

    if (decodedToken.id !== adminId) return res.status(401).json({ error: "Invalid token" })

    const admin = await Admin.findById(adminId)
    if (!admin) return res.status(404).json({ error: "Admin not found" })

    const hashedPassword = await bcrypt.hash(newPassword, 15)

    admin.password = hashedPassword
    await admin.save()
    res.status(200).json({ message: "Password updated successfully. You can now log in" })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "Internal server error" })
  }
}
