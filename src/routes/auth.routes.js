import { Router } from 'express'
import { body } from 'express-validator'
import { register, login, me } from '../controllers/auth.controller.js'
import authenticate from '../middleware/auth.middleware.js'

const router = Router()

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Registro y autenticación
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Elizabeth Patiño
 *               email:
 *                 type: string
 *                 format: email
 *                 example: eli@example.com
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: miPassword123
 *     responses:
 *       201:
 *         description: Usuario creado — retorna JWT
 *       400:
 *         $ref: '#/components/schemas/Error'
 *       409:
 *         description: Email ya registrado
 */
router.post(
  '/register',
  [
    body('name')
      .trim()
      .isLength({ min: 2 })
      .withMessage('El nombre debe tener al menos 2 caracteres'),
    body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('La contraseña debe tener al menos 6 caracteres'),
  ],
  register,
)

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: eli@example.com
 *               password:
 *                 type: string
 *                 example: miPassword123
 *     responses:
 *       200:
 *         description: Login exitoso — retorna JWT
 *       401:
 *         description: Credenciales inválidas
 */
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
    body('password').notEmpty().withMessage('La contraseña es requerida'),
  ],
  login,
)

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Perfil del usuario autenticado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: No autenticado
 */
router.get('/me', authenticate, me)

export default router
