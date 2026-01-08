import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserDash.css';

const UserDash = () => {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState({ name: '', address: '' });
  const [loading, setLoading] = useState(false);

  const fetchStores = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/stores`, {
        params: { name: search.name, address: search.address },
        headers: { Authorization: `Bearer ${token}` }
      });
      setStores(response.data);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => fetchStores(), 300);
    return () => clearTimeout(delayDebounce);
  }, [search.name, search.address]);

  const handleRatingSubmit = async (storeId, rating) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/stores/rate`, 
        { storeId, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchStores(); // Refresh to update Overall and User rating display
    } catch (error) {
      alert("Error submitting rating");
    }
  };

  return (
    <div className="user-dash-container">
      <header className="user-header">
        <h1>Explore Stores</h1>
        <div className="search-bar">
          <input type="text" placeholder="Search Name..." value={search.name}
            onChange={(e) => setSearch({...search, name: e.target.value})} />
          <input type="text" placeholder="Search Address..." value={search.address}
            onChange={(e) => setSearch({...search, address: e.target.value})} />
        </div>
      </header>

      <div className="store-grid">
        {stores.length > 0 ? (
          stores.map(store => (
            <div key={store.id} className="store-card">
              <div className="store-info">
                <h3>{store.name}</h3>
                <p className="store-address">{store.address}</p>
                <div className="rating-badge">Overall: {store.overallRating} ⭐</div>
              </div>

              <div className="user-rating-section">
                <p>Your Rating: <strong>{store.userRating || 'None'}</strong></p>
                <div className="star-inputs">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button 
                      key={star} 
                      className={store.userRating >= star ? 'star active' : 'star'}
                      onClick={() => handleRatingSubmit(store.id, star)}
                    >★</button>
                  ))}
                </div>
                <span className="modify-hint">
                  {store.userRating ? '(Click stars to modify)' : '(Click stars to submit)'}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="no-data">No stores match your search.</p>
        )}
      </div>
    </div>
  );
};

export default UserDash;