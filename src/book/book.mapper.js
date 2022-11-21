import { DateTime } from 'luxon';

export const mapToDto = item => {
  const date = item.publicationDate && DateTime.fromJSDate(item.publicationDate);
  return {
    id: item.id,
    title: item.title,
    publication: date?.isValid ? date.toFormat('yyyy-MM-dd') : undefined,
  };
};

const mapTitleFromDto = dto => dto.title?.split(' ').map(word => word.at(0).toUpperCase() + word.slice(1).toLocaleLowerCase()).join(' ');
const mapPublicationDateFromDto = dto => {
  const date = dto.publication && DateTime.fromISO(dto.publication);
  return date?.isValid ? date.toJSDate() : null;
};

export const mapFromDto = dto => ({
  title: mapTitleFromDto(dto),
  publicationDate: mapPublicationDateFromDto(dto),
});

export const mapFromPartialDto = dto => ({
  ...dto.title !== undefined ? { title: mapTitleFromDto(dto) } : undefined,
  ...dto.publication !== undefined ? { publicationDate: mapPublicationDateFromDto(dto) } : undefined,
});
