import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../common/database.config.js';

export class UserModel extends Model {
}

UserModel.init({
  login: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pwd: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('contributor', 'admin'),
    defaultValue: 'contributor',
    allowNull: false,
  }
}, { sequelize, modelName: UserModel.name, tableName: 'user' });
