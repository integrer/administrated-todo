import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import { promisify } from 'util';
import { ClientBase } from 'pg';
import { Request, Response } from 'express';
import { transaction } from '@app/server/db';
import { getInsertValuesPlaceholder } from '@app/server/db/query-utils';
import { HTTPStatusCode } from '@app/shared/utils/rest';
import { IUserCredentials } from '@app/shared/features/users';

const randomBytes = promisify(crypto.randomBytes);
const defaultExpiresIn = 3600;
const getExpiresIn = () => {
  const expiresIn = process.env.EXPIRES_IN;
  return (expiresIn && +expiresIn) || defaultExpiresIn;
};

export interface IUserAdditionalData {
  isAdmin: boolean;
}

export interface IUserCreateData extends IUserCredentials, Partial<IUserAdditionalData> {}

export interface IUserRow extends IUserCredentials, IUserAdditionalData {
  id: number;
}

export class NoSuchUserError extends TypeError {
  constructor(readonly credentials: IUserCredentials, message?: string) {
    super(message);
  }
}

export interface ILoginResult {
  token: string;
  expiresAt: Date;
}

export interface IUsersService {
  findByToken(token: string): Promise<IUserRow | undefined>;
  findByLogin(login: string): Promise<IUserRow | undefined>;
  /**
   * Creates new session by {@link credentials user credentials}
   * @param credentials - user credentials
   * @returns session token
   * @throws NoSuchUserError
   */
  login(credentials: IUserCredentials): Promise<ILoginResult>;
  logout(token: string): Promise<void>;
  createUsersUnsafe(users: IUserCreateData[]): Promise<number[]>;
}

const encryptPassword = (password: string | Buffer) => bcrypt.hash(password, 10);

class PSqlLiteral {
  constructor(private readonly value: string) {}

  // noinspection JSUnusedGlobalSymbols
  toPostgres(): string {
    return this.value;
  }
}

const generateAuthToken = async () => (await randomBytes(24)).toString('base64url').slice(0, 32);

export class PGUsersService implements IUsersService {
  constructor(private readonly _client: ClientBase) {}

  async findByLogin(login: string) {
    return (
      await this._client.query<IUserRow>(
        'SELECT id, login, password, is_admin as "isAdmin" FROM users WHERE login = $1 LIMIT 1',
        [login],
      )
    ).rows[0];
  }

  async findByToken(token: string): Promise<IUserRow | undefined> {
    return (
      await this._client.query<IUserRow>(
        `SELECT users.id as id, users.login as login, users.password as password, users.is_admin as "isAdmin" 
FROM sessions JOIN users ON sessions.user_id = users.id WHERE sessions.id = $1 AND sessions.eat > $2 LIMIT 1`,
        [token, new Date()],
      )
    ).rows[0];
  }

  async login(credentials: IUserCredentials): Promise<ILoginResult> {
    const { login, password } = credentials;
    const user = await this.findByLogin(login);
    if (!user || !(await bcrypt.compare(password, user.password))) throw new NoSuchUserError(credentials);
    const { id } = user;
    const token = await generateAuthToken();
    const expiresAt = new Date(Date.now() + getExpiresIn() * 1000);
    await this._client.query('INSERT INTO sessions (id, user_id, eat) VALUES ($1, $2, $3)', [token, id, expiresAt]);
    return { token, expiresAt };
  }

  async logout(token: string): Promise<void> {
    await this._client.query('UPDATE sessions SET eat = $1 WHERE id = $2 AND eat > $1', [new Date(), token]);
  }

  async createUsersUnsafe(users: IUserCreateData[]): Promise<number[]> {
    const nothingToDo = !users.length;
    if (nothingToDo) return [];

    const defaultLit = new PSqlLiteral('DEFAULT');

    const values = await Promise.all(
      users.map(async ({ login, password, isAdmin }) => [
        login,
        await encryptPassword(password),
        isAdmin ?? defaultLit,
      ]),
    ).then((rows) => rows.flat());

    const insertValuesPlaceholder = getInsertValuesPlaceholder({ count: users.length, perGroup: 3 });
    const queryString = `INSERT INTO users (login, password, is_admin) VALUES ${insertValuesPlaceholder} RETURNING id`;

    return (await this._client.query<{ id: number }>(queryString, values)).rows.map(({ id }) => id);
  }
}

type RequestLike = Pick<Request, 'cookies' | 'header'>;

export function parseAuthToken(req: RequestLike): string | undefined {
  return req.cookies.token || req.header('authorization')?.split(' ')[1];
}

export function permissionMiddleware(isAllowed?: (account: IUserRow) => boolean | PromiseLike<boolean>) {
  const allowedTo = isAllowed || (() => true);
  return async function checkPermission(req: RequestLike, res: Pick<Response, 'sendStatus'>, next: () => void) {
    try {
      const authToken = parseAuthToken(req);
      if (!authToken) return res.sendStatus(HTTPStatusCode.Unauthorized);
      const account = await transaction((client) => new PGUsersService(client).findByToken(authToken));
      if (!account) return res.sendStatus(HTTPStatusCode.Unauthorized);
      if (await allowedTo(account)) return next();
      res.sendStatus(HTTPStatusCode.Forbidden);
    } catch (e) {
      res.sendStatus(HTTPStatusCode.InternalServerError);
    }
  };
}
