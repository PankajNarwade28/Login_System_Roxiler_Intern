import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import './UpdatePassword.css';

const UpdatePassword = () => {
  const navigate = useNavigate();
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));

      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/update-password`,
        { 
          oldPassword: passwords.oldPassword, 
          newPassword: passwords.newPassword 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Password updated successfully!");
      setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });

      // Role-based redirection
      if (user?.role === "System Administrator") navigate("/admin-dashboard");
      else if (user?.role === "Store Owner") navigate("/owner-dashboard");
      else navigate("/"); 

    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update password.');
      setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="update-password-container">
      <div className="update-card">
        <h2>Change Security Credentials</h2>
        <form onSubmit={handleSubmit} className="update-form">
          
          {/* Current Password */}
          <div className="form-group">
            <label>Current Password</label>
            <div className="password-wrapper">
              <input 
                type={showOld ? "text" : "password"} 
                name="oldPassword" 
                value={passwords.oldPassword} 
                onChange={handleChange} 
                required 
              />
              <button type="button" onClick={() => setShowOld(!showOld)}>
                {showOld ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="form-group">
            <label>New Password</label>
            <div className="password-wrapper">
              <input 
                type={showNew ? "text" : "password"} 
                name="newPassword" 
                placeholder="8-16 chars, Uppercase, Special"
                value={passwords.newPassword} 
                onChange={handleChange} 
                required 
              />
              <button type="button" onClick={() => setShowNew(!showNew)}>
                {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div className="form-group">
            <label>Confirm New Password</label>
            <div className="password-wrapper">
              <input 
                type={showConfirm ? "text" : "password"} 
                name="confirmPassword" 
                value={passwords.confirmPassword} 
                onChange={handleChange} 
                required 
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)}>
                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button type="submit" className="update-btn" disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;