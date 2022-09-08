import { transaction } from './transaction';
import pgFormat from 'pg-format';

interface ITableDefinition {
  names: string[];
  rows: unknown[][];
}

const getInsertQuery = (tableName: string, { names, rows }: ITableDefinition) =>
  pgFormat('INSERT INTO %I (%I) VALUES %L', tableName, names, rows);

export const seedDb = (seedData: Record<string, ITableDefinition>, force = false) =>
  transaction(async (client) => {
    for (const tableName of Object.keys(seedData)) {
      if (!force) {
        const { rows } = await client.query(pgFormat('SELECT 1 FROM %I LIMIT 1;', tableName));
        if (rows.length > 0) continue;
      }
      const tableData = seedData[tableName];
      await client.query(getInsertQuery(tableName, tableData));
    }
  });
