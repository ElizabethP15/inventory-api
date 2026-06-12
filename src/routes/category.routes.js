import { Router } from 'express'
import { body } from 'express-validator'
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/category.controller.js'
import authenticate from '../middleware/auth.middleware.js'
import requireRole from '../middleware/role.middleware.js'

const router = Router()

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Categorías de productos
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Listar todas las categorías con conteo de productos
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de categorías
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: '#/components/schemas/Category'
 *                   - type: object
 *                     properties:
 *                       productCount:
 *                         type: integer
 *                         example: 12
 */
router.get('/', authenticate, getCategories)
router.get('/:id', authenticate, getCategoryById)

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Crear categoría (solo admin)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string, example: Electrónicos }
 *               description: { type: string }
 *     responses:
 *       201:
 *         description: Categoría creada
 */
router.post(
  '/',
  authenticate,
  requireRole('admin'),
  [body('name').trim().notEmpty().withMessage('El nombre es requerido')],
  createCategory,
)

router.put(
  '/:id',
  authenticate,
  requireRole('admin'),
  [
    body('name')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('El nombre no puede estar vacío'),
  ],
  updateCategory,
)

router.delete('/:id', authenticate, requireRole('admin'), deleteCategory)

export default router
