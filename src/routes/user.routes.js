import { Router } from 'express'
import { body } from 'express-validator'
import {
  getUsers,
  updateUserRole,
  deactivateUser,
} from '../controllers/user.controller.js'
import authenticate from '../middleware/auth.middleware.js'
import requireRole from '../middleware/role.middleware.js'

const router = Router()

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestión de usuarios (solo admin)
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Listar usuarios paginados (solo admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Lista paginada de usuarios
 *       403:
 *         description: Sin permisos
 */
router.get('/', authenticate, requireRole('admin'), getUsers)

/**
 * @swagger
 * /api/users/{id}/role:
 *   patch:
 *     summary: Cambiar rol de un usuario (solo admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [role]
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [admin, user]
 *     responses:
 *       200:
 *         description: Rol actualizado
 *       400:
 *         description: No podés cambiar tu propio rol
 */
router.patch(
  '/:id/role',
  authenticate,
  requireRole('admin'),
  [
    body('role')
      .isIn(['admin', 'user'])
      .withMessage('El rol debe ser admin o user'),
  ],
  updateUserRole,
)

router.patch(
  '/:id/deactivate',
  authenticate,
  requireRole('admin'),
  deactivateUser,
)

export default router
