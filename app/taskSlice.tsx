import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

export interface Task {
  id: string;
  name: string;
  createdAt: string;
}

interface TaskState {
  tasks: Task[];
}

const initialState: TaskState = {
  tasks: [],
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<string>) => {
      const newTask: Task = {
        id: Date.now().toString(),
        name: action.payload,
        createdAt: new Date().toISOString(),
      };
      state.tasks.push(newTask);
    },
    removeTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    },
  },
extraReducers: (builder) => {
  builder.addCase(HYDRATE, (state, action: any) => {
    return {
      ...state,
      ...action.payload.tasks,
    };
  });
},
});

export const { addTask, removeTask } = taskSlice.actions;
export default taskSlice.reducer;