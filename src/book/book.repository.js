import { BookModel } from './book.model.js';

class BookRepository {
  findAll = () => BookModel.findAll();

  findByPage = (offset, limit) => BookModel.findAndCountAll({ limit, offset })
    .then(({ rows: items, count }) => ({ items, count }));

  findById = id => BookModel.findByPk(id, { rejectOnEmpty: true });

  create = item => BookModel.create(item);

  update = (id, item) => this.findById(id)
    .then(itemToUpdate => itemToUpdate.update(item))
    .then(() => this.findById(id));

  replace = (id, item) => this.findById(id)
    .then(itemToUpdate => itemToUpdate.update(item))
    .then(() => this.findById(id));

  remove = id => this.findById(id)
    .then(() => BookModel.destroy({ where: { id } }));
}

export const bookRepository = new BookRepository();
