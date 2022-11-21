import express from 'express';
import { livescoreRouter } from './livescore/livescore.router.js';
import { bookRouter } from './book/book.router.js';
import { authRouter } from './auth/auth.router.js';

export const appRouter = express.Router();
appRouter.use('/auth', authRouter);
appRouter.use('/live-scores', livescoreRouter);
// appRouter.use('/authors', authorRouter);
appRouter.use('/books', bookRouter);
