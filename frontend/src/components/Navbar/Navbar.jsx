import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ menuOpen, setMenuOpen }) => {
  const navigate = useNavigate();
  
  // Check if user is logged in 
  const isLoggedIn = !!localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token'); // [cite: 54, 61]
    localStorage.removeItem('user');
    alert("Logged out successfully");
    navigate('/auth'); // Redirect to login page [cite: 35]
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">LoginSYS</Link>
        
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span className={menuOpen ? "bar open" : "bar"}></span>
          <span className={menuOpen ? "bar open" : "bar"}></span>
          <span className={menuOpen ? "bar open" : "bar"}></span>
        </button>

        <div className={`nav-links ${menuOpen ? "active" : ""}`}>
          <Link to="/" className="nav-item" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/users" className="nav-item" onClick={() => setMenuOpen(false)}>Users</Link> 
          {/* Conditional Rendering based on login status [cite: 9] */}
          {!isLoggedIn ? (
            <Link to="/auth" className="nav-item" onClick={() => setMenuOpen(false)}>Login/Signup</Link>
          ) : (
            <>
              <span className="user-role-tag">{user?.role}</span>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};