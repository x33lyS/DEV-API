import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../common/database.config.js';

export class LivescoreModel extends Model {
}

LivescoreModel.init({
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  publicationDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, { sequelize, modelName: LivescoreModel.name, tableName: 'livescore' });
