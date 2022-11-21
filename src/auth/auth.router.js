import express from 'express';
import { authController } from './auth.controller.js';
import { checkLoginCredentialsMiddleware } from './auth.middleware.js';

export const authRouter = express.Router();
authRouter.post('/login', checkLoginCredentialsMiddleware, authController.login);
