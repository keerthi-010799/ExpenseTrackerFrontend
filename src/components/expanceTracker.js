import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { ExpensePieChart, IncomeExpenseBarChart } from '../components/charts';
import useExpenseData from "../customhooks/useExpenseData";
const ExpanceTracker = () => {
    const { expense } = useExpenseData();

    const [data, setData] = useState([]);

    useEffect(() => {
        setData(expense);
    }, [expense])


    const columns = [
        {
            name: "ID",
            selector: row => row.itemid,
            sortable: true,
            width: "80px"
        },
        {
            name: "Category",
            selector: row => row.category,
            sortable: true
        },
        {
            name: "Type",
            selector: row => row.type,
            sortable: true
        },
        {
            name: "Date",
            selector: row => row.date,
            sortable: true
        }
        ,
        {
            name: "Notes",
            selector: row => row.notes,
            sortable: true
        }
    ];

    //total income
    const totalIncome = data
        .filter(t => t.type === "income")
        .reduce((sum, t) => sum + (+t.amount), 0);
    //total expense
    const totalExpense = data
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + (+t.amount), 0);
    //total amount
    const totalAmount = (+totalIncome) - (+totalExpense);


    return (
        <div className="container-fluid px-0">
            <div className="mb-4">
                <h3 className="mb-1">Expense Tracker</h3>
                <p className="text-muted mb-0">A quick summary of your balance, trends, and recent activity.</p>
            </div>

            <div className="row g-3 mb-4">
                <div className="col-12 col-md-6 col-xl-4">
                    <div className="card border-0 shadow-sm h-100 text-center">
                        <div className="card-body">
                            <h6 className="text-muted">Total Balance</h6>
                            <h4 className="text-primary mb-0">{totalAmount}</h4>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-6 col-xl-4">
                    <div className="card border-0 shadow-sm h-100 text-center">
                        <div className="card-body">
                            <h6 className="text-muted">Total Income</h6>
                            <h4 className="text-success mb-0">{totalIncome}</h4>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-6 col-xl-4">
                    <div className="card border-0 shadow-sm h-100 text-center">
                        <div className="card-body">
                            <h6 className="text-muted">Total Expense</h6>
                            <h4 className="text-danger mb-0">{totalExpense}</h4>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-3 mb-4">
                <div className="col-12 col-xl-6">
                    <ExpensePieChart data={data} filterType="all" />
                </div>
                <div className="col-12 col-xl-6">
                    <IncomeExpenseBarChart data={data} filterType="all" />
                </div>
            </div>

            <div className="card border-0 shadow-sm">
                <div className="card-body p-0">
                    <DataTable
                        columns={columns}
                        data={data}
                        pagination
                        highlightOnHover
                        striped
                        responsive
                    />
                </div>
            </div>
        </div>
    )
}

export default ExpanceTracker;
