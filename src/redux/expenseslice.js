import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// const savedExpenses =
//     JSON.parse(localStorage.getItem("expenses")) || [];

// 🔥 API CALL inside Redux
export const fetchTransactions = createAsyncThunk(
    "expense/fetchTransactions",
    async () => {
        const res = await axios.get("http://localhost:5000/api/transactions/");
        return res.data;
    }
);


const expenseSlice = createSlice({
    name: "expense",

    initialState: {
        expense: [],
        loading: false,
        error: null,
    },

    reducers: {

        addTranscation: (state, action) => {
            state.expense.push({ id: state.expense.length + 1, ...action.payload });
            localStorage.setItem("expenses", JSON.stringify(state.expense));
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTransactions.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchTransactions.fulfilled, (state, action) => {
                const dataexp = action.payload.map((item, index) => ({
                    ...item,
                    itemid: index + 1
                }));
                console.log("REDUCEdata", dataexp);
                state.loading = false;
                state.expense = dataexp;
            })
            .addCase(fetchTransactions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { addTranscation } = expenseSlice.actions;

export default expenseSlice.reducer;