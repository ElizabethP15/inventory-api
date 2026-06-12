import 'dotenv/config'
import app from './src/app.js'
import { sequelize } from './src/models/index.js'

const PORT = process.env.PORT || 3000

const startServer = async () => {
  try {
    await sequelize.authenticate()
    console.log('Conexión a PostgreSQL establecida correctamente.')

    await sequelize.sync({ alter: true })
    console.log('Modelos sincronizados con la base de datos.')

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`)
      console.log(`Swagger UI disponible en http://localhost:${PORT}/api-docs`)
    })
  } catch (error) {
    console.error('Error al iniciar el servidor:', error)
    process.exit(1)
  }
}

startServer()
