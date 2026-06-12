import { validationResult } from 'express-validator'
import { Category, Product } from '../models/index.js'

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll({
      include: [
        {
          model: Product,
          as: 'products',
          attributes: ['id'],
          where: { isActive: true },
          required: false,
        },
      ],
      order: [['name', 'ASC']],
    })

    const result = categories.map((cat) => ({
      ...cat.toJSON(),
      productCount: cat.products.length,
      products: undefined,
    }))

    res.json(result)
  } catch (error) {
    next(error)
  }
}

export const getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [
        {
          model: Product,
          as: 'products',
          where: { isActive: true },
          required: false,
        },
      ],
    })

    if (!category)
      return res.status(404).json({ error: 'Categoría no encontrada' })

    res.json(category)
  } catch (error) {
    next(error)
  }
}

export const createCategory = async (req, res, next) => {
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

    const { name, description } = req.body
    const category = await Category.create({ name, description })
    res.status(201).json(category)
  } catch (error) {
    next(error)
  }
}

export const updateCategory = async (req, res, next) => {
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

    const category = await Category.findByPk(req.params.id)
    if (!category)
      return res.status(404).json({ error: 'Categoría no encontrada' })

    await category.update(req.body)
    res.json(category)
  } catch (error) {
    next(error)
  }
}

export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id)
    if (!category)
      return res.status(404).json({ error: 'Categoría no encontrada' })

    const productCount = await Product.count({
      where: { categoryId: req.params.id, isActive: true },
    })
    if (productCount > 0) {
      return res.status(409).json({
        error: `No se puede eliminar: la categoría tiene ${productCount} producto(s) activo(s)`,
      })
    }

    await category.destroy()
    res.json({ message: 'Categoría eliminada correctamente' })
  } catch (error) {
    next(error)
  }
}
