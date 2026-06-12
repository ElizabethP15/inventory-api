import { Router } from 'express'
import { body } from 'express-validator'
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller.js'
import authenticate from '../middleware/auth.middleware.js'
import requireRole from '../middleware/role.middleware.js'

const router = Router()

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Gestión de productos del inventario
 */

const productValidations = [
  body('name').trim().notEmpty().withMessage('El nombre es requerido'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('El precio debe ser un número positivo'),
  body('stock')
    .isInt({ min: 0 })
    .withMessage('El stock debe ser un entero positivo'),
  body('categoryId')
    .isInt()
    .withMessage('categoryId debe ser un número entero'),
]

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Listar productos con filtros y paginación
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Busca en nombre, descripción y SKU
 *       - in: query
 *         name: categoryId
 *         schema: { type: integer }
 *       - in: query
 *         name: minPrice
 *         schema: { type: number }
 *       - in: query
 *         name: maxPrice
 *         schema: { type: number }
 *       - in: query
 *         name: isActive
 *         schema: { type: boolean }
 *     responses:
 *       200:
 *         description: Lista paginada de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 */
router.get('/', authenticate, getProducts)

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Obtener producto por ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Producto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Producto no encontrado
 */
router.get('/:id', authenticate, getProductById)

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Crear producto (solo admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, price, stock, categoryId]
 *             properties:
 *               name: { type: string, example: Teclado mecánico }
 *               description: { type: string }
 *               price: { type: number, example: 89.99 }
 *               stock: { type: integer, example: 50 }
 *               sku: { type: string, example: KEY-MEC-001 }
 *               categoryId: { type: integer, example: 1 }
 *     responses:
 *       201:
 *         description: Producto creado
 *       403:
 *         description: Sin permisos de administrador
 */
router.post(
  '/',
  authenticate,
  requireRole('admin'),
  productValidations,
  createProduct,
)

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Actualizar producto (solo admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Producto actualizado
 *       404:
 *         description: No encontrado
 */
router.put('/:id', authenticate, requireRole('admin'), updateProduct)

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Desactivar producto — soft delete (solo admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Producto desactivado
 *       404:
 *         description: No encontrado
 */
router.delete('/:id', authenticate, requireRole('admin'), deleteProduct)

export default router
