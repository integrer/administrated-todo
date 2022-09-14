import { ClientBase } from 'pg';
import { IPagedMessage, IPagedMessageMeta, IPageParams } from '@app/shared/utils/rest';
import { getLimitClause, ILimitParams } from '@app/server/db/query-utils';
import { ITodoRecord } from '@app/shared/features/todos/ITodoRecord';
import { ITodoListParams } from '@app/shared/features/todos/ITodoListParams';
import { ITodoCreateFormData, ITodoUpdateFormData } from '@app/shared/features/todos';

const getLimitParams = ({ page, perPage }: { page: number; perPage: number }): Required<ILimitParams> => ({
  limit: perPage,
  offset: (page - 1) * perPage,
});

export interface ITodoDAO {
  getIndex(params: ITodoListParams): Promise<IPagedMessage<ITodoRecord>>;
  getById(id: number): Promise<ITodoRecord | undefined>;
  create(data: ITodoCreateFormData): Promise<number>;
  updateById(id: number, data: ITodoUpdateFormData): Promise<boolean>;
  deleteById(id: number): Promise<void>;
  toggleFulfilledById(id: number): Promise<boolean>;
}

export class PGTodoDAO implements ITodoDAO {
  constructor(private readonly _client: ClientBase) {}

  private async _getIndexMeta(params: IPageParams, whereClause?: string): Promise<IPagedMessageMeta> {
    const {
      rows: [record],
    } = await this._client.query<{ total: string }>(
      // language=PostgreSQL
      'SELECT COUNT(id) AS total FROM todos' + (whereClause ? ' ' + whereClause : ''),
    );
    const total = +record.total;
    const lastPage = Math.ceil(total / params.perPage);
    return { currentPage: Math.min(params.page, lastPage), total, lastPage };
  }

  async getIndex(params: ITodoListParams): Promise<IPagedMessage<ITodoRecord>> {
    const meta = await this._getIndexMeta(params);
    const limitParams = getLimitParams({ ...params, page: meta.currentPage });

    if (limitParams.limit === 0) return { data: [], meta };

    const limitClause = getLimitClause(limitParams);
    const { rows: data } = await this._client.query<ITodoRecord>(
      // language=PostgreSQL
      'SELECT id, username, email, body, fulfilled, created_at as "createdAt" FROM todos ORDER BY ' +
        [params.orderBy, params.desc && 'DESC', limitClause].filter(Boolean).join(' '),
    );

    return { data, meta };
  }

  async getById(id: number): Promise<ITodoRecord | undefined> {
    const {
      rows: [data],
    } = await this._client.query<ITodoRecord>(
      // language=PostgreSQL
      'SELECT id, username, email, body, fulfilled, created_at as "createdAt" FROM todos WHERE id = $1',
      [id],
    );
    return data;
  }

  async create(data: ITodoCreateFormData): Promise<number> {
    const { rows } = await this._client.query<{ id: number }>(
      // language=PostgreSQL
      'INSERT INTO todos (username, email, body) VALUES ($1, $2, $3) RETURNING id',
      [data.username, data.email, data.body],
    );
    return rows[0].id;
  }

  async updateById(id: number, data: ITodoUpdateFormData): Promise<boolean> {
    const fulfilledPlaceholder = data.fulfilled != null ? ', fulfilled = $5' : '';
    const { rows } = await this._client.query<{ id: number }>(
      // language=PostgreSQL
      `UPDATE todos SET username = $2, email = $3, body = $4 ${fulfilledPlaceholder} WHERE id = $1 RETURNING id`,
      [id, data.username, data.email, data.body, ...(data.fulfilled != null ? [data.fulfilled] : [])],
    );
    return rows.length > 0;
  }

  async deleteById(id: number): Promise<void> {
    // language=PostgreSQL
    await this._client.query('DELETE FROM todos WHERE id = $1', [id]);
  }

  async toggleFulfilledById(id: number): Promise<boolean> {
    const { rows } = await this._client.query(
      // language=PostgreSQL
      'UPDATE todos SET fulfilled = (NOT fulfilled) WHERE id = $1 RETURNING id',
      [id],
    );
    return rows.length > 0;
  }
}
