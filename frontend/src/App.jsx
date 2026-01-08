import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [backendMessage, setBackendMessage] = useState("No response yet");
  const [loading, setLoading] = useState(false);

  // Function to call the backend "Hello" route
  const checkBackend = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/hello`);
      setBackendMessage(response.data.message);
    } catch (error) {
      console.error("Error connecting to backend:", error);
      setBackendMessage("Failed to connect to backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App" style={{ textAlign: 'center', marginTop: '50px' }}>
      {/* Website Title */}
      <h1>Store Rating Platform</h1>
      
      {/* Simple Hello Message */}
      <p>Welcome! This platform allows users to submit ratings for stores[cite: 6].</p>
      
      <div style={{ marginTop: '30px', padding: '20px', border: '1px solid #ccc' }}>
        <h3>Backend Status:</h3>
        <p><strong>{backendMessage}</strong></p>
        
        {/* Button to check backend response */}
        <button onClick={checkBackend} disabled={loading}>
          {loading ? "Checking..." : "Check Backend Response"}
        </button>
      </div>
    </div>
  );
}

export default App;