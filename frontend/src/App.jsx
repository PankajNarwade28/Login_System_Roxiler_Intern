import { Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios'; 
import './App.css'; 
import './Navbar.css';
import UserLists from './components/userLists';


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
  const [backendMessage, setBackendMessage] = useState("No response yet");
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const checkBackend = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/hello`);
      setBackendMessage(response.data.message);
    } catch (error) {
      setBackendMessage("Failed to connect to backend");
    } finally {
      setLoading(false);
    }
  };

 return (
    <div className="App">
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-logo">LoginSYS</Link>
          
          {/* Hamburger Icon */}
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <span className={menuOpen ? "bar open" : "bar"}></span>
            <span className={menuOpen ? "bar open" : "bar"}></span>
            <span className={menuOpen ? "bar open" : "bar"}></span>
          </button>

          {/* Nav Links - Conditional class for mobile */}
          <div className={`nav-links ${menuOpen ? "active" : ""}`}>
            <Link to="/" className="nav-item" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/users" className="nav-item" onClick={() => setMenuOpen(false)}>Users</Link>
          </div>
        </div>
      </nav>

      <main className="content-area">
        <Routes>
          // Change this line in your Routes block:
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
        </Routes>
      </main>
    </div>
  );

}

export default App;