import { DataTypes } from 'sequelize'
import bcrypt from 'bcryptjs'
import sequelize from '../config/database.js'

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Elizabeth Patiño
 *         email:
 *           type: string
 *           example: eli@example.com
 *         role:
 *           type: string
 *           enum: [admin, user]
 *         createdAt:
 *           type: string
 *           format: date-time
 */
const User = sequelize.define(
  'User',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'El nombre no puede estar vacío' },
        len: {
          args: [2, 100],
          msg: 'El nombre debe tener entre 2 y 100 caracteres',
        },
      },
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: { msg: 'Este email ya está registrado' },
      validate: { isEmail: { msg: 'El email no tiene formato válido' } },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [6, 255],
          msg: 'La contraseña debe tener al menos 6 caracteres',
        },
      },
    },
    role: {
      type: DataTypes.ENUM('admin', 'user'),
      defaultValue: 'user',
    },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  {
    tableName: 'users',
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) user.password = await bcrypt.hash(user.password, 12)
      },
      beforeUpdate: async (user) => {
        if (user.changed('password'))
          user.password = await bcrypt.hash(user.password, 12)
      },
    },
  },
)

User.prototype.validatePassword = async function (password) {
  return bcrypt.compare(password, this.password)
}

User.prototype.toJSON = function () {
  const values = { ...this.get() }
  delete values.password
  return values
}

export default User
