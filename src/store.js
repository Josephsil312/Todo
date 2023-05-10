import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';
import tasksReducer from './tasksSlice';
import {composeWithDevTools} from 'redux-devtools-extension';

const store = configureStore({
  reducer: {
    tasks: tasksReducer,
  },
});

export default store;
