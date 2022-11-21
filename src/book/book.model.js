import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../common/database.config.js';

export class BookModel extends Model {
}

BookModel.init({
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  publicationDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, { sequelize, modelName: BookModel.name, tableName: 'book' });
