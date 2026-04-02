import React, { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { addTranscation } from "../redux/expenseslice";
const Addtransaction = () => {
    const [type, setType] = useState("income");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [date, setDate] = useState("");
    const [note, setNotes] = useState("");
    const dispatch = useDispatch();

    const saveTransaction = async () => {
        let trans = {
            amount: amount, category: category, type: type, date: date, notes: note
        };

        console.log("trans", trans);
        dispatch(addTranscation(trans));

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
            url: "http://localhost:5000/api/transactions/add",
            method: "POST",
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
        }

    }
    return (
        <>
            <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
                <div className="bg-white rounded-4 shadow-lg" style={{ width: "400px" }}>

                    {/* Header */}
                    <h2 className="bg-primary text-white text-center py-3 rounded-top-4 mb-0">
                        Add Transaction
                    </h2>

                    {/* Body */}
                    <div className="p-4">
                        <div className="mb-3">
                            <label className="form-label">Transaction Type</label>
                            <div className="d-flex justify-content-center mt-4">
                                <div className="btn-group bg-light p-1 rounded-3 shadow-sm">

                                    <button
                                        className={`btn d-flex align-items-center gap-2 px-4 rounded-3 ${type === "income"
                                            ? "btn-success text-white"
                                            : "btn-light text-secondary"
                                            }`}
                                        onClick={() => setType("income")}
                                    >
                                        <i className="bi bi-person-fill"></i>
                                        Income
                                    </button>

                                    <button
                                        className={`btn d-flex align-items-center gap-2 px-4 rounded-3 ${type === "expense"
                                            ? "btn-success text-white"
                                            : "btn-light text-secondary"
                                            }`}
                                        onClick={() => setType("expense")}
                                    >
                                        <i className="bi bi-person"></i>
                                        Expense
                                    </button>

                                </div>
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Amount</label>
                            <input className="form-control" value={amount} onChange={(e) => setAmount(e.target.value)} />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Category</label>
                            <input className="form-control" value={category} onChange={(e) => setCategory(e.target.value)} />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Date</label>
                            <input
                                type="date"
                                className="form-control w-auto"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                            {/* <input className="form-control" type="date" value={date} onChange={(e) => setDate(e.target.value)} /> */}
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Notes</label>
                            <input className="form-control" value={note} onChange={(e) => setNotes(e.target.value)} />
                        </div>

                        <button className="btn btn-primary w-100" onClick={() => saveTransaction()}>
                            Save Transaction
                        </button>
                    </div>

                </div>
            </div>
        </>
    )
}
export default Addtransaction;