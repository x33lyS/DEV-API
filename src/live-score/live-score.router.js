import express from 'express';
import { livescoreController } from './live-score.controller.js';
import { checkIdMiddleware } from '../common/check-id.middleware.js';
import { checklivescoreMiddleware, checkPartiallivescoreMiddleware } from './live-score.middleware.js';
import { checkPaginationMiddleware } from '../common/check-pagination.middleware.js';
import { checkAuthorizationToken, checkRoleToken } from '../auth/auth.middleware.js';

export const liveScoreRouter = express.Router();
liveScoreRouter.get('/', checkPaginationMiddleware, livescoreController.findPage);
liveScoreRouter.get('/:id', checkIdMiddleware, livescoreController.findById);
liveScoreRouter.post('/', checkAuthorizationToken, checklivescoreMiddleware, livescoreController.create);
liveScoreRouter.patch('/:id', checkAuthorizationToken, checkIdMiddleware, checkPartiallivescoreMiddleware, livescoreController.update);
liveScoreRouter.put('/:id', checkAuthorizationToken, checkIdMiddleware, checklivescoreMiddleware, livescoreController.replace);
liveScoreRouter.delete('/:id', checkAuthorizationToken, checkRoleToken('admin'), checkIdMiddleware, livescoreController.remove);
