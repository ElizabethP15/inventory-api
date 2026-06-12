import sequelize from '../config/database.js'
import User from './User.js'
import Category from './Category.js'
import Product from './Product.js'

// Relaciones
Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' })
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' })

User.hasMany(Product, { foreignKey: 'createdBy', as: 'products' })
Product.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' })

export { sequelize, User, Category, Product }
