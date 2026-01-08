import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminDash.css";

const AdminDash = () => {
  const [stats, setStats] = useState({ users: 0, stores: 0, ratings: 0 });
  // Changed default view to 'users' so data loads on mount
  const [view, setView] = useState("users");
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Inside AdminDash.jsx - Modal or Form section
const [newStore, setNewStore] = useState({ name: '', address: '', ownerId: '' });
const [owners, setOwners] = useState([]); // To populate the dropdown

// Fetch users with 'Store Owner' role to populate the dropdown
useEffect(() => {
  const fetchOwners = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    // Filter only those who are Store Owners
    setOwners(res.data.filter(u => u.role === 'Store Owner'));
  };
  if (view === 'stores') fetchOwners();
}, [view]);

const handleCreateStore = async (e) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem('token');
    await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/admin/stores`, newStore, {
      headers: { Authorization: `Bearer ${token}` }
    });
    alert("Store Created Successfully!");
    setNewStore({ name: '', address: '', ownerId: '' });
  } catch (err) {
    alert("Error creating store: " + err.response?.data?.message);
  }
};

  // Fetch Stats (Total Users, Stores, Ratings)
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/admin/stats`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching stats", error);
      }
    };
    fetchStats();
  }, []);

  // Fetch Detailed Lists (Triggered on mount because view starts as 'users')
  // inside your fetchData useEffect
useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    setDataList([]); // CLEAR previous data immediately to avoid render conflicts
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
  fetchData();
}, [view]);

  return (
    <div className="admin-dash-container">
      <header className="dash-header">
        <h1>System Administrator Dashboard</h1>
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

      {/* Navigation Tabs */}
      <div className="dash-nav">
        <button
          className={view === "users" ? "active" : ""}
          onClick={() => setView("users")}
        >
          Manage Users
        </button>
        <button
          className={view === "stores" ? "active" : ""}
          onClick={() => setView("stores")}
        >
          Manage Stores
        </button>
      </div>

      <main className="dash-content">
        {loading ? (
          <div className="loader-container">
            <p className="loader">Fetching latest information...</p>
          </div>
        ) : (
          <div className="table-container">
            {view === "users" ? (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Address</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {dataList.map((user) => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.address}</td>
                      {/* Replace your old role-badge td with this safe version */}
                      <td>
                        <span
                          className={`role-badge ${(
                            user.role || "Normal-User"
                          ).replace(/\s+/g, "-")}`}
                        >
                          {user.role || "Normal User"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Store Name</th>
                    <th>Owner Email</th>
                    <th>Address</th>
                    <th>Avg Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {dataList.map((store) => (
                    <tr key={store.id}>
                      <td>{store.name}</td>
                      <td>{store.owner_email || "N/A"}</td>
                      <td>{store.address}</td>
                      <td>
                        {parseFloat(store.overallRating || 0).toFixed(1)} ⭐
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDash;
