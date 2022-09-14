import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { createStore } from '@app/client/store';
import { BrowserRouter } from 'react-router-dom';
import { Box, CssBaseline, Toolbar } from '@mui/material';
import { Header } from './components/Header';

export const App = () => (
  <BrowserRouter>
    <ReduxProvider store={React.useRef(createStore()).current}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Header />
        <Box component='main' sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
        </Box>
      </Box>
    </ReduxProvider>
  </BrowserRouter>
);
