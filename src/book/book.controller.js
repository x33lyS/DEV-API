import { bookService } from './book.service.js';

class BookController {
  findPage = (request, response, next) => {
    bookService.findPage(request.query.pageIndex, request.query.pageSize)
      .then(({ items, totalCount }) => {
        response.header('x-total-count', totalCount);
        response.json(items);
      })
      .catch(next);
  };

  findById = (request, response, next) => {
    bookService.findById(request.params.id)
      .then(item => response.json(item))
      .catch(next);
  };

  create = (request, response, next) => {
    bookService.create(request.body)
      .then(item => response.status(201).json(item))
      .catch(next);
  };

  update = (request, response, next) => {
    bookService.update(request.params.id, request.body)
      .then(item => response.json(item))
      .catch(next);
  };

  replace = (request, response, next) => {
    bookService.replace(request.params.id, request.body)
      .then(item => response.json(item))
      .catch(next);
  };

  remove = (request, response, next) => {
    bookService.remove(request.params.id)
      .then(() => response.status(204).json())
      .catch(next);
  };
}
export const bookController = new BookController();
