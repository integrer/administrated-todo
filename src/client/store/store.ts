import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '@app/client/features/api';
import reducer from './reducer';

const createStore = () =>
  configureStore({
    reducer,
    middleware: (mw) => [...mw(), apiSlice.middleware],
    devTools: process.env.NODE_ENV !== 'production',
  });

export default createStore;

type AppStore = ReturnType<typeof createStore>;

export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
