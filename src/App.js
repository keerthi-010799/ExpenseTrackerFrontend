import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { Route, Routes, useLocation } from 'react-router-dom';
import Sidebar from './components/sidebar';
import { clearStoredUser, getStoredUser } from './utils/auth';

const Login = lazy(() => import('./components/login'));
const Register = lazy(() => import('./components/register'));
const AddTransaction = lazy(() => import('./components/addTransaction'));
const Report = lazy(() => import('./components/reportsPage'));
const ExpenseTracker = lazy(() => import('./components/expanceTracker'));
const ManageTransaction = lazy(() => import('./components/managetransaction'));

const PAGE_TITLES = {
  '/': '/',
  '/register': '/register',
  '/dashboard': 'Dashboard',
  '/addtransaction': 'Add Transaction',
  '/managetransactions': 'Manage Transactions',
  '/reports': 'Reports',
};

const HIDE_SIDEBAR_PAGES = ['/', '/register'];
const APP_ROUTES = [
  { path: '/register', element: <Register /> },
  { path: '/addtransaction', element: <AddTransaction /> },
  { path: '/dashboard', element: <ExpenseTracker /> },
  { path: '/managetransactions', element: <ManageTransaction /> },
  { path: '/reports', element: <Report /> },
];

function PageLoader() {
  return (
    <div className="d-flex justify-content-center align-items-center py-5">
      <div className="spinner-border text-primary" role="status" aria-label="Loading page" />
    </div>
  );
}

function App() {
  const [showSidebar, setShowSidebar] = useState(true);
  const [isCompactScreen, setIsCompactScreen] = useState(() => window.innerWidth < 992);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const currentUser = getStoredUser();
  const isAuthenticated = Boolean(currentUser);

  useEffect(() => {
    if (isAuthenticated && pathname === '/') {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate, pathname]);

  useEffect(() => {
    const handleResize = () => {
      const compactScreen = window.innerWidth < 992;
      setIsCompactScreen(compactScreen);
      setShowSidebar((currentValue) => (compactScreen ? false : currentValue));
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isCompactScreen) {
      setShowSidebar(false);
    }
  }, [isCompactScreen, pathname]);

  useEffect(() => {
    setShowProfileMenu(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const pageTitle = PAGE_TITLES[pathname] || 'Dashboard';
  const shouldHideSidebar = HIDE_SIDEBAR_PAGES.includes(pathname);
  const showContent = !shouldHideSidebar && isCompactScreen ? !showSidebar : true;
  const handleLogout = () => {
    clearStoredUser();
    setShowSidebar(false);
    setShowProfileMenu(false);
    navigate('/');
  };

  return (
    <>
      {!shouldHideSidebar && (
        // <nav className="navbar navbar-light bg-light border-bottom shadow-sm">
        //   <div className="container-fluid px-3 px-lg-4 py-3">
        //     <div className="position-relative d-flex align-items-center justify-content-between min-vw-0">
        //       <div className="d-flex justify-content-start">
        //         <button
        //           type="button"
        //           className="btn btn-outline-primary"
        //           onClick={() => setShowSidebar((currentValue) => !currentValue)}
        //           aria-label="Toggle sidebar"
        //         >
        //           &#9776;
        //         </button>
        //       </div>

        //       <div className="position-absolute top-50 start-50 translate-middle text-center pe-none">
        //         <span className="navbar-brand fw-bold text-primary mb-0">
        //           {pageTitle}
        //         </span>
        //       </div>

        //       <div className="d-flex justify-content-end ms-auto" ref={profileMenuRef}>
        //         <div className="dropdown position-relative">
        //           <button
        //             type="button"
        //             className="btn btn-outline-secondary d-flex align-items-center gap-2"
        //             onClick={() => setShowProfileMenu((currentValue) => !currentValue)}
        //             aria-expanded={showProfileMenu}
        //           >
        //             <i className="bi bi-person-circle"></i>
        //             <span className="d-none d-md-inline text-truncate">{currentUser?.user || 'Profile'}</span>
        //             <i className="bi bi-caret-down-fill small"></i>
        //           </button>
        //           {showProfileMenu && (
        //             <div className="dropdown-menu dropdown-menu-end show shadow-sm border-0">
        //               <div className="dropdown-item-text">
        //                 <div className="fw-semibold">{currentUser?.user || 'Profile'}</div>
        //                 <div className="text-muted small">Signed in account</div>
        //               </div>
        //               <div className="dropdown-divider"></div>
        //               <button
        //                 type="button"
        //                 className="dropdown-item text-danger"
        //                 onClick={handleLogout}
        //               >
        //                 <i className="bi bi-box-arrow-right me-2"></i>
        //                 Logout
        //               </button>
        //             </div>
        //           )}
        //         </div>
        //       </div>
        //     </div>
        //   </div>
        // </nav>
        <nav className="navbar navbar-light bg-light border-bottom shadow-sm">
          <div className="container-fluid px-3 px-lg-4 py-3 d-flex align-items-center justify-content-between">

            {/* LEFT: Sidebar Toggle */}
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => setShowSidebar((currentValue) => !currentValue)}
              aria-label="Toggle sidebar"
            >
              &#9776;
            </button>

            {/* CENTER: Page Title */}
            <span className="navbar-brand fw-bold text-primary mx-auto text-center">
              {pageTitle}
            </span>

            {/* RIGHT: Profile */}
            <div className="dropdown ms-auto" ref={profileMenuRef}>
              <button
                type="button"
                className="btn btn-light border-0 d-flex align-items-center justify-content-center rounded-circle"
                style={{ width: "40px", height: "40px" }}
                onClick={() => setShowProfileMenu((prev) => !prev)}
                aria-expanded={showProfileMenu}
              >
                <i className="bi bi-person-circle fs-4"></i>
              </button>

              {showProfileMenu && (
                <div className="dropdown-menu dropdown-menu-end show shadow border-0 mt-2">

                  {/* User Info */}
                  <div className="dropdown-item-text text-center">
                    <div className="fw-semibold">
                      {currentUser?.user || "User"}
                    </div>
                    <div className="text-muted small">Signed in</div>
                  </div>

                  <div className="dropdown-divider"></div>

                  {/* Logout */}
                  <button
                    type="button"
                    className="dropdown-item text-danger d-flex align-items-center gap-2"
                    onClick={handleLogout}
                  >
                    <i className="bi bi-box-arrow-right"></i>
                    Logout
                  </button>

                </div>
              )}
            </div>

          </div>
        </nav>
      )}
      <div className="container-fluid px-0">
        {!shouldHideSidebar && isCompactScreen && showSidebar && (
          <div className="row g-0">
            <div className="col-12">
              <Sidebar onNavigate={() => setShowSidebar(false)} />
            </div>
          </div>
        )}
        <div className="row g-0">
          {!shouldHideSidebar && (
            <div className={`border-end min-vh-100 bg-primary ${isCompactScreen ? 'd-none' : showSidebar ? 'col-lg-3 col-xl-2 d-block' : 'd-none'}`}>
              <Sidebar />
            </div>
          )}
          <div className={shouldHideSidebar ? 'col-12' : !showContent ? 'd-none' : showSidebar && !isCompactScreen ? 'col-12 col-lg-9 col-xl-10' : 'col-12'}>
            <div className="p-3 p-md-4">
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={isAuthenticated ? <ExpenseTracker /> : <Login />} />
                  {APP_ROUTES.map((route) => (
                    <Route key={route.path} path={route.path} element={route.element} />
                  ))}
                </Routes>
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </>

  );
}

export default App;
