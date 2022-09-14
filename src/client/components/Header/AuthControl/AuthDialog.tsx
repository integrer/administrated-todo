import React from 'react';
import { IUserCredentials, userCredentialsSchema } from '@app/shared/features/users';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormHelperText, TextField } from '@mui/material';
import { useFormik } from 'formik';

interface IAuthDialogProps {
  open: boolean;
  pending: boolean;
  error?: React.ReactNode;
  onCloseClick(): void;
  onFormSubmit?(credentials: IUserCredentials): void | Promise<void>;
}

export function AuthDialog(props: IAuthDialogProps) {
  const { open, pending, error, onCloseClick, onFormSubmit } = props;

  const formikBag = useFormik({
    initialValues: { login: '', password: '' },
    onSubmit: handleSubmit,
    validationSchema: userCredentialsSchema,
  });

  async function handleSubmit(credentials: IUserCredentials) {
    if (!onFormSubmit) return;
    await onFormSubmit(credentials);
    formikBag.resetForm();
  }

  const { getFieldProps, getFieldMeta } = formikBag;

  const getFieldError = (key: string) => {
    const fieldMeta = getFieldMeta(key);
    return fieldMeta.touched ? fieldMeta.error : undefined;
  };

  return (
    <Dialog open={open} onClose={onCloseClick}>
      <form onSubmit={formikBag.handleSubmit}>
        <DialogTitle>Login</DialogTitle>
        <DialogContent>
          <TextField
            {...getFieldProps('login')}
            error={!!getFieldError('login')}
            helperText={getFieldError('login')}
            autoFocus
            margin='dense'
            label='Login'
            type='text'
            fullWidth
            variant='standard'
          />
          <TextField
            {...getFieldProps('password')}
            error={!!getFieldError('password')}
            helperText={getFieldError('password')}
            margin='dense'
            label='Password'
            type='password'
            fullWidth
            variant='standard'
          />
          {error && <FormHelperText error>{error}</FormHelperText>}
        </DialogContent>
        <DialogActions>
          <Button type='button' disabled={pending} onClick={onCloseClick}>
            Cancel
          </Button>
          <Button type='submit' disabled={pending}>
            Login
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
