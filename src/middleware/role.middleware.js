// Fábrica: requireRole('admin') o requireRole('admin', 'user')
const requireRole =
  (...roles) =>
  (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'No autenticado' })

    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: 'No tenés permiso para realizar esta acción' })
    }

    next()
  }

export default requireRole
