import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = (props) => {
    const showSidebar = props.showSidebar;
    const location = useLocation();
    const [activeMenu, setActiveMenu] = useState(location.pathname);
    const navigate = useNavigate();

    const menuItems = [
        { id: 1, name: "Dashboard", icon: "bi-speedometer2", pathname: "/dashboard" },
        { id: 2, name: "Add Transaction", icon: "bi-plus-circle", pathname: "/addtransaction" },
        { id: 3, name: "Manage Transactions", icon: "bi-gear", pathname: "/managetransactions" },
        { id: 4, name: "Reports", icon: "bi-bar-chart", pathname: "/reports" },
    ];

    const navbarNavigate = (item) => {
        setActiveMenu(item.pathname);
        navigate(item.pathname);
    };

    const handleLogout = () => {
        // clear token or user data
        localStorage.removeItem("user");

        // redirect to login
        navigate("/");
    };

    return (
        <div className="d-flex">

            {/* Sidebar */}
            <div
                className="bg-primary text-white d-flex flex-column"
                style={{
                    width: showSidebar ? "250px" : "0px",
                    minHeight: "100vh",
                    transition: "width 0.3s ease",
                    overflow: "hidden"
                }}
            >
                {showSidebar && (
                    <>
                        {/* Header */}
                        <div>
                            <h5 className="text-center my-4">Expense Tracker</h5>
                        </div>

                        {/* Menu */}
                        <div className="flex-grow-1 px-2">
                            <ul className="nav flex-column">
                                {menuItems.map((item) => (
                                    <li className="nav-item mb-2" key={item.id}>
                                        <button
                                            className={`btn w-100 text-start ${activeMenu === item.pathname
                                                ? "btn-light text-primary"
                                                : "btn-primary"
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

                        {/* Footer */}
                        <div className="p-3 border-top">
                            <button
                                className="btn btn-danger w-100"
                                onClick={handleLogout}
                            >
                                <i className="bi bi-box-arrow-right me-2"></i>
                                Logout
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Sidebar;