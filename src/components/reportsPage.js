import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { ExpensePieChart, IncomeExpenseBarChart } from "./charts";
import useExpenseData from "../customhooks/useExpenseData";

const ReportsPage = () => {
    const { expense } = useExpenseData();

    const [data, setData] = useState([]);
    const [filterType, setFilterType] = useState("all");
    const [filterPeriod, setFilterPeriod] = useState("all");
    const [selectedMonth, setSelectedMonth] = useState(String(new Date().getMonth() + 1).padStart(2, "0"));
    const [selectedYear, setSelectedYear] = useState(String(new Date().getFullYear()));

    useEffect(() => {
        setData(expense);
    }, [expense]);

    const filteredData = data.filter((item) => {
        const itemDate = new Date(item.date);
        const typeMatch = filterType === "all" || item.type === filterType;

        let periodMatch = true;

        if (filterPeriod === "month") {
            const currentYear = new Date().getFullYear();
            periodMatch =
                itemDate.getFullYear() === currentYear &&
                itemDate.getMonth() + 1 === Number(selectedMonth);
        }

        if (filterPeriod === "year") {
            periodMatch = itemDate.getFullYear() === Number(selectedYear);
        }

        return typeMatch && periodMatch;
    });

    const totalIncome = filteredData
        .filter((transaction) => transaction.type === "income")
        .reduce((sum, transaction) => sum + Number(transaction.amount), 0);

    const totalExpense = filteredData
        .filter((transaction) => transaction.type === "expense")
        .reduce((sum, transaction) => sum + Number(transaction.amount), 0);

    const totalAmount = totalIncome - totalExpense;
    const amounts = filteredData.map((item) => Number(item.amount));
    const maxAmount = amounts.length ? Math.max(...amounts) : 0;
    const avgAmount = amounts.length
        ? (amounts.reduce((first, second) => first + second, 0) / amounts.length).toFixed(2)
        : 0;

    const columns = [
        { name: "ID", selector: (row) => row.itemid, sortable: true },
        { name: "Category", selector: (row) => row.category },
        { name: "Type", selector: (row) => row.type },
        { name: "Date", selector: (row) => row.date },
        { name: "Notes", selector: (row) => row.notes }
    ];

    return (
        <div className="container-fluid px-0">
            <div className="mb-4">
                <h3 className="mb-1">Reports</h3>
                <p className="text-muted mb-0">Filter transactions and review your spending patterns.</p>
            </div>

            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">
                    <div className="row g-3 align-items-end">
                        <div className="col-12 col-lg-4">
                            <label className="form-label d-block">Type</label>
                            <div className="btn-group w-100" role="group" aria-label="Type filter">
                                {["all", "income", "expense"].map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        className={`btn text-capitalize ${filterType === type ? "btn-primary" : "btn-outline-primary"}`}
                                        onClick={() => setFilterType(type)}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="col-12 col-lg-4">
                            <label className="form-label d-block">Period</label>
                            <div className="btn-group w-100" role="group" aria-label="Period filter">
                                {["all", "month", "year"].map((period) => (
                                    <button
                                        key={period}
                                        type="button"
                                        className={`btn text-capitalize ${filterPeriod === period ? "btn-success" : "btn-outline-success"}`}
                                        onClick={() => setFilterPeriod(period)}
                                    >
                                        {period}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="col-12 col-lg-4">
                            {filterPeriod === "month" && (
                                <>
                                    <label className="form-label">Month</label>
                                    <select
                                        className="form-select"
                                        value={selectedMonth}
                                        onChange={(e) => setSelectedMonth(e.target.value)}
                                    >
                                        {Array.from({ length: 12 }, (_, index) => {
                                            const month = String(index + 1).padStart(2, "0");
                                            return (
                                                <option key={month} value={month}>
                                                    {new Date(`2026-${month}-01`).toLocaleString("default", { month: "short" })}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </>
                            )}

                            {filterPeriod === "year" && (
                                <>
                                    <label className="form-label">Year</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={selectedYear}
                                        onChange={(e) => setSelectedYear(e.target.value)}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-3 mb-4">
                {filterType === "all" ? (
                    <>
                        <div className="col-12 col-md-6 col-xl-4">
                            <div className="card border-0 shadow-sm h-100 text-center">
                                <div className="card-body">
                                    <h6 className="text-muted">Balance</h6>
                                    <h4 className="mb-0">{totalAmount}</h4>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-6 col-xl-4">
                            <div className="card border-0 shadow-sm h-100 text-center">
                                <div className="card-body">
                                    <h6 className="text-muted">Income</h6>
                                    <h4 className="mb-0">{totalIncome}</h4>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-6 col-xl-4">
                            <div className="card border-0 shadow-sm h-100 text-center">
                                <div className="card-body">
                                    <h6 className="text-muted">Expense</h6>
                                    <h4 className="mb-0">{totalExpense}</h4>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="col-12 col-md-6 col-xl-4">
                            <div className="card border-0 shadow-sm h-100 text-center">
                                <div className="card-body">
                                    <h6 className="text-muted">Total</h6>
                                    <h4 className="mb-0">{filterType === "income" ? totalIncome : totalExpense}</h4>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-6 col-xl-4">
                            <div className="card border-0 shadow-sm h-100 text-center">
                                <div className="card-body">
                                    <h6 className="text-muted">Max</h6>
                                    <h4 className="mb-0">{maxAmount}</h4>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-md-6 col-xl-4">
                            <div className="card border-0 shadow-sm h-100 text-center">
                                <div className="card-body">
                                    <h6 className="text-muted">Average</h6>
                                    <h4 className="mb-0">{avgAmount}</h4>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {filteredData.length > 0 && (
                <div className="row g-3 mb-4">
                    <div className="col-12 col-xl-6">
                        <ExpensePieChart data={filteredData} />
                    </div>
                    <div className="col-12 col-xl-6">
                        <IncomeExpenseBarChart data={filteredData} filterType={filterType} />
                    </div>
                </div>
            )}

            <div className="card border-0 shadow-sm">
                <div className="card-body p-0">
                    <DataTable
                        columns={columns}
                        data={filteredData}
                        pagination
                        responsive
                    />
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;
