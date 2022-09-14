import { oneOfOr } from '@app/shared/utils/oneOf';
import { parseNumber } from '@app/shared/utils/number';
import { todoListOrderTypes } from './todoListOrderTypes';
import { ITodoListParams } from './ITodoListParams';

const todoListOrderTypeOr = oneOfOr(...todoListOrderTypes);

export const parseTodoListParams = (params: NodeJS.ReadOnlyDict<unknown>): ITodoListParams => ({
  page: parseNumber(params.page, 1, 1),
  perPage: parseNumber(params.perPage, 3, 0),
  orderBy: todoListOrderTypeOr(params.orderBy, 'username'),
  desc: !!params.desc && (typeof params.desc != 'string' || params.desc.toLowerCase() === 'true'),
});
