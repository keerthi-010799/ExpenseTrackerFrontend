import React, { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { fetchTransactions } from "../redux/expenseslice";
import { getStoredUser } from "../utils/auth";
import StatusToast from "./statusToast";

const Addtransaction = () => {
    const [type, setType] = useState("income");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [date, setDate] = useState("");
    const [note, setNotes] = useState("");
    const [status, setStatus] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const dispatch = useDispatch();

    const saveTransaction = async () => {
        setStatus(null);
        const currentUser = getStoredUser();

        if (!currentUser?.id) {
            setStatus({
                type: "error",
                title: "Session expired",
                message: "Please login again before adding a transaction.",
            });
            return;
        }

        if (!amount || !category || !date) {
            setStatus({
                type: "error",
                title: "Missing details",
                message: "Amount, category, and date are required.",
            });
            return;
        }

        let headersList = {
            "Accept": "*/*",
            "Content-Type": "application/json"
        }

        let bodyContent = JSON.stringify({
            "apitype": "addTransaction",
            "data": {
                "amount": amount,
                "category": category,
                "type": type,
                "date": date,
                "notes": note,
                "userId": currentUser.id
            }
        });

        let reqOptions = {
            url: "http://localhost:5000/api/transactions/transaction",
            method: "POST",
            headers: headersList,
            data: bodyContent,
        }

        try {
            setIsSubmitting(true);
            let response = await axios.request(reqOptions);
            if (response.status === 201 || response.status === 200) {
                setAmount("");
                setCategory("");
                setDate("");
                setNotes("");
                setType("income");
                dispatch(fetchTransactions(currentUser.id));
                setStatus({
                    type: "success",
                    title: "Transaction saved",
                    message: "Your transaction was added successfully.",
                });
            }
        } catch (error) {
            const message = error.response?.data?.message || "Unable to save transaction";
            setStatus({
                type: "error",
                title: "Save failed",
                message,
            });
        } finally {
            setIsSubmitting(false);
        }

    }
    return (
        <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-12 col-md-10 col-lg-8 col-xl-6">
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-primary text-white py-3">
                            <h2 className="h4 text-center mb-0">Add Transaction</h2>
                        </div>

                        <div className="card-body p-4">
                            <StatusToast status={status} onClose={() => setStatus(null)} />

                            <div className="mb-4">
                                <label className="form-label d-block">Transaction Type</label>
                                <div className="btn-group w-100" role="group" aria-label="Transaction type">
                                    <button
                                        type="button"
                                        className={`btn ${type === "income" ? "btn-success" : "btn-outline-success"}`}
                                        onClick={() => setType("income")}
                                    >
                                        Income
                                    </button>

                                    <button
                                        type="button"
                                        className={`btn ${type === "expense" ? "btn-danger" : "btn-outline-danger"}`}
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

                                <div className="col-12 d-grid">
                                    <button className="btn btn-primary" type="button" onClick={saveTransaction} disabled={isSubmitting}>
                                        {isSubmitting ? "Saving..." : "Save Transaction"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Addtransaction;
