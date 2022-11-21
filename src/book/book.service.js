import { bookRepository } from './book.repository.js';
import { mapFromDto, mapFromPartialDto, mapToDto } from './book.mapper.js';

class BookService {
  findPage = (pageIndex, pageSize) => {
    if (!pageIndex && !pageSize) {
      return bookRepository.findAll()
        .then(models => ({
          items: models.map(mapToDto),
          totalCount: models.length,
        }));
    }
    pageIndex = Number(pageIndex);
    pageSize = Number(pageSize);
    return bookRepository.findByPage(pageIndex * pageSize, pageSize)
      .then(({ items, count }) => ({
        items: items.map(mapToDto),
        totalCount: count,
      }));
  };

  findById = id => Promise.resolve(id)
    .then(id => Number(id))
    .then(id => bookRepository.findById(id))
    .then(model => mapToDto(model));

  create = dto => Promise.resolve(dto)
    .then(dto => mapFromDto(dto))
    .then(model => bookRepository.create(model))
    .then(model => mapToDto(model));

  update = (id, partialDto) => Promise.resolve({ id, partialDto })
    .then(({ id, partialDto }) => ({
      id: Number(id),
      model: mapFromPartialDto(partialDto),
    }))
    .then(({ id, model }) => bookRepository.update(id, model))
    .then(model => mapToDto(model));

  replace = (id, dto) => Promise.resolve({ id, dto })
    .then(({ id, dto }) => ({
      id: Number(id),
      model: mapFromDto(dto),
    }))
    .then(({ id, model }) => bookRepository.replace(id, model))
    .then(model => mapToDto(model));

  remove = id => Promise.resolve(id)
    .then(id => Number(id))
    .then(id => bookRepository.remove(id))
    .then(() => undefined);
}

export const bookService = new BookService();
