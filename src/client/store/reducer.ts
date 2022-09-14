import { combineReducers } from '@reduxjs/toolkit';
import { apiSlice } from '@app/client/features/api';

const combinedReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
});

export default combinedReducer;
