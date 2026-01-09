import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDash.css';

const AdminForms = ({ onActionSuccess }) => {
  const [activeForm, setActiveForm] = useState('user'); 
  const [owners, setOwners] = useState([]);
  const [showPassword, setShowPassword] = useState(false); // Password visibility toggle

  const [userData, setUserData] = useState({ 
    name: '', email: '', password: '', role: 'Normal User', address: '' 
  });
  
  const [storeData, setStoreData] = useState({ name: '', address: '', ownerId: '' });

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOwners(res.data.filter(u => u.role === 'Store Owner'));
      } catch (err) { console.error("Error fetching owners", err); }
    };
    if (activeForm === 'store') fetchOwners();
  }, [activeForm]);

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/admin/add-user`, userData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert("User added successfully!");
      setUserData({ name: '', email: '', password: '', role: 'Normal User', address: '' });
      onActionSuccess();
    } catch (err) {
      alert(err.response?.data?.message || "Error adding user");
    }
  };

  const handleStoreSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/admin/add-store`, storeData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Store added successfully!");
      setStoreData({ name: '', address: '', ownerId: '' });
      onActionSuccess();
    } catch (err) {
      alert(err.response?.data?.message || "Error adding store");
    }
  };

  return (
    <div className="admin-form-wrapper">
      <div className="form-toggle">
        <button onClick={() => setActiveForm('user')} className={activeForm === 'user' ? 'active' : ''}>Add User</button>
        <button onClick={() => setActiveForm('store')} className={activeForm === 'store' ? 'active' : ''}>Add Store</button>
      </div>

      {activeForm === 'user' ? (
        <form onSubmit={handleUserSubmit} className="admin-form">
          <input type="text" placeholder="Full Name" value={userData.name} onChange={e => setUserData({...userData, name: e.target.value})} required />
          <input type="email" placeholder="Email" value={userData.email} onChange={e => setUserData({...userData, email: e.target.value})} required />
          
          <div className="password-input-container" style={{position: 'relative', display: 'flex', alignItems: 'center'}}>
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Password" 
              value={userData.password} 
              onChange={e => setUserData({...userData, password: e.target.value})} 
              style={{width: '100%'}}
              required 
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              style={{position: 'absolute', right: '10px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem'}}
            >
              {showPassword ? "👁️" : "🙈"}
            </button>
          </div>

          <input type="text" placeholder="Address" value={userData.address} onChange={e => setUserData({...userData, address: e.target.value})} required />
          <select value={userData.role} onChange={e => setUserData({...userData, role: e.target.value})}>
            <option value="Normal User">Normal User</option>
            <option value="Store Owner">Store Owner</option>
            <option value="System Administrator">System Administrator</option>
          </select>
          <button type="submit" className="primary-btn">Create User</button>
        </form>
      ) : (
        <form onSubmit={handleStoreSubmit} className="admin-form">
          <input type="text" placeholder="Store Name" value={storeData.name} onChange={e => setStoreData({...storeData, name: e.target.value})} required />
          <input type="text" placeholder="Store Address" value={storeData.address} onChange={e => setStoreData({...storeData, address: e.target.value})} required />
          <select value={storeData.ownerId} onChange={e => setStoreData({...storeData, ownerId: e.target.value})} required>
            <option value="">Select Store Owner</option>
            {owners.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
          </select>
          <button type="submit" className="primary-btn">Create Store</button>
        </form>
      )}
    </div>
  );
};

export default AdminForms;