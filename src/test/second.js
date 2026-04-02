import { useLocation } from "react-router-dom";

const Second = () => {
    const location = useLocation();

    const state = location.state;

    return (
        <>
            <h2>Profile</h2>
            <div><label>Name:</label><span>{state.name}</span></div>
            <div><label>Age:</label><span>{state.age}</span></div>
            <div><label>Mobile:</label><span>{state.mobile}</span></div>
            <div><label>Gender:</label><span>{state.gender}</span></div>
        </>
    )
}

export default Second;