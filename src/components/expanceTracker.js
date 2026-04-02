import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { ExpensePieChart, IncomeExpenseBarChart } from '../components/charts';
import useExpenseData from "../customhooks/useExpenseData";
const ExpanceTracker = () => {
    const { expense } = useExpenseData();

    const [data, setData] = useState([]);

    useEffect(() => {
        console.log("dispatched", expense);
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

    console.log("expanceincome", totalAmount, totalExpense, totalIncome);

    return (
        <>
            <div><h3>Expance Tracker</h3>
                <div className="container mt-4">
                    <div className="row">
                        <div className="col-md-4 mb-3">
                            <div className="card shadow-sm text-center">
                                <div className="card-body">
                                    <h6 className="text-muted">Total Balance</h6>
                                    <h4 className="text-primary">{totalAmount}</h4>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4 mb-3">
                            <div className="card shadow-sm text-center">
                                <div className="card-body">
                                    <h6 className="text-muted">Total Income</h6>
                                    <h4 className="text-success">{totalIncome}</h4>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4 mb-3">
                            <div className="card shadow-sm text-center">
                                <div className="card-body">
                                    <h6 className="text-muted">Total Expense</h6>
                                    <h4 className="text-danger">{totalExpense}</h4>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <div className='d-flex flex-row'><ExpensePieChart data={data}
                    filterType="all" /><IncomeExpenseBarChart data={data}
                        filterType="all" /></div>
                <div>
                    <DataTable
                        columns={columns}
                        data={data}
                        pagination
                        highlightOnHover
                        striped
                        responsive />
                </div>
            </div>
        </>
    )
}

export default ExpanceTracker;