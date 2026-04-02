import { useState } from "react";
import { useNavigate } from "react-router-dom";
const First = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [mobile, setMobile] = useState("");
    const [gender, setGender] = useState("");

    const clicked = () => {
        console.log(name, age, mobile, gender, "data received")
        navigate("/second", { state: { name: name, age, mobile, gender } })
    }

    return (
        <>
            <h1>Personal Info</h1>
            <div><label> Name:</label> <input onChange={(e) => {
                setName(e.target.value);
            }} /></div>
            <div><label> Age:</label> <input onChange={(e) => {
                setAge(e.target.value);
            }} /></div>

            <div><label> Mobile:</label> <input onChange={(e) => {
                setMobile(e.target.value);
            }} /></div>
            <div><label> Gender:</label> <input onChange={(e) => {
                setGender(e.target.value);
            }} /></div>
            <button onClick={() => clicked()}>Submit</button>
        </>
    )
}

export default First;