import { DateTime } from 'luxon';
import { ResourceFormatException } from '../common/app-exception.js';

export const checklivescoreMiddleware = (request, response, next) => {
  if (!request.body.homeTeamName || typeof request.body.homeTeamName !== 'string'
    || !request.body.date || typeof request.body.date !== 'string' || !DateTime.fromISO(request.body.date).isValid || request.body.homeTeamScore < 0 || request.body.homeTeamScore === null || request.body.awayTeamScore < 0 || request.body.awayTeamScore === null) {
    next(new ResourceFormatException());
  } else {
    next();
  }
};

export const checkPartiallivescoreMiddleware = (request, response, next) => {
  if (request.body.homeTeamName && typeof request.body.homeTeamName !== 'string'
    || request.body.date && (typeof request.body.date !== 'string' || !DateTime.fromISO(request.body.date).isValid)) {
    next(new ResourceFormatException());
  } else {
    next();
  }
};
