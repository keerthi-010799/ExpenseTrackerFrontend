import React, { useRef, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import register from '../assets/registerimg.png';

const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmpass, setConfirm] = useState("");
    const navigate = useNavigate();
    const userRef = useRef();
    const passwordRef = useRef();
    const confirmRef = useRef();

    const registerHandler = async () => {
        if (username && password) {
            console.log("username,password,confirm", username, password, confirmpass);
            if (password === confirmpass) {
                let headersList = {
                    "Accept": "*/*",
                    "Content-Type": "application/json"
                }

                let bodyContent = JSON.stringify({
                    "user": username,
                    "password": password,
                });

                let reqOptions = {
                    url: "http://localhost:5000/api/user/addUser",
                    method: "POST",
                    headers: headersList,
                    data: bodyContent,
                }

                let response = await axios.request(reqOptions);
                console.log("resps]", response);

                navigate("/");
            } else { alert("Password not match") }
        } else {
            alert("Please Enter user details")
        }

    }
    return (
        <>
            <div className="d-flex flex-row justify-content-center align-items-center vh-100">
                <div className="d-flex flex-column align-items-center text-center">
                    <h3> Register</h3>
                    <img src={register} alt="register here" className="w-45" />
                    <div className="mt-3">
                        <input placeholder="Username" ref={userRef} onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div className="mt-3">
                        <input placeholder="Password" type="password" ref={passwordRef} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className="mt-3">
                        <input placeholder="Confirm Password" type="password" ref={confirmRef} onChange={(e) => setConfirm(e.target.value)} />
                    </div>
                    <div className="mt-3">
                        <button className="btn btn-success px-5" onClick={() => registerHandler()}>Register</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Register;