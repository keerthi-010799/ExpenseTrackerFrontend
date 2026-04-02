import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import useExpenseData from "../customhooks/useExpenseData";


const ManageTransaction = () => {
    const { expense } = useExpenseData();
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
            url: `${"http://localhost:5000/api/transactions/delete/" + id}`,
            method: "DELETE",
        }

        let response = await axios.request(reqOptions);
        console.log("resp", response, response.data);
        if (response.status === 200) {
            setAmount("");
            setCategory("");
            setDate("");
            setNotes("");
            setType("income");
            const dataexp = response.data.row.map((item, index) => ({
                ...item,
                itemid: index + 1
            }));
            setData(dataexp)
        }
    };

    // Edit function
    const handleEdit = (row) => {
        console.log("clicked edit", row, data)
        setShowModal(!showModal);
        const selectedItem = data.find(item => item._id === row);
        console.log("newData", selectedItem);
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
        console.log("trans data ", id, amount, category, type, date, note
        )
        let headersList = {
            "Accept": "*/*",
            "Content-Type": "application/json"
        }

        let bodyContent = JSON.stringify({
            "amount": amount,
            "category": category,
            "type": type,
            "date": date,
            "notes": note
        });

        let reqOptions = {
            url: `${"http://localhost:5000/api/transactions/update/" + id}`,
            method: "PUT",
            headers: headersList,
            data: bodyContent,
        }

        let response = await axios.request(reqOptions);
        console.log("resp", response.status, response.status === 200, response.data);
        if (response.status === 200) {
            setAmount("");
            setCategory("");
            setDate("");
            setNotes("");
            setType("income");
            const dataexp = response.data.map((item, index) => ({
                ...item,
                itemid: index + 1
            }));
            setData(dataexp)
        }


    }


    return (
        <>
            <h3>
                Manage Transactions
            </h3>
            <div style={{ padding: "20px" }}>
                <input
                    type="text"
                    placeholder="Search..."
                    className="form-control mb-3"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />

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

            {showModal && (
                <>
                    {/* Modal */}
                    <div className="modal show fade d-block" tabIndex="-1">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content rounded-4 shadow-lg">

                                {/* Header */}
                                <div className="modal-header bg-primary text-white rounded-top-4">
                                    <h5 className="modal-title">
                                        Add Transaction
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close btn-close-white"
                                        onClick={() => setShowModal(false)}
                                    ></button>
                                </div>

                                {/* Body */}
                                <div className="modal-body p-4">

                                    <div className="mb-3">
                                        <label className="form-label">Transaction Type</label>
                                        <div className="d-flex justify-content-center mt-3">
                                            <div className="btn-group bg-light p-1 rounded-3 shadow-sm">

                                                <button
                                                    className={`btn px-4 rounded-3 ${type === "income"
                                                        ? "btn-success text-white"
                                                        : "btn-light text-secondary"
                                                        }`}
                                                    onClick={() => setType("income")}
                                                >
                                                    Income
                                                </button>

                                                <button
                                                    className={`btn px-4 rounded-3 ${type === "expense"
                                                        ? "btn-success text-white"
                                                        : "btn-light text-secondary"
                                                        }`}
                                                    onClick={() => setType("expense")}
                                                >
                                                    Expense
                                                </button>

                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Amount</label>
                                        <input
                                            className="form-control"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Category</label>
                                        <input
                                            className="form-control"
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Date</label>
                                        <input
                                            // type="date"
                                            className="form-control"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Notes</label>
                                        <input
                                            className="form-control"
                                            value={note}
                                            onChange={(e) => setNotes(e.target.value)}
                                        />
                                    </div>

                                </div>

                                {/* Footer */}
                                <div className="modal-footer">
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        className="btn btn-primary"
                                        onClick={() => {
                                            EditTransaction();
                                            setShowModal(false);
                                        }}
                                    >
                                        Edit Transaction
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* Backdrop */}
                    <div className="modal-backdrop fade show"></div>
                </>
            )}
        </>
    )
}

export default ManageTransaction;