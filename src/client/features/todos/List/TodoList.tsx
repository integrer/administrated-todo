import React from 'react';
import { CircularProgress, Pagination, Stack, useEventCallback } from '@mui/material';
import { useTodoListQuery } from '@app/client/features/api';
import { useTodoListUrlParams } from './urlParams';
import { TodoCard } from './TodoCard';
import TodoListControls from './TodoListControls';

const TodoList = () => {
  const [params, setParams] = useTodoListUrlParams();
  const { data: todoList, isLoading, isFetching, error } = useTodoListQuery(params);

  const [lastPage, setLastPage] = React.useState(1);
  React.useEffect(() => {
    if (!todoList) return;
    const { meta } = todoList;
    setLastPage(meta.lastPage);
    setParams({ page: meta.currentPage }, { replace: true });
  }, [setParams, todoList]);

  if (error) throw error;

  const renderList = () => {
    if (isLoading || isFetching || !todoList) return <CircularProgress />;
    const { data: items } = todoList;
    return items.map((todo) => <TodoCard model={todo} key={todo.id} />);
  };

  const handlePageChange = useEventCallback((_ev: unknown, page: number) => setParams({ page }));

  return (
    <Stack spacing='1rem'>
      <TodoListControls />
      {renderList()}
      {lastPage > 1 && <Pagination page={params.page} count={lastPage} onChange={handlePageChange} />}
    </Stack>
  );
};

export default TodoList;
