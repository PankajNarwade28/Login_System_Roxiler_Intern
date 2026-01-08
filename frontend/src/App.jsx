import { Routes, Route, Link, useNavigate, Navigate } from "react-router-dom";
import { useState } from "react"; 
import "./App.css";
import "./Navbar.css"; 
import AdminDash from "./components/AdminDash/AdminDash";
import OwnerDash from "./components/OwnerDash/OwnerDash";
import UserDash from "./components/UserDash/UserDash";
import AuthForm from "./components/Auth/AuthForm";
import UserLists from "./components/User/userLists";
import UpdatePassword from "./components/UpdatePassword";

function App() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // Get user data from storage
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = !!token;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setMenuOpen(false);
    alert("Logged out successfully");
    navigate("/auth");
  };

  // Helper component to protect routes
  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!isLoggedIn) return <Navigate to="/auth" />;
    if (allowedRoles && !allowedRoles.includes(user?.role)) {
      return <Navigate to="/" />;
    }
    return children;
  };

  return (
    <div className="App">
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-logo">LoginSYS</Link>

          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <span className={menuOpen ? "bar open" : "bar"}></span>
            <span className={menuOpen ? "bar open" : "bar"}></span>
            <span className={menuOpen ? "bar open" : "bar"}></span>
          </button>

          <div className={`nav-links ${menuOpen ? "active" : ""}`}>
            <Link to="/" className="nav-item" onClick={() => setMenuOpen(false)}>Dashboard</Link>

            {isLoggedIn && user?.role === "System Administrator" && (
              <Link to="/users" className="nav-item" onClick={() => setMenuOpen(false)}>Manage Users</Link>
            )}


            {isLoggedIn && user?.role !== "System Administrator" && (
              <Link to="/password" className="nav-item" onClick={() => setMenuOpen(false)}>Update Password</Link>
            )}

            {!isLoggedIn ? (
              <Link to="/auth" className="nav-item" onClick={() => setMenuOpen(false)}>Login</Link>
            ) : (
              <div className="nav-auth-section">
                <span className="user-info-tag">{user?.role}</span>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="content-area">
        <Routes>
          {/* Main Entry Point: Dynamic Dashboard based on Role */}
          <Route path="/" element={
            !isLoggedIn ? <Navigate to="/auth" /> :
            user?.role === "System Administrator" ? <AdminDash /> :
            user?.role === "Store Owner" ? <OwnerDash /> :
            <UserDash />
          } />

          {/* Protected Route for Admin only */}
          <Route path="/users" element={
            <ProtectedRoute allowedRoles={["System Administrator"]}>
              <UserLists />
            </ProtectedRoute>
          } />


          {/* Protected Route for Admin only */}
          <Route path="/password" element={
            <ProtectedRoute allowedRoles={["Normal User", "Store Owner"]}>
              <UpdatePassword />
            </ProtectedRoute>
          } />

          {/* Authentication Route */}
          <Route path="/auth" element={isLoggedIn ? <Navigate to="/" /> : <AuthForm />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;