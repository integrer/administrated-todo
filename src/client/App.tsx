import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { createStore } from '@app/client/store';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Box, CircularProgress, CssBaseline, ThemeProvider, Toolbar } from '@mui/material';
import { Header } from './components/Header';
import { theme } from '@app/client/styles/theme';
// Pages
const TodoList = React.lazy(() => import('./features/todos/List'));
const CreateTodo = React.lazy(() => import('./features/todos/Create'));
const ViewTodo = React.lazy(() => import('./features/todos/Detail'));

export const App = () => (
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <ReduxProvider store={React.useRef(createStore()).current}>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <Header />
          <Box component='main' sx={{ flexGrow: 1, p: 3 }}>
            <Toolbar />
            <React.Suspense fallback={<CircularProgress />}>
              <Routes>
                <Route path='/' element={<TodoList />} />
                <Route path='/new' element={<CreateTodo />} />
                <Route path='/:id' element={<ViewTodo />} />
              </Routes>
            </React.Suspense>
          </Box>
        </Box>
      </ReduxProvider>
    </ThemeProvider>
  </BrowserRouter>
);
