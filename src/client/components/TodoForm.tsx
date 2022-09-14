import React from 'react';
import { useFormik } from 'formik';
import { Button, Stack, TextField, useEventCallback } from '@mui/material';
import { ITodoCreateFormData, todoCreateFormSchema } from '@app/shared/features/todos';
import { useShallowStableValue } from '@app/client/utils';
import { unary } from 'ramda';
import { createGetFieldError } from '@app/client/utils/form';
import styled from '@emotion/styled';
import { useUpdateEffect } from 'react-use';

export interface ITodoFormProps {
  value: ITodoCreateFormData;
  disabled?: boolean;
  submitLabel?: React.ReactNode;
  onSubmit(value: ITodoCreateFormData): void | Promise<unknown>;
}

const FormStack = styled(Stack)`
  max-width: 720px;
  margin: 0 auto;
`;

const SubmitButton = styled(Button)`
  margin-right: auto;
`;

export const TodoForm = (props: ITodoFormProps) => {
  const value = useShallowStableValue(props.value);
  const { disabled, submitLabel } = props;
  const handleSubmit = useEventCallback(unary(props.onSubmit));
  const formikBag = useFormik({ initialValues: value, onSubmit: handleSubmit, validationSchema: todoCreateFormSchema });
  useUpdateEffect(() => {
    const { resetForm } = formikBag;
    resetForm({ values: value });
  }, [value]);
  const { getFieldProps } = formikBag;
  const getFieldError = createGetFieldError(formikBag.getFieldMeta);

  return (
    <form onSubmit={formikBag.handleSubmit}>
      <FormStack rowGap='0.5rem'>
        <TextField
          {...getFieldProps('username')}
          autoFocus
          error={!!getFieldError('username')}
          helperText={getFieldError('username')}
          disabled={disabled}
          margin='dense'
          label='Username'
          type='text'
          fullWidth
          variant='standard'
        />
        <TextField
          {...getFieldProps('email')}
          error={!!getFieldError('email')}
          helperText={getFieldError('email')}
          disabled={disabled}
          margin='dense'
          label='Email'
          type='email'
          fullWidth
          variant='standard'
        />
        <TextField
          {...getFieldProps('body')}
          error={!!getFieldError('body')}
          helperText={getFieldError('body')}
          disabled={disabled}
          margin='dense'
          label='Email'
          type='text'
          fullWidth
          variant='standard'
        />
        {submitLabel && (
          <SubmitButton type='submit' disabled={disabled}>
            {submitLabel}
          </SubmitButton>
        )}
      </FormStack>
    </form>
  );
};
