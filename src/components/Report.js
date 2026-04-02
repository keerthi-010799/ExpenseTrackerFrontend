// import { useEffect, useState } from "react";
// import DataTable from "react-data-table-component";
// import { ExpensePieChart, IncomeExpenseBarChart } from '../components/charts';
// import useExpenseData from "../customhooks/useExpenseData";

// const Reports = () => {
//     const { expense } = useExpenseData();

//     const [data, setData] = useState([]);

//     const [filterType, setFilterType] = useState("all");
//     const [filterPeriod, setFilterPeriod] = useState("all");
//     const [selectedDate, setSelectedDate] = useState("");

//     useEffect(() => {
//         setData(expense);
//     }, [expense]);

//     //  FILTER LOGIC
//     const filteredData = data.filter(item => {
//         const itemDate = new Date(item.date);

//         const typeMatch =
//             filterType === "all" || item.type === filterType;

//         let periodMatch = true;

//         if (filterPeriod === "month" && selectedDate) {
//             const [year, month] = selectedDate.split("-");
//             periodMatch =
//                 itemDate.getFullYear() === Number(year) &&
//                 itemDate.getMonth() + 1 === Number(month);
//         }

//         if (filterPeriod === "year" && selectedDate) {
//             periodMatch =
//                 itemDate.getFullYear() === Number(selectedDate);
//         }

//         return typeMatch && periodMatch;
//     });

//     //CALCULATIONS
//     const totalIncome = filteredData
//         .filter(t => t.type === "income")
//         .reduce((sum, t) => sum + (+t.amount), 0);

//     const totalExpense = filteredData
//         .filter(t => t.type === "expense")
//         .reduce((sum, t) => sum + (+t.amount), 0);

//     const totalAmount = totalIncome - totalExpense;

//     const amounts = filteredData.map(i => +i.amount);
//     const maxAmount = amounts.length ? Math.max(...amounts) : 0;
//     const avgAmount = amounts.length
//         ? (amounts.reduce((a, b) => a + b, 0) / amounts.length).toFixed(2)
//         : 0;

//     // TABLE
//     const columns = [
//         { name: "ID", selector: row => row.itemid, sortable: true },
//         { name: "Category", selector: row => row.category },
//         { name: "Type", selector: row => row.type },
//         { name: "Date", selector: row => row.date },
//         { name: "Notes", selector: row => row.notes }
//     ];

//     return (
//         <div>
//             <h3>Reports</h3>

//             {/*  FILTERS */}
//             <div className="d-flex gap-3 mb-3 flex-wrap">

//                 {/* Type */}
//                 <div className="btn-group">
//                     {["all", "income", "expense"].map(type => (
//                         <button
//                             key={type}
//                             className={`btn ${filterType === type ? "btn-primary" : "btn-outline-primary"}`}
//                             onClick={() => setFilterType(type)}
//                         >
//                             {type}
//                         </button>
//                     ))}
//                 </div>

//                 {/* Period */}
//                 <div className="btn-group">
//                     {["all", "month", "year"].map(p => (
//                         <button
//                             key={p}
//                             className={`btn ${filterPeriod === p ? "btn-success" : "btn-outline-success"}`}
//                             onClick={() => setFilterPeriod(p)}
//                         >
//                             {p}
//                         </button>
//                     ))}
//                 </div>

//                 {/* Inputs */}
//                 {filterPeriod === "month" && (
//                     <input type="month" className="form-control w-auto"
//                         onChange={(e) => setSelectedDate(e.target.value)} />
//                 )}

//                 {filterPeriod === "year" && (
//                     <input type="number" placeholder="Year"
//                         className="form-control w-auto"
//                         onChange={(e) => setSelectedDate(e.target.value)} />
//                 )}
//             </div>

//             {/*  CARDS */ console.log("filterdata", filteredData)}
//             <div className="row">

//                 {filterType === "all" && (
//                     <>
//                         <div className="col-md-4"><div className="card p-3 text-center"><h6>Balance</h6><h4>{totalAmount}</h4></div></div>
//                         <div className="col-md-4"><div className="card p-3 text-center"><h6>Income</h6><h4>{totalIncome}</h4></div></div>
//                         <div className="col-md-4"><div className="card p-3 text-center"><h6>Expense</h6><h4>{totalExpense}</h4></div></div>
//                     </>
//                 )}

//                 {filterType !== "all" && (
//                     <>
//                         <div className="col-md-4"><div className="card p-3 text-center"><h6>Total</h6><h4>{filterType === "income" ? totalIncome : totalExpense}</h4></div></div>
//                         <div className="col-md-4"><div className="card p-3 text-center"><h6>Max</h6><h4>{maxAmount}</h4></div></div>
//                         <div className="col-md-4"><div className="card p-3 text-center"><h6>Avg</h6><h4>{avgAmount}</h4></div></div>
//                     </>
//                 )}

//             </div>

//             {/*  CHARTS */}
//             <div className="row mt-4">
//                 <div className="col-md-6">
//                     <ExpensePieChart data={filteredData} />
//                 </div>

//                 <div className="col-md-6">
//                     {console.log("report", filterType, filterPeriod, selectedDate, filteredData)}
//                     <IncomeExpenseBarChart
//                         data={filteredData}
//                         filterType={filterType}
//                     />
//                 </div>
//             </div>

//             {/*  TABLE */}
//             <div className="mt-4">
//                 <DataTable
//                     columns={columns}
//                     data={filteredData}
//                     pagination
//                 />
//             </div>
//         </div>
//     );
// };

// export default Reports;

import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { ExpensePieChart, IncomeExpenseBarChart } from '../components/charts';
import useExpenseData from "../customhooks/useExpenseData";

const Reports = () => {
    const { expense } = useExpenseData();

    // ✅ Helpers
    const getCurrentMonth = () => {
        const now = new Date();
        return `${String(now.getMonth() + 1).padStart(2, "0")}`; // only month
    };

    const getCurrentYear = () => String(new Date().getFullYear());

    // ✅ STATES
    const [data, setData] = useState([]);
    const [filterType, setFilterType] = useState("all");
    const [filterPeriod, setFilterPeriod] = useState("all");

    // 🔥 Separate states
    const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
    const [selectedYear, setSelectedYear] = useState(getCurrentYear());

    useEffect(() => {
        setData(expense);
    }, [expense]);

    // FILTER LOGIC
    const filteredData = data.filter(item => {
        const itemDate = new Date(item.date);

        const typeMatch =
            filterType === "all" || item.type === filterType;

        let periodMatch = true;

        // ✅ MONTH FILTER (current year only)
        if (filterPeriod === "month") {
            const currentYear = new Date().getFullYear();

            periodMatch =
                itemDate.getFullYear() === currentYear &&
                itemDate.getMonth() + 1 === Number(selectedMonth);
        }

        // ✅ YEAR FILTER
        if (filterPeriod === "year") {
            periodMatch =
                itemDate.getFullYear() === Number(selectedYear);
        }

        return typeMatch && periodMatch;
    });

    // CALCULATIONS
    const totalIncome = filteredData
        .filter(t => t.type === "income")
        .reduce((sum, t) => sum + (+t.amount), 0);

    const totalExpense = filteredData
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + (+t.amount), 0);

    const totalAmount = totalIncome - totalExpense;

    const amounts = filteredData.map(i => +i.amount);
    const maxAmount = amounts.length ? Math.max(...amounts) : 0;
    const avgAmount = amounts.length
        ? (amounts.reduce((a, b) => a + b, 0) / amounts.length).toFixed(2)
        : 0;

    // TABLE
    const columns = [
        { name: "ID", selector: row => row.itemid, sortable: true },
        { name: "Category", selector: row => row.category },
        { name: "Type", selector: row => row.type },
        { name: "Date", selector: row => row.date },
        { name: "Notes", selector: row => row.notes }
    ];

    return (
        <div>
            <h3>Reports</h3>

            {/* FILTERS */}
            <div className="d-flex gap-3 mb-3 flex-wrap">

                {/* Type */}
                <div className="btn-group">
                    {["all", "income", "expense"].map(type => (
                        <button
                            key={type}
                            className={`btn ${filterType === type ? "btn-primary" : "btn-outline-primary"}`}
                            onClick={() => setFilterType(type)}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                {/* Period */}
                <div className="btn-group">
                    {["all", "month", "year"].map(p => (
                        <button
                            key={p}
                            className={`btn ${filterPeriod === p ? "btn-success" : "btn-outline-success"}`}
                            onClick={() => setFilterPeriod(p)}
                        >
                            {p}
                        </button>
                    ))}
                </div>

                {/* ✅ MONTH DROPDOWN (clean UI) */}
                {filterPeriod === "month" && (
                    <select
                        className="form-control w-auto"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                    >
                        {Array.from({ length: 12 }, (_, i) => {
                            const month = String(i + 1).padStart(2, "0");
                            return (
                                <option key={month} value={month}>
                                    {new Date(`2026-${month}-01`).toLocaleString("default", { month: "short" })}
                                </option>
                            );
                        })}
                    </select>
                )}

                {/* ✅ YEAR INPUT */}
                {filterPeriod === "year" && (
                    <input
                        type="number"
                        className="form-control w-auto"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                    />
                )}
            </div>

            {/* CARDS */}
            <div className="row">

                {filterType === "all" && (
                    <>
                        <div className="col-md-4">
                            <div className="card p-3 text-center">
                                <h6>Balance</h6>
                                <h4>{totalAmount}</h4>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="card p-3 text-center">
                                <h6>Income</h6>
                                <h4>{totalIncome}</h4>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="card p-3 text-center">
                                <h6>Expense</h6>
                                <h4>{totalExpense}</h4>
                            </div>
                        </div>
                    </>
                )}

                {filterType !== "all" && (
                    <>
                        <div className="col-md-4">
                            <div className="card p-3 text-center">
                                <h6>Total</h6>
                                <h4>{filterType === "income" ? totalIncome : totalExpense}</h4>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="card p-3 text-center">
                                <h6>Max</h6>
                                <h4>{maxAmount}</h4>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="card p-3 text-center">
                                <h6>Avg</h6>
                                <h4>{avgAmount}</h4>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* CHARTS */}
            {filteredData.length > 0 && <>
                <div className="row mt-4">
                    <div className="col-md-6">
                        <ExpensePieChart data={filteredData} />
                    </div>

                    <div className="col-md-6">
                        <IncomeExpenseBarChart
                            data={filteredData}
                            filterType={filterType}
                        />
                    </div>
                </div>
            </>}
            {/* TABLE */}
            <div className="mt-4">
                <DataTable
                    columns={columns}
                    data={filteredData}
                    pagination
                />
            </div>
        </div>
    );
};

export default Reports;