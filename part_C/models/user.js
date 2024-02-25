const { Model, DataTypes, Sequelize } = require('sequelize')

const { sequelize } = require('../util/db')

class User extends Model {}

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  createdAt: {
      field: 'created_at',
      type: Sequelize.DATE,
  },
  updatedAt: {
      field: 'updated_at',
      type: Sequelize.DATE,
  },
  disabled: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false    
  }
}, {
  sequelize,
  underscored: true,
  modelName: 'user'
})

module.exports = User