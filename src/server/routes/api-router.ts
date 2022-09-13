import { Router } from 'express';
import { userRouter, todoRouter } from './api-routes';
import cookieParser from 'cookie-parser';
import { HTTPStatusCode } from '@app/server/utils/HTTPStatusCode';

export function apiRouter() {
  const router = Router();
  router.use(cookieParser());
  router.use('/user', userRouter());
  router.use('/todo', todoRouter());
  router.all('/**', (_r, res) => res.sendStatus(HTTPStatusCode.NotFound));
  return router;
}
