import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../common/database.config.js';

export class UserModel extends Model {
}

UserModel.init({
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('contributor', 'admin'),
    defaultValue: 'contributor',
    allowNull: false,
  }
}, { sequelize, modelName: UserModel.name, tableName: 'user' });
