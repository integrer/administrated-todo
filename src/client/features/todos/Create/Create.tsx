import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateTodoMutation } from '@app/client/features/api';
import { TodoForm } from '@app/client/components/TodoForm';
import { ITodoCreateFormData } from '@app/shared/features/todos';

const defaultData: ITodoCreateFormData = {
  username: '',
  email: '',
  body: '',
};

const Create = () => {
  const [create, { isLoading }] = useCreateTodoMutation();
  const navigate = useNavigate();
  const handleSubmit = async (data: ITodoCreateFormData) => {
    const id = await create(data).unwrap();
    navigate(`/${id}`);
  };
  return <TodoForm value={defaultData} disabled={isLoading} submitLabel='Create' onSubmit={handleSubmit} />;
};

export default Create;
