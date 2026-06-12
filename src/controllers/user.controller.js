import { validationResult } from 'express-validator'
import { User } from '../models/index.js'

export const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query
    const offset = (parseInt(page) - 1) * parseInt(limit)

    const { count, rows } = await User.findAndCountAll({
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']],
    })

    res.json({
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit)),
      },
    })
  } catch (error) {
    next(error)
  }
}

export const updateUserRole = async (req, res, next) => {
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

    const user = await User.findByPk(req.params.id)
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' })
    if (user.id === req.user.id)
      return res.status(400).json({ error: 'No podés cambiar tu propio rol' })

    await user.update({ role: req.body.role })
    res.json(user)
  } catch (error) {
    next(error)
  }
}

export const deactivateUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id)
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' })
    if (user.id === req.user.id)
      return res
        .status(400)
        .json({ error: 'No podés desactivar tu propia cuenta' })

    await user.update({ isActive: false })
    res.json({ message: 'Usuario desactivado correctamente' })
  } catch (error) {
    next(error)
  }
}
