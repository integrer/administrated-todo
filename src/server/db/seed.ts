import pgFormat from 'pg-format';
import { ClientBase } from 'pg';

interface ITableDefinition {
  names: string[];
  rows: unknown[][];
}

const getInsertQuery = (tableName: string, { names, rows }: ITableDefinition) =>
  pgFormat('INSERT INTO %I (%I) VALUES %L', tableName, names, rows);

export const tableSeeder =
  (client: ClientBase) =>
  async (tableName: string, tableData: ITableDefinition, force = false) => {
    if (!tableData.rows.length) return;
    if (!force) {
      const { rows } = await client.query(pgFormat('SELECT 1 FROM %I LIMIT 1;', tableName));
      if (rows.length > 0) return;
    }
    await client.query(getInsertQuery(tableName, tableData));
  };
