import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required: [name]
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Electrónicos
 *         description:
 *           type: string
 *           example: Dispositivos electrónicos y accesorios
 *         createdAt:
 *           type: string
 *           format: date-time
 */
const Category = sequelize.define(
  'Category',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: { msg: 'Ya existe una categoría con ese nombre' },
      validate: { notEmpty: { msg: 'El nombre no puede estar vacío' } },
    },
    description: { type: DataTypes.TEXT, allowNull: true },
  },
  { tableName: 'categories' },
)

export default Category
