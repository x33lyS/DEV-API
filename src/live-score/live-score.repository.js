import { LiveScoreModel } from './live-score.model.js';

class LiveScoreRepository {
  findAll = () => LiveScoreModel.findAll();

  findByPage = (offset, limit) => LiveScoreModel.findAndCountAll({ limit, offset })
    .then(({ rows: items, count }) => ({ items, count }));

  findById = id => LiveScoreModel.findByPk(id, { rejectOnEmpty: true });

  create = item => LiveScoreModel.create(item);

  update = (id, item) => this.findById(id)
    .then(itemToUpdate => itemToUpdate.update(item))
    .then(() => this.findById(id));

  replace = (id, item) => this.findById(id)
    .then(itemToUpdate => itemToUpdate.update(item))
    .then(() => this.findById(id));

  remove = id => this.findById(id)
    .then(() => LiveScoreModel.destroy({ where: { id } }));
}

export const livescoreRepository = new LiveScoreRepository();
