import jwt from 'jsonwebtoken'
import { validationResult } from 'express-validator'
import { User } from '../models/index.js'

const generateToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
  )

export const register = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({
          error: 'Datos inválidos',
          details: errors.array().map((e) => e.msg),
        })
    }

    const { name, email, password } = req.body

    const existing = await User.findOne({ where: { email } })
    if (existing)
      return res.status(409).json({ error: 'El email ya está registrado' })

    const user = await User.create({ name, email, password })
    const token = generateToken(user)

    res.status(201).json({ user, token })
  } catch (error) {
    next(error)
  }
}

export const login = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({
          error: 'Datos inválidos',
          details: errors.array().map((e) => e.msg),
        })
    }

    const { email, password } = req.body

    const user = await User.findOne({ where: { email } })
    if (!user || !user.isActive)
      return res.status(401).json({ error: 'Credenciales inválidas' })

    const isValid = await user.validatePassword(password)
    if (!isValid)
      return res.status(401).json({ error: 'Credenciales inválidas' })

    res.json({ user, token: generateToken(user) })
  } catch (error) {
    next(error)
  }
}

export const me = (req, res) => res.json(req.user)
