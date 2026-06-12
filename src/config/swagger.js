import swaggerJsdoc from 'swagger-jsdoc'

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Inventory Management API',
      version: '1.0.0',
      description:
        'RESTful API para gestión de inventario de pequeños negocios. ' +
        'Autenticación JWT, roles admin/user, búsqueda y filtros con paginación.',
      contact: {
        name: 'Elizabeth Patiño',
        url: 'https://github.com/elizapatinohenao',
      },
    },
    servers: [
      {
        url:
          process.env.NODE_ENV === 'production'
            ? 'https://tu-app.onrender.com' // actualizar al hacer deploy
            : 'http://localhost:3000',
        description:
          process.env.NODE_ENV === 'production' ? 'Producción' : 'Desarrollo',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT obtenido de POST /api/auth/login',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            details: { type: 'array', items: { type: 'string' } },
          },
        },
        Pagination: {
          type: 'object',
          properties: {
            total: { type: 'integer' },
            page: { type: 'integer' },
            limit: { type: 'integer' },
            totalPages: { type: 'integer' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js', './src/models/*.js'],
}

export default swaggerJsdoc(options)
