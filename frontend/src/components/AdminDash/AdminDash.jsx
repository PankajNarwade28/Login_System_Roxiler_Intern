import React, { useState, useEffect } from "react";
import axios from "axios"; 
import "./AdminDash.css";
import AdminForms from "./Form";

const AdminDash = () => {
  const [stats, setStats] = useState({ users: 0, stores: 0, ratings: 0 });
  const [view, setView] = useState("users");
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false); // State to toggle form view

  // Fetch Stats (Total Users, Stores, Ratings)
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats", error);
    }
  };

  // Fetch Detailed Lists
  const fetchData = async () => {
    setLoading(true);
    setDataList([]);
    try {
      const token = localStorage.getItem('token');
      const endpoint = view === 'users' ? '/api/admin/users' : '/api/admin/stores';
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDataList(response.data || []);
    } catch (error) {
      console.error(`Error fetching ${view}`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);
  useEffect(() => { if(!showForm) fetchData(); }, [view, showForm]);

  return (
    <div className="admin-dash-container">
      <header className="dash-header">
        <h1>System Administrator Dashboard</h1>
        <button 
          className="add-new-btn" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "← Back to Dashboard" : "+ Add New User/Store"}
        </button>
      </header>

      {showForm ? (
        /* Render the Forms Component */
        <AdminForms onActionSuccess={() => {
          setShowForm(false);
          fetchStats();
        }} />
      ) : (
        <>
          {/* Stats Cards Section */}
          <section className="stats-grid">
            <div className="stat-card"><h3>Total Users</h3><p className="stat-number">{stats.users}</p></div>
            <div className="stat-card"><h3>Total Stores</h3><p className="stat-number">{stats.stores}</p></div>
            <div className="stat-card"><h3>Total Ratings</h3><p className="stat-number">{stats.ratings}</p></div>
          </section>

          {/* Navigation Tabs */}
          <div className="dash-nav">
            <button className={view === "users" ? "active" : ""} onClick={() => setView("users")}>Manage Users</button>
            <button className={view === "stores" ? "active" : ""} onClick={() => setView("stores")}>Manage Stores</button>
          </div>

          <main className="dash-content">
            {loading ? (
              <div className="loader-container"><p className="loader">Fetching latest information...</p></div>
            ) : (
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    {view === "users" ? (
                      <tr><th>Name</th><th>Email</th><th>Address</th><th>Role</th></tr>
                    ) : (
                      <tr><th>Store Name</th><th>Owner Email</th><th>Address</th><th>Avg Rating</th></tr>
                    )}
                  </thead>
                  <tbody>
                    {view === "users" ? (
                      dataList.map((user) => (
                        <tr key={user.id}>
                          <td>{user.name}</td>
                          <td>{user.email}</td>
                          <td>{user.address}</td>
                          <td><span className={`role-badge ${(user.role || "Normal-User").replace(/\s+/g, '-')}`}>{user.role || "Normal User"}</span></td>
                        </tr>
                      ))
                    ) : (
                      dataList.map((store) => (
                        <tr key={store.id}>
                          <td>{store.name}</td>
                          <td>{store.owner_email || "N/A"}</td>
                          <td>{store.address}</td>
                          <td>{parseFloat(store.overallRating || 0).toFixed(1)} ⭐</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </main>
        </>
      )}
    </div>
  );
};

export default AdminDash;