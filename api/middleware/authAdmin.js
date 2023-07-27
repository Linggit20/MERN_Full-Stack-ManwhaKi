import jwt from "jsonwebtoken"

export const verifyToken = (req, res, next) => {
 try {
  const token = req.cookies.accessToken
  if (!token) return res.status(403).send("Unauthorized")

  jwt.verify(token, process.env.JWT_ADMIN_KEY, async (err, payload) => {
  if (err) return res.status(401).json({ error: "Token is not valid!" })

    req.id = payload.id
    req.role = payload.role
    next()
  })
 } catch (err) {
  res.status(500).json({ error: err.message })
 }
}
