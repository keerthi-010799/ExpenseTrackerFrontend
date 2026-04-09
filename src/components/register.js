import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import register from '../assets/registerimg.png';
import StatusToast from "./statusToast";

const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmpass, setConfirm] = useState("");
    const [status, setStatus] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const registerHandler = async (event) => {
        event.preventDefault();
        setStatus(null);

        if (!username || !password) {
            setStatus({
                type: "error",
                title: "Missing details",
                message: "Complete the username and password fields to create your account.",
            });
            return;
        }

        if (password !== confirmpass) {
            setStatus({
                type: "error",
                title: "Password mismatch",
                message: "Password and confirm password should match.",
            });
            return;
        }

        try {
            setIsSubmitting(true);
            await axios.request({
                url: "http://localhost:5000/api/user/user",
                method: "POST",
                headers: {
                    "Accept": "*/*",
                    "Content-Type": "application/json"
                },
                data: JSON.stringify({
                    "apitype": "addUser",
                    "user": username,
                    "password": password,
                }),
            });

            setStatus({
                type: "success",
                title: "Account created",
                message: "Registration successful. Taking you to login...",
            });
            setTimeout(() => {
                navigate("/");
            }, 900);
        } catch (error) {
            const message = error.response?.data?.message || "Unable to register";
            setStatus({
                type: "error",
                title: "Registration failed",
                message,
            });
        } finally {
            setIsSubmitting(false);
        }

    }
    return (
        <div className="container py-4 py-md-5">
            <div className="row justify-content-center">
                <div className="col-12 col-sm-10 col-md-8 col-lg-5 col-xl-4">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body p-4 p-md-5">
                            <div className="text-center mb-4">
                                <img src={register} alt="Register" className="img-fluid rounded mb-3" />
                                <h3 className="mb-1">Register</h3>
                                <p className="text-muted mb-0">Create your account to start tracking expenses.</p>
                            </div>

                            <StatusToast status={status} onClose={() => setStatus(null)} />

                            <form onSubmit={registerHandler} className="row g-3">
                                <div className="col-12">
                                    <label className="form-label">Username</label>
                                    <input
                                        className="form-control"
                                        placeholder="Enter username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>

                                <div className="col-12">
                                    <label className="form-label">Password</label>
                                    <input
                                        className="form-control"
                                        placeholder="Enter password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>

                                <div className="col-12">
                                    <label className="form-label">Confirm Password</label>
                                    <input
                                        className="form-control"
                                        placeholder="Confirm password"
                                        type="password"
                                        value={confirmpass}
                                        onChange={(e) => setConfirm(e.target.value)}
                                    />
                                </div>

                                <div className="col-12 d-grid">
                                    <button className="btn btn-success" type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? "Creating account..." : "Register"}
                                    </button>
                                </div>
                            </form>

                            <p className="text-center mt-4 mb-0">
                                Already have an account? <Link to="/">Login</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register;
