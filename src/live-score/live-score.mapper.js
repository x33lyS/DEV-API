import {DateTime} from 'luxon';

export const mapToDto = item => {
  const date = item.date && DateTime.fromJSDate(item.date);
  // const homeTeamScore = item.homeTeamScore;
  // const awayTeamScore = item.awayTeamName;
  return {
    id: item.id? isNaN(item.id) ? item.id : parseInt(item.id) : null,
    date: date?.isValid ? date.toFormat('yyyy-MM-dd') : undefined,
    homeTeamName: item.homeTeamName,
    awayTeamName: item.awayTeamName,
    // awayTeamScore: item.awayTeamScore ? (isNaN(item.awayTeamScore)) ? item.awayTeamScore === 0 : item.awayTeamScore : undefined,
    // homeTeamScore: item.homeTeamScore ? (isNaN(item.homeTeamScore)) ? undefined : item.homeTeamScore : undefined,
    homeTeamScore: item.homeTeamScore,
    awayTeamScore: item.awayTeamScore,
  };
};


const mapHomeTeamFromDto = dto => dto.homeTeamName?.split(' ').map(word => word.at(0).toUpperCase() + word.slice(1).toLocaleLowerCase()).join(' ');
const mapAwayTeamFromDto = dto => dto.awayTeamName?.split(' ').map(word => word.at(0).toUpperCase() + word.slice(1).toLocaleLowerCase()).join(' ');

const mapHomeTeamScoreFromDto = dto => dto.homeTeamScore && parseInt(dto.homeTeamScore);
const mapAwayTeamScoreFromDto = dto => dto.awayTeamScore && parseInt(dto.awayTeamScore);

const mapDateFromDto = dto => {
  const date = dto.date && DateTime.fromISO(dto.date);
  return date?.isValid ? date.toJSDate() : null;
};

export const mapFromDto = dto => ({
  homeTeamName: mapHomeTeamFromDto(dto),
  awayTeamName: mapAwayTeamFromDto(dto),
  homeTeamScore: mapHomeTeamScoreFromDto(dto),
  awayTeamScore: mapAwayTeamScoreFromDto(dto),
  date: mapDateFromDto(dto),
});

export const mapFromPartialDto = dto => ({
  ...dto.homeTeamName !== undefined ? {homeTeamName: mapHomeTeamFromDto(dto)} : undefined,
  ...dto.awayTeamName !== undefined ? {awayTeamName: mapAwayTeamFromDto(dto)} : undefined,
  ...dto.awayTeamScore !== undefined ? {awayTeamScore: mapAwayTeamScoreFromDto(dto)} : undefined,
  ...dto.homeTeamScore !== undefined ? {homeTeamScore: mapHomeTeamScoreFromDto(dto)} : undefined,
  ...dto.date !== undefined ? {date: mapDateFromDto(dto)} : undefined,
});
