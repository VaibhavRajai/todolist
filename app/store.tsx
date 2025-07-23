import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import taskSlice from './taskSlice';

export const makeStore = () =>
  configureStore({
    reducer: {
      tasks: taskSlice,
    },
  });
  export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

export const wrapper = createWrapper<AppStore>(makeStore, { debug: false });