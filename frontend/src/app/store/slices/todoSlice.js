import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


const initialState = {
    data: {
        done: [
            {
            id: 1,
            title: "Do something nice for someone you care about",
            completed: false,
            group: "favorite",
            description: "sadasdasddddddddddddddsadasdasddddddddddddddsadasdasddddddddddddddsadasdasddddddddddddddsadasdasddddddddddddddsadasdasddddddddddddddsadasdasddddddddddddddsadasdasddddddddddddddsadasdasddddddddddddddsadasdasddddddddddddddsadasdasddddddddddddddsadasdasddddddddddddddsadsadasdasddddddddddddddsadasdasddddddddddddddsadasdasddddddddddddddsadasdasddddddddddddddsadasdasddddddddddddddsadasdasddddddddddddddsadasdasddddddddddddddsadasdasddddddddddddddsadasdasddddddddddddddsadasdasddddddddddddddsadasdasddddddddddasdsadsadddddsadasdasddddddddddddddsadasdasddddddddddddddsadasdasddddddddddddddasdasddddddddddddddsadasdasddddddddddddddali",
            order: "1",
            status: "Done",
            priorityTag: "Low",
            trackTag: "At Risk",
            userId: 152
            },
            {
            id: 2,
            title: "Memorize a poem",
            completed: true,
            group: "favorite",
            description: "sadasdasdddddddddddddd",
            order: "2",
            status: "Done",
            userId: 13
            },
            {
            id: 3,
            title: "Watch a classic movie",
            completed: true,
            group: "favorite",
            description: "sadasdasdddddddddddddd",
            order: "3",
            status: "Done",
            userId: 68
            },
            {
            id: 4,
            title: "Watch a documentary",
            completed: false,
            group: "favorite",
            description: "sadasdasdddddddddddddd",
            order: "4",
            status: "Done",
            userId: 84
            },
        ],
        doing: [
            {
            id: 11,
            title: "Do something nice for someone you care about",
            status: "Doing",
            group: "favorite",
            description: "sadasdasdddddddddddddd",
            order: "5",
            priorityTag: "Medium",
            trackTag: "At Risk",
            userId: 152
            },
            {
            id: 21,
            title: "Memorize a poem",
            status: "Doing",
            group: "favorite",
            description: "sadasdasdddddddddddddd",
            order: "6",
            userId: 13
            },
            {
            id: 31,
            title: "Watch a classic movie",
            status: "Doing",
            group: "favorite",
            description: "sadasdasdddddddddddddd",
            order: "7",
            userId: 68
            },
            {
            id: 41,
            title: "Watch a documentary",
            status: "Doing",
            group: "favorite",
            description: "sadasdasdddddddddddddd",
            order: "8",
            userId: 84
            },
        ],
        todo: [
            {
            id: 12,
            title: "Do something nice for someone you care about",
            status: "To Do",
            group: "favorite",
            description: "sadasdasdddddddddddddd",
            order: "9",
            userId: 152
            },
            {
            id: 22,
            title: "Memorize a poem",
            status: "To Do",
            group: "favorite",
            description: "sadasdasdddddddddddddd",
            order: "10",
            userId: 13
            },
            {
            id: 32,
            title: "Watch a classic movie",
            status: "To Do",
            group: "favorite",
            description: "sadasdasdddddddddddddd",
            order: "11",
            userId: 68
            },
            {
            id: 42,
            title: "Watch a documentary",
            status: "To Do",
            group: "favorite",
            description: "sadasdasdddddddddddddd",
            order: "12",
            userId: 84
            },
        ],
        extra: [
            {
            id: 13,
            title: "Do something nice for someone you care about",
            status: "Extra",
            group: "favorite",
            description: "sadasdasdddddddddddddd",
            order: "13",
            userId: 152
            },
            {
            id: 23,
            title: "Memorize a poem",
            status: "Extra",
            group: "favorite",
            description: "sadasdasdddddddddddddd",
            order: "14",
            userId: 13
            },
            {
            id: 33,
            title: "Watch a classic movie",
            status: "Extra",
            group: "favorite",
            description: "sadasdasdddddddddddddd",
            order: "15",
            userId: 68
            },
            {
            id: 43,
            title: "Watch a documentary",
            status: "Extra",
            group: "favorite",
            description: "sadasdasdddddddddddddd",
            order: "16",
            userId: 84
            },
        ],
    },
    status: 'idle', // status for async action (idle, loading, succeeded, failed)
    error: null,
}


// Async action to fetch todos
export const fetchTodos = createAsyncThunk("todo/fetchTodos", async () => {
    const response = await axios.get("https://dummyjson.com/todos");
    return response?.data.todos; // Assuming the todos are in the 'todos' field
  });

const todoSlice = createSlice(
    {
        name: "todo",
        initialState,
        reducers: {
            addToDo: (state, action) => {
                return 0;
            },
            removeToDo: (state, action) => {
                return 1;
            },
            editToDo: (state, action) => {
                return 2;
            }
        }
    }
)


export const { addToDo, removeToDo, editToDo } = todoSlice.actions;

export default todoSlice.reducer;