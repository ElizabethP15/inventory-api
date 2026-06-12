import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required: [name, price, stock, categoryId]
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Laptop Dell XPS 15
 *         description:
 *           type: string
 *         price:
 *           type: number
 *           format: float
 *           example: 1299.99
 *         stock:
 *           type: integer
 *           example: 10
 *         sku:
 *           type: string
 *           example: DELL-XPS-001
 *         isActive:
 *           type: boolean
 *           example: true
 *         categoryId:
 *           type: integer
 *           example: 1
 *         category:
 *           $ref: '#/components/schemas/Category'
 *         createdAt:
 *           type: string
 *           format: date-time
 */
const Product = sequelize.define(
  'Product',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: { notEmpty: { msg: 'El nombre no puede estar vacío' } },
    },
    description: { type: DataTypes.TEXT, allowNull: true },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: { args: [0], msg: 'El precio no puede ser negativo' } },
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: { min: { args: [0], msg: 'El stock no puede ser negativo' } },
    },
    sku: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: { msg: 'Ya existe un producto con ese SKU' },
    },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    categoryId: { type: DataTypes.INTEGER, allowNull: false },
    createdBy: { type: DataTypes.INTEGER, allowNull: true },
  },
  { tableName: 'products' },
)

export default Product
