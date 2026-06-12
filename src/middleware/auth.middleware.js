import jwt from 'jsonwebtoken'
import { User } from '../models/index.js'

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token no proporcionado' })
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findByPk(decoded.id)
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Usuario no encontrado o inactivo' })
    }

    req.user = user
    next()
  } catch (error) {
    if (error.name === 'JsonWebTokenError')
      return res.status(401).json({ error: 'Token inválido' })
    if (error.name === 'TokenExpiredError')
      return res.status(401).json({ error: 'Token expirado' })
    next(error)
  }
}

export default authenticate
