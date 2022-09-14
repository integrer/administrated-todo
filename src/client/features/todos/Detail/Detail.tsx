import React from 'react';
import { useParams } from 'react-router-dom';
import { isNaN } from '@app/shared/utils/number';
import { useAccount } from '@app/client/utils/auth';
import { useTodoByIdQuery, useUpdateTodoMutation } from '@app/client/features/api';
import { TodoForm } from '@app/client/components/TodoForm';
import { noop } from 'react-use/lib/misc/util';
import { CircularProgress } from '@mui/material';
import { ITodoCreateFormData } from '@app/shared/features/todos';

interface IDetailInnerProps {
  id: number;
}

const DetailInner = ({ id }: IDetailInnerProps) => {
  const { data: value, error } = useTodoByIdQuery(id);
  const [update, { isLoading: isUpdating }] = useUpdateTodoMutation();

  if (error) throw error;

  if (!value) return <CircularProgress />;

  const handleSubmit = async (data: ITodoCreateFormData) => {
    await update([id, data]).unwrap();
  };

  return <TodoForm value={value} disabled={isUpdating} submitLabel='Update' onSubmit={handleSubmit} />;
};

const ReadonlyDetailInner = ({ id }: IDetailInnerProps) => {
  const { data: value, error } = useTodoByIdQuery(id);

  if (error) throw error;

  if (!value) return <CircularProgress />;

  return <TodoForm value={value} disabled onSubmit={noop} />;
};

const Detail = () => {
  const [account] = useAccount();
  const asAdmin = !!account?.isAdmin;

  const { id: rawId } = useParams();
  if (rawId == null) return null;
  const id = +rawId;
  if (isNaN(id)) return null;

  const Inner = asAdmin ? DetailInner : ReadonlyDetailInner;
  return <Inner id={id} />;
};

export default Detail;
