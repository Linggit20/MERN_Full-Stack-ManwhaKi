

export const checkPermissions = (req, res, next) => {
  const { role } = req
  if (role !== "admin") return res.status(403).json({ error: "Unauthorized access" })
  next()
}