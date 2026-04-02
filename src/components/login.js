import React, { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import axios from "axios";
import login from '../assets/login.jpg';


const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isremember, setIsremember] = useState(false);
    const history = useNavigate();
    const userRef = useRef();
    const passwordRef = useRef();

    const loginHandler = async () => {
        if (username && password) {
            console.log("username,password", username, password);
            let headersList = {
                "Accept": "*/*",
                "Content-Type": "application/json"
            }

            let bodyContent = JSON.stringify({
                "user": username,
                "password": password,
            });

            let reqOptions = {
                url: "http://localhost:5000/api/user/loginuser",
                method: "POST",
                headers: headersList,
                data: bodyContent,
            }

            let response = await axios.request(reqOptions);
            console.log("/n login resps]", response);


            if (response.data.user === username && response.data.password === password) {
                history("/dashboard");
                if (isremember) {
                    let userdata = { user: username, password: password };
                    localStorage.setItem("user", JSON.stringify(userdata));
                }
            } else { alert("user data not match,Can't login") }
        } else {
            alert("Please Enter user details")
        }

    }
    return (
        <>
            <div className="d-flex flex-row justify-content-center align-items-center vh-100">
                <div className="d-flex flex-column align-items-center text-center">
                    <h3> Login</h3>
                    <img src={login} alt="login here" className="w-25" />
                    <div className="mt-3">
                        <input placeholder="Username" ref={userRef} onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div className="mt-3">
                        <input placeholder="Password" type="password" ref={passwordRef} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className="mt-3">
                        <input type="checkbox" checked={isremember} onChange={() => { setIsremember(!isremember) }} />
                        <label>Remember me</label>
                    </div>
                    <div className="mt-3">
                        <button className="btn btn-primary px-5" onClick={() => loginHandler()}>Login</button>
                    </div>
                    <div className="mt-3">
                        Don't have account?
                        <Link to="/register"> Register</Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login;