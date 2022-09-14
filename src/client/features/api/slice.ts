import { createApi, fetchBaseQuery as baseFetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IUserCredentials, IUserDTO } from '@app/shared/features/users';
import * as qs from 'qs';
import { ITodoCreateFormData, ITodoListParams, ITodoRecord } from '@app/shared/features/todos';
import { IPagedMessage } from '@app/shared/utils/rest';

const todoTag = 'TODO';
const accountTag = 'ACCOUNT';

const listTag = <T>(type: T) => ({ type, id: 'LIST' } as const);

const responseHandler = async (response: Response) => {
  const text = await response.text();
  const isJson = response.headers.get('content-type')?.includes('application/json');
  if (isJson) return /\S/.test(text) ? JSON.parse(text) : null;
  return text;
};

const fetchBaseQuery: typeof baseFetchBaseQuery = (fetchBaseArgs) => {
  const baseHandler = baseFetchBaseQuery(fetchBaseArgs);
  return (args, api, extraOptions) => {
    const defaultedArgs = { responseHandler, ...(typeof args == 'string' ? { url: args } : args) };
    return baseHandler(defaultedArgs, api, extraOptions);
  };
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: [todoTag, accountTag],
  endpoints: (build) => ({
    account: build.query<IUserDTO, void>({
      query: () => ({ url: '/user/current' }),
      providesTags: [accountTag],
    }),
    login: build.mutation<void, IUserCredentials>({
      query: (body) => ({ url: '/user/auth', method: 'POST', body }),
      invalidatesTags: (_res, err) => (!err ? [accountTag] : []),
    }),
    logout: build.mutation<void, void>({
      query: () => ({ url: '/user/auth', method: 'DELETE' }),
      invalidatesTags: (_res, err) => (!err ? [accountTag] : []),
    }),
    todoList: build.query<IPagedMessage<ITodoRecord<string>>, Partial<ITodoListParams>>({
      query(params) {
        const queryString = qs.stringify(params);
        return { url: '/todo/' + (queryString && '?' + queryString) };
      },
      providesTags: (result) => [
        ...(result?.data.map(({ id }) => ({ type: todoTag, id } as const)) || []),
        listTag(todoTag),
      ],
    }),
    todoById: build.query<ITodoRecord<string>, number>({
      query: (id) => ({ url: `/todo/${id}` }),
      providesTags: (result) => (result ? [{ type: todoTag, id: result.id }] : []),
    }),
    createTodo: build.mutation<number, ITodoCreateFormData>({
      query: (body) => ({ url: '/todo', method: 'POST', body }),
      invalidatesTags: (_res, err) => (!err ? [listTag(todoTag)] : []),
    }),
    updateTodo: build.mutation<void, [number, ITodoCreateFormData]>({
      query: ([id, body]) => ({ url: `/todo/${id}`, method: 'PUT', body }),
      invalidatesTags: (_res, error, [id]) => (!error ? [{ type: todoTag, id }] : []),
    }),
    toggleTodoFulfilled: build.mutation<void, number>({
      query: (id) => ({ url: `/todo/${id}/fulfilled/toggle`, method: 'PUT' }),
      invalidatesTags: (_res, error, id) => (!error ? [{ type: todoTag, id }] : []),
    }),
  }),
});

export const {
  useAccountQuery,
  useLoginMutation,
  useLogoutMutation,
  useTodoListQuery,
  useTodoByIdQuery,
  useCreateTodoMutation,
  useUpdateTodoMutation,
  useToggleTodoFulfilledMutation,
} = apiSlice;
