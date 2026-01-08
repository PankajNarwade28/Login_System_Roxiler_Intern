import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import "./Navbar.css";
import AuthForm from "./components/Auth/AuthForm";
import UserLists from "./components/User/userLists";

function Home({ backendMessage, checkBackend, loading }) {
  return (
    <div className="status-container">
      <h3>Backend Status:</h3>
      <p className="response-text">{backendMessage}</p>
      <button onClick={checkBackend} disabled={loading}>
        {loading ? "Checking..." : "Check Backend Response"}
      </button>
    </div>
  );
}

function App() {
  const navigate = useNavigate();
  const [backendMessage, setBackendMessage] = useState("No response yet");
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Check login status
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const isLoggedIn = !!token;

  const checkBackend = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/hello`
      );
      setBackendMessage(response.data.message);
    } catch (error) {
      setBackendMessage("Failed to connect to backend");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setMenuOpen(false);
    alert("Logged out successfully");
    navigate("/auth");
  };

  return (
    <div className="App">
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            LoginSYS
          </Link>

          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <span className={menuOpen ? "bar open" : "bar"}></span>
            <span className={menuOpen ? "bar open" : "bar"}></span>
            <span className={menuOpen ? "bar open" : "bar"}></span>
          </button>

          {/* Nav Links - Conditional rendering for Admin only */}
          <div className={`nav-links ${menuOpen ? "active" : ""}`}>
            <Link
              to="/"
              className="nav-item"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>

            {/* Only show the Users link if the logged-in user is a System Administrator */}
            {isLoggedIn && user?.role === "System Administrator" && (
              <Link
                to="/users"
                className="nav-item"
                onClick={() => setMenuOpen(false)}
              >
                Users
              </Link>
            )}

            {!isLoggedIn ? (
              <Link
                to="/auth"
                className="nav-item"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
            ) : (
              <div className="nav-auth-section">
                <span className="user-info-tag">{user?.role}</span>
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="content-area">
        <Routes>
          <Route
            path="/"
            element={
              <Home
                backendMessage={backendMessage}
                checkBackend={checkBackend}
                loading={loading}
              />
            }
          />
          <Route path="/users" element={<UserLists />} />
          <Route path="/auth" element={<AuthForm />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
