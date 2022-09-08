import { ClientBase } from 'pg';
import { connection } from './connection';

export const transaction = <T>(
  handler: (client: ClientBase) => T | PromiseLike<T>,
  baseClient?: ClientBase,
): Promise<T> => {
  return baseClient ? doTransaction(baseClient) : connection(doTransaction);

  async function doTransaction(client: ClientBase) {
    try {
      await client.query('BEGIN');
      const result = await handler(client);
      await client.query('COMMIT');
      return result;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    }
  }
};
