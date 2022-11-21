import { livescoreRepository } from './livescore.repository.js';
import { mapFromDto, mapFromPartialDto, mapToDto } from './livescore.mapper.js';

class LivescoreService {
  findPage = (pageIndex, pageSize) => {
    if (!pageIndex && !pageSize) {
      return livescoreRepository.findAll()
        .then(models => ({
          items: models.map(mapToDto),
          totalCount: models.length,
        }));
    }
    pageIndex = Number(pageIndex);
    pageSize = Number(pageSize);
    return livescoreRepository.findByPage(pageIndex * pageSize, pageSize)
      .then(({ items, count }) => ({
        items: items.map(mapToDto),
        totalCount: count,
      }));
  };

  findById = id => Promise.resolve(id)
    .then(id => Number(id))
    .then(id => livescoreRepository.findById(id))
    .then(model => mapToDto(model));

  create = dto => Promise.resolve(dto)
    .then(dto => mapFromDto(dto))
    .then(model => livescoreRepository.create(model))
    .then(model => mapToDto(model));

  update = (id, partialDto) => Promise.resolve({ id, partialDto })
    .then(({ id, partialDto }) => ({
      id: Number(id),
      model: mapFromPartialDto(partialDto),
    }))
    .then(({ id, model }) => livescoreRepository.update(id, model))
    .then(model => mapToDto(model));

  replace = (id, dto) => Promise.resolve({ id, dto })
    .then(({ id, dto }) => ({
      id: Number(id),
      model: mapFromDto(dto),
    }))
    .then(({ id, model }) => livescoreRepository.replace(id, model))
    .then(model => mapToDto(model));

  remove = id => Promise.resolve(id)
    .then(id => Number(id))
    .then(id => livescoreRepository.remove(id))
    .then(() => undefined);
}

export const livescoreService = new LivescoreService();
