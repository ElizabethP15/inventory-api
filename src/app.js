import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec from './config/swagger.js'
import errorMiddleware from './middleware/error.middleware.js'
import authRoutes from './routes/auth.routes.js'
import productRoutes from './routes/product.routes.js'
import categoryRoutes from './routes/category.routes.js'
import userRoutes from './routes/user.routes.js'

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Swagger UI — documentación interactiva
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
  }),
)

// Health check — necesario para Render
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Rutas
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/users', userRoutes)

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' })
})

// Error handler centralizado (siempre al final)
app.use(errorMiddleware)

export default app
