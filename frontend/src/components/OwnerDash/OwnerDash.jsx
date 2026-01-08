import React, { useState, useEffect } from "react";
import axios from "axios";
import "./OwnerDash.css";

const OwnerDash = () => {
  const [storeData, setStoreData] = useState({
    name: "",
    averageRating: 0,
    ratingsCount: 0,
    feedbacks: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOwnerData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/owner/my-store`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setStoreData(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Server Error: Could not fetch store data"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchOwnerData();
  }, []);

  if (loading) return <div className="loader">Loading Dashboard...</div>;
  if (error) return <div className="error-container">{error}</div>;

  return (
    <div className="owner-dash-container">
      <header className="owner-header">
        <h1>Store Performance: {storeData.name}</h1>
        <p>Manage your reputation and view customer feedback.</p>
      </header>

      {/* Average Rating Display */}
      <section className="rating-overview">
        <div className="rating-card">
          <h3>Average Rating</h3>
          <div className="big-rating">
            {Number(storeData.averageRating).toFixed(1)} <span>/ 5.0</span>
          </div>
          <p>Based on {storeData.ratingsCount} customer reviews</p>
        </div>
      </section>

      {/* User Feedback List */}
      <section className="feedback-section">
        <h2>Customer Ratings</h2>
        <div className="feedback-list">
          {storeData.feedbacks.length > 0 ? (
            <table className="feedback-table">
              <thead>
                <tr>
                  <th>User Name</th>
                  <th>Rating</th> 
                </tr>
              </thead>
              {/* Inside the feedback-table mapping */}
              <tbody>
                {storeData.feedbacks.map((fb, index) => (
                  <tr key={index}>
                    <td>{fb.userName}</td>
                    <td>
                      <span className="star-display">
                        {"★".repeat(fb.rating)}
                      </span>
                      <span className="rating-num">({fb.rating})</span>
                    </td>
                    {/* Date <td> removed here */}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-feedback">
              No ratings submitted yet for your store.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default OwnerDash;
