import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserDash.css';

const UserDash = () => {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState({ name: '', address: '' });
  const [loading, setLoading] = useState(false);

  // Requirement: Can view all registered stores and search by Name/Address
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
      console.error("Error fetching stores", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleRatingSubmit = async (storeId, rating) => {
    // Logic to submit or modify rating (1 to 5)
    console.log(`Submitting ${rating} stars for store ${storeId}`);
  };

  return (
    <div className="user-dash-container">
      <header className="user-header">
        <h1>Explore Stores</h1>
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search by Name..." 
            onChange={(e) => setSearch({...search, name: e.target.value})}
          />
          <input 
            type="text" 
            placeholder="Search by Address..." 
            onChange={(e) => setSearch({...search, address: e.target.value})}
          />
          <button onClick={fetchStores}>Search</button>
        </div>
      </header>

      <div className="store-grid">
        {stores.map(store => (
          <div key={store.id} className="store-card">
            <div className="store-info">
              <h3>{store.name}</h3>
              <p className="store-address">{store.address}</p>
              <div className="rating-badge">Overall: {store.overallRating || 'N/A'} ⭐</div>
            </div>

            <div className="user-rating-section">
              <p>Your Rating: <strong>{store.userRating || 'Not rated'}</strong></p>
              <div className="star-inputs">
                {[1, 2, 3, 4, 5].map(star => (
                  <button 
                    key={star} 
                    onClick={() => handleRatingSubmit(store.id, star)}
                    className={store.userRating >= star ? 'star active' : 'star'}
                  >
                    ★
                  </button>
                ))}
              </div>
              <button className="modify-btn">
                {store.userRating ? 'Modify Rating' : 'Submit Rating'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDash;