import express from 'express';
import { bookController } from './book.controller.js';
import { checkIdMiddleware } from '../common/check-id.middleware.js';
import { checkBookMiddleware, checkPartialBookMiddleware } from './book.middleware.js';
import { checkPaginationMiddleware } from '../common/check-pagination.middleware.js';
import { checkAuthorizationToken, checkRoleToken } from '../auth/auth.middleware.js';

export const bookRouter = express.Router();
bookRouter.get('/', checkPaginationMiddleware, bookController.findPage);
bookRouter.get('/:id', checkIdMiddleware, bookController.findById);
bookRouter.post('/', checkAuthorizationToken, checkBookMiddleware, bookController.create);
bookRouter.patch('/:id', checkAuthorizationToken, checkIdMiddleware, checkPartialBookMiddleware, bookController.update);
bookRouter.put('/:id', checkAuthorizationToken, checkIdMiddleware, checkBookMiddleware, bookController.replace);
bookRouter.delete('/:id', checkAuthorizationToken, checkRoleToken('admin'), checkIdMiddleware, bookController.remove);
