import axiosInstance from "@/lib/axiosConfig";
// import { STATUSES } from "@/lib/constant";
import { deleteProps, statusFormatter } from "@/lib/helper";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  data: {
    todo: [],
    doing: [],
    done: [],
    extra: []
  },
  loading: {
    fetchTodos: false,
    createTask: false,
    updateTask: false,
    deleteTask: false,
    updateTaskStatus: false
  },
  error: {
    fetchTodos: null,
    createTask: null,
    updateTask: null,
    deleteTask: null,
    updateTaskStatus: null
  },
  lastUpdated: null
};

// Helper function to handle API errors
const handleApiError = (error) => {
  const message = error.response?.data?.message || "An unexpected error occurred";
  return { error: true, message };
};

// Async action to fetch todos
export const fetchTodos = createAsyncThunk(
  "todo/fetchTodos",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/task?groupBy=status&sortBy=order%3Adesc");
      return response?.data?.results;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Async action to update task status
export const updateTaskStatus = createAsyncThunk(
  "todo/updateTaskStatus",
  async ({ taskId, status, previousStatus }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axiosInstance.patch(`/task/${taskId}`, {status});
      return { ...response.data, previousStatus };
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Async action to add new task
export const createTask = createAsyncThunk(
  "todo/createTask",
  async ({ body }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/task`, body);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Async action to update task
export const updateTask = createAsyncThunk(
  "todo/updateTask",
  async ({ taskId, body, previousStatus }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/task/${taskId}`, body);
      return {...response.data, previousStatus};
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Async action to delete task
export const deleteTask = createAsyncThunk(
  "todo/deleteTask",
  async ({ taskId, status }, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/task/${taskId}`);
      return { taskId, status };
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Async action to delete task
export const swapTask = createAsyncThunk(
  "todo/swapTask",
  async ({ ids, status }, { rejectWithValue }) => {
    try {
      await axiosInstance.patch(`/task/swap`, { ids });
      return { ids, status };
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

const todoSlice = createSlice(
    {
        name: "todo",
        initialState,
        reducers: {
          clearErrors: (state) => {
            state.error = initialState.error;
          },
        },
        extraReducers: (builder) => {
          builder
            .addCase(fetchTodos.pending, (state) => {
              state.loading.fetchTodos = true;
              state.error.fetchTodos = null;
            })
            .addCase(fetchTodos.fulfilled, (state, action) => {
              state.loading.fetchTodos = false;
              state.error.fetchTodos = null;
              state.data = {
                done: action.payload.done || [],
                doing: action.payload.doing || [],
                todo: action.payload.todo || [],
                extra: action.payload.extra || []
              };
              state.lastUpdated = new Date().toISOString();
            })
            .addCase(fetchTodos.rejected, (state) => {
              state.loading.fetchTodos = false;
              state.error.fetchTodos = action.payload;
            })
            .addCase(createTask.pending, (state) => {
              state.loading.createTask = true;
              state.error.createTask = null;
            })
            .addCase(createTask.fulfilled, (state, action) => {
              state.loading.createTask = false;
              state.error.createTask = null;
            
              const statusKey = statusFormatter(action.payload.status);
            
              if (!state.data[statusKey]) {
                state.data[statusKey] = [];
              }
            
              state.data[statusKey].push(action.payload);
              state.lastUpdated = new Date().toISOString();
            })
            .addCase(createTask.rejected, (state, action) => {
              state.loading.createTask = false;
              state.error.createTask = action.payload;
            })
            .addCase(updateTask.pending, (state) => {
              state.loading.updateTask = true;
              state.error.updateTask = null;
            })
            .addCase(updateTask.fulfilled, (state, action) => {
              state.loading.updateTask = false;
              state.error.updateTask = null;
              const prevStatusKey = statusFormatter(action.payload.previousStatus);
              const newStatusKey = statusFormatter(action.payload.status);
            
              const taskIndex = state.data[prevStatusKey].findIndex(
                (task) => task.id === action.payload.id
              );
            
              if (taskIndex > -1) {
                if (prevStatusKey === newStatusKey) {
                  state.data[prevStatusKey][taskIndex] = {
                    ...state.data[prevStatusKey][taskIndex],
                    ...action.payload
                  };
                  delete state.data[prevStatusKey][taskIndex].previousStatus;
            
                } else {
                  const taskData = { 
                    ...state.data[prevStatusKey][taskIndex],
                    ...action.payload,
                    status: action.payload.status
                  };
            
                  state.data[prevStatusKey].splice(taskIndex, 1);
                  delete taskData.previousStatus;
            
                  state.data[newStatusKey].push(taskData);
                }
              }
            
              state.lastUpdated = new Date().toISOString();
            })
            .addCase(updateTask.rejected, (state, action) => {
              state.loading.updateTask = false;
              state.error.updateTask = action.payload;
            })
            .addCase(updateTaskStatus.pending, (state) => {
              state.loading.updateTaskStatus = true;
              state.error.updateTaskStatus = null;
            })
            .addCase(updateTaskStatus.fulfilled, (state, action) => {
              state.loading.updateTaskStatus = false;
              state.error.updateTaskStatus = null;
              const prevStatusKey = statusFormatter(action.payload.previousStatus);
              const newStatusKey = statusFormatter(action.payload.status);
            
              const taskIndex = state.data[prevStatusKey].findIndex(
                (task) => task.id === action.payload.id
              );
            
              if (taskIndex > -1) {
                const taskData = { ...state.data[prevStatusKey][taskIndex] };
            
                state.data[prevStatusKey].splice(taskIndex, 1);
            
                taskData.status = action.payload.status;
                deleteProps(taskData, 'previousStatus');
            
                state.data[newStatusKey].push(taskData);
              }
            
              state.lastUpdated = new Date().toISOString();
            })
            .addCase(updateTaskStatus.rejected, (state, action) => {
              state.loading.updateTaskStatus = false;
              state.error.updateTaskStatus = action.payload;
            })
            .addCase(deleteTask.pending, (state) => {
              state.loading.deleteTask = true;
              state.error.deleteTask = null;
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
              state.loading.deleteTask = false;
              state.error.deleteTask = null;
              const statusKey = statusFormatter(action.payload.status);
              state.data[statusKey] = state.data[statusKey].filter(
                task => task.id !== action.payload.taskId
              );
              state.lastUpdated = new Date().toISOString();
            })
            .addCase(deleteTask.rejected, (state, action) => {
              state.loading.deleteTask = false;
              state.error.deleteTask = action.payload;
            })
            .addCase(swapTask.pending, (state) => {
              state.loading.swapTask = true;
              state.error.swapTask = null;
            })
            .addCase(swapTask.fulfilled, (state, action) => {
              state.loading.updateTaskStatus = false;
              state.error.updateTaskStatus = null;
            
              const ids = action.payload.ids;
              const status = action.payload.status;
              
              const firstTaskIndex = state.data[status].findIndex(task => task.id === ids[0]);
              const secondTaskIndex = state.data[status].findIndex(task => task.id === ids[1]);
              
              if (firstTaskIndex !== -1 && secondTaskIndex !== -1) {
                const firstTask = { ...state.data[status][firstTaskIndex] };
                const secondTask = { ...state.data[status][secondTaskIndex] };
                
                const tempOrder = firstTask.order;
                firstTask.order = secondTask.order;
                secondTask.order = tempOrder;
                
                state.data[status][firstTaskIndex] = secondTask;
                state.data[status][secondTaskIndex] = firstTask;
              }
              
              state.lastUpdated = new Date().toISOString();
            })
            .addCase(swapTask.rejected, (state, action) => {
              state.loading.swapTask = false;
              state.error.swapTask = action.payload;
            });
        },
    }
)


export const { clearErrors } = todoSlice.actions;

export const selectTodosByStatus = (state, status) => 
  state.todo.data[status.toLowerCase()] || [];

export const selectLoadingState = (state, operation) => 
  state.todo.loading[operation];

export const selectError = (state, operation) => 
  state.todo.error[operation];

export const selectLastUpdated = (state) => 
  state.todo.lastUpdated;

export default todoSlice.reducer;