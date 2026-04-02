import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import useExpenseData from "../customhooks/useExpenseData";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const ExpensePieChart = (props) => {
    const pieData = props.data.map(({ category, amount }) => ({
        name: category,
        value: Number(amount)
    }));
    console.log("data", props.filterType, pieData);

    return (
        <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
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
        <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
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
    );
};

export {
    ExpensePieChart, IncomeExpenseBarChart
}