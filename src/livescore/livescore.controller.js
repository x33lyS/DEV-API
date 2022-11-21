import { livescoreService } from './livescore.service.js';

class LivescoreController {
  findPage = (request, response, next) => {
    livescoreService.findPage(request.query.pageIndex, request.query.pageSize)
      .then(({ items, totalCount }) => {
        response.header('x-total-count', totalCount);
        response.json(items);
      })
      .catch(next);
  };

  findById = (request, response, next) => {
    livescoreService.findById(request.params.id)
      .then(item => response.json(item))
      .catch(next);
  };

  create = (request, response, next) => {
    livescoreService.create(request.body)
      .then(item => response.status(201).json(item))
      .catch(next);
  };

  update = (request, response, next) => {
    livescoreService.update(request.params.id, request.body)
      .then(item => response.json(item))
      .catch(next);
  };

  replace = (request, response, next) => {
    livescoreService.replace(request.params.id, request.body)
      .then(item => response.json(item))
      .catch(next);
  };

  remove = (request, response, next) => {
    livescoreService.remove(request.params.id)
      .then(() => response.status(204).json())
      .catch(next);
  };
}
export const livescoreController = new LivescoreController();
