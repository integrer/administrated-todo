import React from 'react';
import { AppBar, IconButton, Link, Toolbar } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { AuthControl } from './AuthControl';
import styled from '@emotion/styled';

const TitleWrap = styled.div`
  flex-grow: 1;
`;

const Title = styled(Link)`
  color: inherit;
  text-decoration: none;
`;

export const Header: React.FC = () => (
  <AppBar position='fixed' sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
    <Toolbar>
      <TitleWrap>
        <Title variant='h6' noWrap href='/'>
          {'TODO'} App
        </Title>
      </TitleWrap>
      <IconButton href='/new' title='Add a new todo...' color='inherit'>
        <AddCircleOutlineIcon />
      </IconButton>
      <AuthControl />
    </Toolbar>
  </AppBar>
);
