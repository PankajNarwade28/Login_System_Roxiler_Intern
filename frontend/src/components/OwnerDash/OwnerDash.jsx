import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OwnerDash.css';

const OwnerDash = () => {
  const [storeData, setStoreData] = useState({
    name: '',
    averageRating: 0,
    ratingsCount: 0,
    feedbacks: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOwnerData = async () => {
      try {
        const token = localStorage.getItem('token');
        // Fetches store stats and list of users who rated the store
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/owner/my-store`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStoreData(response.data);
      } catch (error) {
        console.error("Error fetching store data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOwnerData();
  }, []);

  return (
    <div className="owner-dash-container">
      <header className="owner-header">
        <h1>Store Performance: {storeData.name}</h1>
        <p>Manage your store's reputation and view customer feedback.</p>
      </header>

      {/* Average Rating Display */}
      <section className="rating-overview">
        <div className="rating-card">
          <h3>Average Rating</h3>
          <div className="big-rating">
            {storeData.averageRating.toFixed(1)} <span>/ 5.0</span>
          </div>
          <p>Based on {storeData.ratingsCount} customer reviews</p>
        </div>
      </section>

      {/* User Feedback List */}
      <section className="feedback-section">
        <h2>Customer Ratings</h2>
        <div className="feedback-list">
          {storeData.feedbacks.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>User Name</th>
                  <th>Rating</th>
                  <th>Date Submitted</th>
                </tr>
              </thead>
              <tbody>
                {storeData.feedbacks.map((fb, index) => (
                  <tr key={index}>
                    <td>{fb.userName}</td>
                    <td>
                      <span className="star-display">{"★".repeat(fb.rating)}</span>
                      <span className="rating-num">({fb.rating})</span>
                    </td>
                    <td>{new Date(fb.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-feedback">No ratings submitted yet for your store.</div>
          )}
        </div>
      </section>
    </div>
  );
};

export default OwnerDash;