import { IOrderedParams, IPageParams } from '@app/shared/utils/rest';
import { todoListOrderTypes } from '@app/shared/features/todos/todoListOrderTypes';

export interface ITodoListParams extends IPageParams, IOrderedParams<typeof todoListOrderTypes[number]> {}
