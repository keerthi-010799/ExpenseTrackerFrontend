import { useLocation, useNavigate } from "react-router-dom";
import { clearStoredUser } from "../utils/auth";

const Sidebar = (props) => {
    const onNavigate = props.onNavigate;
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        { id: 1, name: "Dashboard", icon: "bi-speedometer2", pathname: "/dashboard" },
        { id: 2, name: "Add Transaction", icon: "bi-plus-circle", pathname: "/addtransaction" },
        { id: 3, name: "Manage Transactions", icon: "bi-gear", pathname: "/managetransactions" },
        { id: 4, name: "Reports", icon: "bi-bar-chart", pathname: "/reports" },
    ];

    const navbarNavigate = (item) => {
        navigate(item.pathname);
        if (onNavigate) {
            onNavigate();
        }
    };


    return (
        <div className="bg-primary text-white d-flex flex-column h-100 min-vh-100">
            <div className="border-bottom border-light border-opacity-25 px-3 px-lg-4 py-4">
                <h5 className="text-center mb-0 fw-semibold">Expense Tracker</h5>
            </div>

            <div className="flex-grow-1 px-2 px-lg-3 py-3">
                <ul className="nav flex-column gap-2">
                    {menuItems.map((item) => (
                        <li className="nav-item" key={item.id}>
                            <button
                                className={`btn w-100 text-start border-0 ${location.pathname === item.pathname
                                    ? "btn-light text-primary"
                                    : "btn-primary text-white"
                                    }`}
                                onClick={() => navbarNavigate(item)}
                            >
                                <i className={`bi ${item.icon} me-2`}></i>
                                {item.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;
