import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import login from '../assets/login.jpg';
import { storeUserSession } from "../utils/auth";
import StatusToast from "./statusToast";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isremember, setIsremember] = useState(false);
    const [status, setStatus] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const loginHandler = async (event) => {
        event.preventDefault();
        setStatus(null);

        if (!username || !password) {
            setStatus({
                type: "error",
                title: "Missing details",
                message: "Enter both username and password to continue.",
            });
            return;
        }

        try {
            setIsSubmitting(true);
            const response = await axios.request({
                url: "http://localhost:5000/api/user/user",
                method: "POST",
                headers: {
                    "Accept": "*/*",
                    "Content-Type": "application/json"
                },
                data: JSON.stringify({
                    "apitype": "loginUser",
                    "user": username,
                    "password": password,
                    "rememberMe": isremember,
                }),
            });

            const userdata = {
                ...response.data.user,
                token: response.data.token,
                rememberMe: isremember,
            };

            storeUserSession(userdata, isremember);
            setStatus({
                type: "success",
                title: "Welcome back",
                message: "Login successful. Redirecting to your dashboard...",
            });
            setTimeout(() => {
                navigate("/dashboard");
            }, 700);
        } catch (error) {
            const message = error.response?.data?.message || "Unable to login";
            setStatus({
                type: "error",
                title: "Login failed",
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
                                <img src={login} alt="Login" className="img-fluid rounded mb-3" />
                                <h3 className="mb-1">Login</h3>
                                <p className="text-muted mb-0">Sign in to manage your expense tracker.</p>
                            </div>

                            <StatusToast status={status} onClose={() => setStatus(null)} />

                            <form onSubmit={loginHandler} className="row g-3">
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
                                    <div className="form-check">
                                        <input
                                            id="remember-user"
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={isremember}
                                            onChange={() => setIsremember(!isremember)}
                                        />
                                        <label htmlFor="remember-user" className="form-check-label">
                                            Remember me
                                        </label>
                                    </div>
                                </div>

                                <div className="col-12 d-grid">
                                    <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? "Signing in..." : "Login"}
                                    </button>
                                </div>
                            </form>

                            <p className="text-center mt-4 mb-0">
                                Don&apos;t have an account? <Link to="/register">Register</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;
