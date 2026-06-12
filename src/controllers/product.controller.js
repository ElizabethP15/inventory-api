import { Op } from 'sequelize'
import { validationResult } from 'express-validator'
import { Product, Category, User } from '../models/index.js'

export const getProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      categoryId,
      minPrice,
      maxPrice,
      isActive,
    } = req.query
    const offset = (parseInt(page) - 1) * parseInt(limit)

    const where = {}

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { sku: { [Op.iLike]: `%${search}%` } },
      ]
    }

    if (categoryId) where.categoryId = categoryId
    if (minPrice)
      where.price = { ...where.price, [Op.gte]: parseFloat(minPrice) }
    if (maxPrice)
      where.price = { ...where.price, [Op.lte]: parseFloat(maxPrice) }
    if (isActive !== undefined) where.isActive = isActive === 'true'

    const { count, rows } = await Product.findAndCountAll({
      where,
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name'] },
        { model: User, as: 'creator', attributes: ['id', 'name'] },
      ],
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

export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        { model: Category, as: 'category' },
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
      ],
    })

    if (!product)
      return res.status(404).json({ error: 'Producto no encontrado' })

    res.json(product)
  } catch (error) {
    next(error)
  }
}

export const createProduct = async (req, res, next) => {
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

    const { name, description, price, stock, sku, categoryId } = req.body

    const category = await Category.findByPk(categoryId)
    if (!category)
      return res.status(404).json({ error: 'Categoría no encontrada' })

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      sku,
      categoryId,
      createdBy: req.user.id,
    })

    const created = await Product.findByPk(product.id, {
      include: [{ model: Category, as: 'category' }],
    })

    res.status(201).json(created)
  } catch (error) {
    next(error)
  }
}

export const updateProduct = async (req, res, next) => {
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

    const product = await Product.findByPk(req.params.id)
    if (!product)
      return res.status(404).json({ error: 'Producto no encontrado' })

    if (req.body.categoryId) {
      const category = await Category.findByPk(req.body.categoryId)
      if (!category)
        return res.status(404).json({ error: 'Categoría no encontrada' })
    }

    await product.update(req.body)

    const updated = await Product.findByPk(product.id, {
      include: [{ model: Category, as: 'category' }],
    })

    res.json(updated)
  } catch (error) {
    next(error)
  }
}

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id)
    if (!product)
      return res.status(404).json({ error: 'Producto no encontrado' })

    // Soft delete — solo desactiva, no borra el registro
    await product.update({ isActive: false })
    res.json({ message: 'Producto desactivado correctamente' })
  } catch (error) {
    next(error)
  }
}
