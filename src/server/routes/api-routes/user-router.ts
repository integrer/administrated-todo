import { Router } from 'express';
import bodyParser from 'body-parser';
import { ValidationError } from 'yup';
import { transaction } from '@app/server/db';
import { PGUsersService, parseAuthToken, NoSuchUserError } from '@app/server/services/users-service';
import { userCredentialsSchema, IUserDTO } from '@app/shared/features/users';
import { pick } from 'ramda';
import { HTTPStatusCode } from '@app/server/utils/HTTPStatusCode';

export function userRouter() {
  const router = Router();
  router.use(bodyParser.json());

  router.post('/auth', async function login(req, res) {
    try {
      const credentials = await userCredentialsSchema.validate(req.body);
      const oldToken = parseAuthToken(req);
      const loginResult = await transaction(async (client) => {
        const usersSvc = new PGUsersService(client);
        if (oldToken) await usersSvc.logout(oldToken);
        return usersSvc.login(credentials);
      });
      const { token, expiresAt } = loginResult;
      res.status(HTTPStatusCode.OK).cookie('token', token, { httpOnly: true, expires: expiresAt }).json(loginResult);
    } catch (err) {
      if (err instanceof NoSuchUserError) return res.sendStatus(HTTPStatusCode.NotFound);
      if (ValidationError.isError(err)) return res.status(HTTPStatusCode.UnprocessableEntity).json({ errors: err.errors });
      res.sendStatus(HTTPStatusCode.InternalServerError);
    }
  });

  router.delete('/auth', async function logout(req, res) {
    try {
      const oldToken = parseAuthToken(req);
      if (oldToken) await transaction((client) => new PGUsersService(client).logout(oldToken));
      res.status(HTTPStatusCode.OK).clearCookie('token').end();
    } catch (err) {
      res.sendStatus(HTTPStatusCode.InternalServerError);
    }
  });

  router.get('/current', async function currentUser(req, res) {
    try {
      const token = parseAuthToken(req);
      if (!token) return res.sendStatus(HTTPStatusCode.Unauthorized);
      const userData = await transaction((client) => new PGUsersService(client).findByToken(token));
      if (!userData) return res.sendStatus(HTTPStatusCode.Unauthorized);
      const dto: IUserDTO = pick(['id', 'login', 'isAdmin'], userData);
      res.status(HTTPStatusCode.OK).json(dto);
    } catch (err) {
      res.sendStatus(HTTPStatusCode.InternalServerError);
    }
  });

  return router;
}
