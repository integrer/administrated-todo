import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import { AuthControl } from '@app/client/components/Header/AuthControl';

export const Header: React.FC = () => (
  <AppBar position='fixed' sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
    <Toolbar>
      <Typography variant='h6' component='div' sx={{ flexGrow: 1 }} noWrap>
        {'TODO'} App
      </Typography>
      <AuthControl />
    </Toolbar>
  </AppBar>
);
