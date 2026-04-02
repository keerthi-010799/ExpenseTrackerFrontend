import { useState, useEffect } from 'react';
import { useNavigate } from "react-router";
import { Routes, Route, useLocation } from 'react-router-dom';
import Login from './components/login';
import Register from './components/register';
import Addtransaction from './components/addTransaction';
import Report from './components/Report';
import ExpanceTracker from './components/expanceTracker';
import ManageTransaction from './components/managetransaction';
import Sidebar from './components/sidebar';

function App() {
  const [showSidebar, setShowSidebar] = useState(true);
  const location = useLocation();

  const navigate = useNavigate();
  const savedData = localStorage.getItem("user");

  useEffect(() => {
    console.log("locations", location.pathname, savedData)
    if (savedData && location.pathname === "/") {
      navigate("/dashboard");
    }
  }, [location.pathname, navigate, savedData]);

  const pageMap = {
    "/": "/",
    "/register": "/register",
    "/dashboard": "DASHBOARD",
    "/addtransaction": "ADD TRANSACTION",
    "/managetransactions": "MANAGE TRANSACTIONS",
    "/reports": "REPORTS",
  };
  const page = pageMap[location.pathname] || "DASHBOARD";
  const hideSidebarPages = ["/", "/register"];


  return (
    <>
      {!hideSidebarPages.includes(page) && (<nav className="navbar navbar-light bg-light shadow-sm px-3">
        <button
          className="btn btn-outline-primary"
          onClick={() => setShowSidebar(!showSidebar)}
        >
          ☰
        </button>
        <span className="navbar-brand fw-bold text-primary">
          {page}
        </span>
      </nav>)}
      <div className="App d-flex">
        {!hideSidebarPages.includes(page) && (<Sidebar showSidebar={showSidebar} />)}
        <div className="flex-grow-1 p-3">
          <Routes>
            <Route path='/' element={savedData ? <ExpanceTracker /> : <Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/addtransaction' element={<Addtransaction />} />
            <Route path='/dashboard' element={<ExpanceTracker />} />
            <Route path='/managetransactions' element={<ManageTransaction />} />
            <Route path='/reports' element={<Report />} />
          </Routes>
        </div>
      </div>
    </>

  );
}

export default App;
