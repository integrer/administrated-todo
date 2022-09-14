import React from 'react';
import { Button, CircularProgress } from '@mui/material';

interface IAuthControlInnerProps {
  pending: boolean;
  unauthorized: boolean;
  onClick(): void;
}

export const AuthControlBtn = ({ onClick, pending, unauthorized }: IAuthControlInnerProps) => {
  if (pending) return <CircularProgress />;
  return (
    <Button color='inherit' onClick={onClick}>
      {unauthorized ? 'Login' : 'Logout'}
    </Button>
  );
};
