// hooks/useExpenseData.js
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTransactions } from "../redux/expenseslice";
import { getStoredUser } from "../utils/auth";

const useExpenseData = () => {
    const dispatch = useDispatch();
    const { expense } = useSelector((state) => state.expense);
    const currentUser = getStoredUser();
    const currentUserId = currentUser?.id;

    useEffect(() => {
        dispatch(fetchTransactions(currentUserId));
    }, [currentUserId, dispatch]);

    const pieData = expense.map(({ category, amount }) => ({
        name: category,
        value: Number(amount)
    }));

    const monthlyData = expense.reduce((acc, item) => {
        let month, year;

        if (item.date.includes("/")) {
            [, month, year] = item.date.split("/");
        } else {
            const d = new Date(item.date);
            month = d.getMonth() + 1;
            year = d.getFullYear();
        }

        const key = `${year}-${month}`;

        if (!acc[key]) {
            acc[key] = { income: 0, expense: 0 };
        }

        if (item.type === "income") {
            acc[key].income += Number(item.amount);
        } else {
            acc[key].expense += Number(item.amount);
        }

        return acc;
    }, {});

    const formatted = Object.entries(monthlyData).map(([key, value]) => {
        const [year, month] = key.split("-");
        const monthName = new Date(year, month - 1).toLocaleString("default", {
            month: "short"
        });

        return {
            month: monthName,
            income: value.income,
            expense: value.expense
        };
    });

    return { pieData, formatted, expense };
};

export default useExpenseData;
