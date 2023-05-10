import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  tasks: [],
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action) => {
      state.tasks.push(action.payload);
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    },
    completeTask: (state, action) => {
      const tasks = state.tasks.find(task => task.id === action.payload);
      tasks.completed = true;
    },
  },
});

export const {addTask, deleteTask, completeTask} = tasksSlice.actions;

export default tasksSlice.reducer;
