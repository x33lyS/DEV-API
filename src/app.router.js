import express from 'express';
import { liveScoreRouter } from './live-score/live-score.router.js';
import { authRouter } from './auth/auth.router.js';

export const appRouter = express.Router();
appRouter.use('/auth', authRouter);
appRouter.use('/live-scores', liveScoreRouter);
// appRouter.use('/authors', authorRouter);
