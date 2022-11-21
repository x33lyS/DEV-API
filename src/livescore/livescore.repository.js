import { LivescoreModel } from './livescore.model.js';

class LivescoreRepository {
  findAll = () => LivescoreModel.findAll();

  findByPage = (offset, limit) => LivescoreModel.findAndCountAll({ limit, offset })
    .then(({ rows: items, count }) => ({ items, count }));

  findById = id => LivescoreModel.findByPk(id, { rejectOnEmpty: true });

  create = item => LivescoreModel.create(item);

  update = (id, item) => this.findById(id)
    .then(itemToUpdate => itemToUpdate.update(item))
    .then(() => this.findById(id));

  replace = (id, item) => this.findById(id)
    .then(itemToUpdate => itemToUpdate.update(item))
    .then(() => this.findById(id));

  remove = id => this.findById(id)
    .then(() => LivescoreModel.destroy({ where: { id } }));
}

export const livescoreRepository = new LivescoreRepository();
