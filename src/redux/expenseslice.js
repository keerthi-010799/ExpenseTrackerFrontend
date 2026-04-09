import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const matchesUser = (transaction, userId) => {
    if (!userId) {
        return true;
    }

    const transactionUserId =
        transaction?.userId?._id ??
        transaction?.userId?.id ??
        transaction?.userId;

    return String(transactionUserId) === String(userId);
};

// 🔥 API CALL inside Redux
export const fetchTransactions = createAsyncThunk(
    "expense/fetchTransactions",
    async (userId) => {
        let reqOptions = {
            url: "http://localhost:5000/api/transactions/transaction",
            method: "POST",
            data: { apitype: "getTransaction", userId }
        }
        const res = await axios.request(reqOptions);
        return res.data.filter((transaction) => matchesUser(transaction, userId));
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
            state.expense.push({ itemid: state.expense.length + 1, ...action.payload });
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
