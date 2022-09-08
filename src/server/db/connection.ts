import { ClientBase } from 'pg';
import { pool } from './pool';

export const connection = async <T>(handler: (client: ClientBase) => T | PromiseLike<T>): Promise<T> => {
  const client = await pool.connect();
  try {
    return await handler(client);
  } finally {
    client.release();
  }
};
