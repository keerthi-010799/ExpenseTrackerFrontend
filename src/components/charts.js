import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import useExpenseData from "../customhooks/useExpenseData";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const ExpensePieChart = (props) => {
    const pieData = props.data.map(({ category, amount }) => ({
        name: category,
        value: Number(amount)
    }));

    return (
        <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
                <h5 className="card-title mb-3">Expense Breakdown</h5>
                <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label
                    >
                        {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};


const IncomeExpenseBarChart = (props) => {
    const { formatted } = useExpenseData();
    const type = props.filterType;
    const data = props.data;

    const chartdata = type === "all" ? formatted
        : Object.values(
            data.reduce((acc, item) => {
                const cat = item.category;

                if (!acc[cat]) {
                    acc[cat] = {
                        category: cat,
                        total: 0,
                        count: 0
                    };
                }

                acc[cat].total += Number(item.amount);
                acc[cat].count += 1;

                return acc;
            }, {})
        ).map(item => ({
            category: item.category,
            avgAmount: Math.round(item.total / item.count),
            count: item.count
        }));
    return (
        <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
                <h5 className="card-title mb-3">Income vs Expense</h5>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartdata}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey={type === "all" ? "month" : "category"} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {type === "all" ?
                            <>
                                <Bar dataKey="income" fill="#4CAF50" />
                                <Bar dataKey="expense" fill="#F44336" />
                            </> :
                            <>
                                <Bar dataKey="avgAmount" fill="#4CAF50" />
                                <Bar dataKey="count" fill="#F44336" />
                            </>
                        }
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export {
    ExpensePieChart, IncomeExpenseBarChart
}
