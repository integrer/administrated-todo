import { Router } from 'express';
import { userRouter, todoRouter } from './api-routes';
import cookieParser from 'cookie-parser';

export function apiRouter() {
  const router = Router();
  router.use(cookieParser());
  router.use('/user', userRouter());
  router.use('/todo', todoRouter());
  return router;
}
