import express from 'express';
import { livescoreController } from './livescore.controller.js';
import { checkIdMiddleware } from '../common/check-id.middleware.js';
import { checklivescoreMiddleware, checkPartiallivescoreMiddleware } from './livescore.middleware.js';
import { checkPaginationMiddleware } from '../common/check-pagination.middleware.js';
import { checkAuthorizationToken, checkRoleToken } from '../auth/auth.middleware.js';

export const livescoreRouter = express.Router();
livescoreRouter.get('/', checkPaginationMiddleware, livescoreController.findPage);
livescoreRouter.get('/:id', checkIdMiddleware, livescoreController.findById);
livescoreRouter.post('/', checkAuthorizationToken, checklivescoreMiddleware, livescoreController.create);
livescoreRouter.patch('/:id', checkAuthorizationToken, checkIdMiddleware, checkPartiallivescoreMiddleware, livescoreController.update);
livescoreRouter.put('/:id', checkAuthorizationToken, checkIdMiddleware, checklivescoreMiddleware, livescoreController.replace);
livescoreRouter.delete('/:id', checkAuthorizationToken, checkRoleToken('admin'), checkIdMiddleware, livescoreController.remove);
