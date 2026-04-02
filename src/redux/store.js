import { configureStore } from "@reduxjs/toolkit";
import expenseReduser from "./expenseslice";

const store = configureStore({
    reducer: { expense: expenseReduser }
});

export default store;