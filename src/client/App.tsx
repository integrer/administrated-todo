import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { createStore } from '@app/client/store';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Box, CircularProgress, CssBaseline, Toolbar } from '@mui/material';
import { Header } from './components/Header';
// Pages
const TodoList = React.lazy(() => import('./features/todos/List'));

export const App = () => (
  <BrowserRouter>
    <ReduxProvider store={React.useRef(createStore()).current}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Header />
        <Box component='main' sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          <React.Suspense fallback={<CircularProgress />}>
            <Routes>
              <Route path='/' element={<TodoList />} />
            </Routes>
          </React.Suspense>
        </Box>
      </Box>
    </ReduxProvider>
  </BrowserRouter>
);
