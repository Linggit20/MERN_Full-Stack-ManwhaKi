import jwt from "jsonwebtoken"

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader?.split(' ')[1]
    if (!token) res.status(401).json({ error: "Token is not valid!" })

    jwt.verify(token, process.env.JWT_DASHBOARD_SECRET, (err, payload) => {
      if (err) return res.status(403).json({ error: "Unauthorize Access" })

      req.id = payload.id
      req.role = payload.role
      next()
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
