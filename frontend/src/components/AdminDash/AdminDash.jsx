import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDash.css';

const AdminDash = () => {
  const [stats, setStats] = useState({ users: 0, stores: 0, ratings: 0 });
  const [view, setView] = useState('overview'); // overview, users, stores

  // Requirement: Dashboard must display total users, stores, and ratings
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching stats", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="admin-dash-container">
      <header className="dash-header">
        <h1>System Administrator Dashboard</h1>
        <div className="dash-actions">
          <button className="add-btn">+ Add New User/Store</button>
        </div>
      </header>

      {/* Stats Cards Section */}
      <section className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p className="stat-number">{stats.users}</p>
        </div>
        <div className="stat-card">
          <h3>Total Stores</h3>
          <p className="stat-number">{stats.stores}</p>
        </div>
        <div className="stat-card">
          <h3>Total Ratings</h3>
          <p className="stat-number">{stats.ratings}</p>
        </div>
      </section>

      {/* Navigation for Listings */}
      <div className="dash-nav">
        <button 
          className={view === 'users' ? 'active' : ''} 
          onClick={() => setView('users')}
        >
          Manage Users
        </button>
        <button 
          className={view === 'stores' ? 'active' : ''} 
          onClick={() => setView('stores')}
        >
          Manage Stores
        </button>
      </div>

      <main className="dash-content">
        {view === 'overview' && (
          <div className="placeholder-view">
            <p>Select a category above to view and filter listings.</p>
          </div>
        )}

        {/* This is where your UserLists component or StoreLists would be injected */}
        {view === 'users' && <div className="list-wrapper"><h3>User Listings (Name, Email, Address, Role)</h3></div>}
        {view === 'stores' && <div className="list-wrapper"><h3>Store Listings (Name, Email, Address, Rating)</h3></div>}
      </main>
    </div>
  );
};

export default AdminDash;