import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import { useDispatch } from "react-redux";
import useExpenseData from "../customhooks/useExpenseData";
import { fetchTransactions } from "../redux/expenseslice";
import { getStoredUser } from "../utils/auth";


const ManageTransaction = () => {
    const { expense } = useExpenseData();
    const dispatch = useDispatch();
    const currentUser = getStoredUser();
    const currentUserId = currentUser?.id;
    const [search, setSearch] = useState("");
    const [data, setData] = useState([]);

    //modal state
    const [showModal, setShowModal] = useState(false);
    const [type, setType] = useState("income");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [date, setDate] = useState("");
    const [note, setNotes] = useState("");
    const [id, setId] = useState("");
    //
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
            name: "Amount",
            selector: row => row.amount,
            sortable: true
        },
        {
            name: "Type",
            selector: row => row.type,
            sortable: true
        },
        {
            name: "Catogery",
            selector: row => row.category,
            sortable: true
        },
        {
            name: "Date",
            selector: row => row.date,
            sortable: true
        },
        {
            name: "Notes",
            selector: row => row.notes,
            sortable: true
        },
        {
            name: "Actions",
            cell: (row) => (
                <div className="d-flex gap-2">
                    <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => { handleEdit(row._id) }}
                    >
                        <i className="bi bi-pencil"></i>
                    </button>

                    <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(row._id)}
                    >
                        <i className="bi bi-trash"></i>
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        }
    ];

    // Filter data based on search
    const filteredData = data.filter(item =>
        item.category.toLowerCase().includes(search.toLowerCase()) ||
        item.notes.toLowerCase().includes(search.toLowerCase()) ||
        item.type.toLowerCase().includes(search.toLowerCase())
    );

    // Delete function
    const handleDelete = async (id) => {
        let reqOptions = {
            url: `${"http://localhost:5000/api/transactions/transaction"}`,
            method: "POST",
            data: { apitype: "deleteTransaction", id, userId: currentUserId }
        }

        let response = await axios.request(reqOptions);
        if (response.status === 200) {
            setAmount("");
            setCategory("");
            setDate("");
            setNotes("");
            setType("income");
            dispatch(fetchTransactions(currentUserId));
        }
    };

    // Edit function
    const handleEdit = (row) => {
        setShowModal(!showModal);
        const selectedItem = data.find(item => item._id === row);
        if (selectedItem) {
            setAmount(selectedItem.amount);
            setCategory(selectedItem.category);
            setDate(selectedItem.date);
            setNotes(selectedItem.notes);
            setType(selectedItem.type);
            setId(selectedItem._id)
        }

    };
    //edit apicall
    const EditTransaction = async () => {
        let headersList = {
            "Accept": "*/*",
            "Content-Type": "application/json"
        }

        let bodyContent = JSON.stringify({
            "apitype": "updateTransaction",
            "id": id,
            "userId": currentUserId,
            "data": {
                "amount": amount,
                "category": category,
                "type": type,
                "date": date,
                "notes": note
            }
        });

        let reqOptions = {
            url: `${"http://localhost:5000/api/transactions/transaction"}`,
            method: "POST",
            headers: headersList,
            data: bodyContent,
        }

        let response = await axios.request(reqOptions);
        if (response.status === 200) {
            setAmount("");
            setCategory("");
            setDate("");
            setNotes("");
            setId("");
            setType("income");
            await dispatch(fetchTransactions(currentUserId));
            setShowModal(false);
        }


    }


    return (
        <>
            <div className="container-fluid px-0">
                <div className="mb-4">
                    <h3 className="mb-1">Manage Transactions</h3>
                    <p className="text-muted mb-0">Search, edit, or remove transactions from your history.</p>
                </div>

                <div className="card border-0 shadow-sm">
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-12 col-lg-6">
                                <label className="form-label">Search</label>
                                <input
                                    type="text"
                                    placeholder="Search by category, notes, or type"
                                    className="form-control"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="card-body pt-0">
                        <DataTable
                            columns={columns}
                            data={filteredData}
                            pagination
                            selectableRows
                            highlightOnHover
                            striped
                            responsive
                        />
                    </div>
                </div>
            </div>

            {showModal && (
                <>
                    <div className="modal show fade d-block" tabIndex="-1">
                        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                            <div className="modal-content border-0 shadow">
                                <div className="modal-header bg-primary text-white">
                                    <h5 className="modal-title">
                                        Edit Transaction
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close btn-close-white"
                                        onClick={() => setShowModal(false)}
                                    ></button>
                                </div>

                                <div className="modal-body p-4">
                                    <div className="mb-3">
                                        <label className="form-label d-block">Transaction Type</label>
                                        <div className="btn-group w-100" role="group" aria-label="Edit transaction type">
                                            <button
                                                type="button"
                                                className={`btn ${type === "income"
                                                    ? "btn-success"
                                                    : "btn-outline-success"
                                                    }`}
                                                onClick={() => setType("income")}
                                            >
                                                Income
                                            </button>

                                            <button
                                                type="button"
                                                className={`btn ${type === "expense"
                                                    ? "btn-danger"
                                                    : "btn-outline-danger"
                                                    }`}
                                                onClick={() => setType("expense")}
                                            >
                                                Expense
                                            </button>
                                        </div>
                                    </div>

                                    <div className="row g-3">
                                        <div className="col-12 col-md-6">
                                            <label className="form-label">Amount</label>
                                            <input
                                                className="form-control"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                            />
                                        </div>

                                        <div className="col-12 col-md-6">
                                            <label className="form-label">Category</label>
                                            <input
                                                className="form-control"
                                                value={category}
                                                onChange={(e) => setCategory(e.target.value)}
                                            />
                                        </div>

                                        <div className="col-12 col-md-6">
                                            <label className="form-label">Date</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={date}
                                                onChange={(e) => setDate(e.target.value)}
                                            />
                                        </div>

                                        <div className="col-12">
                                            <label className="form-label">Notes</label>
                                            <textarea
                                                className="form-control"
                                                rows="3"
                                                value={note}
                                                onChange={(e) => setNotes(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="modal-footer">
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        className="btn btn-primary"
                                        onClick={EditTransaction}
                                    >
                                        Edit Transaction
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="modal-backdrop fade show"></div>
                </>
            )}
        </>
    )
}

export default ManageTransaction;
