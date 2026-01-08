import { useState } from 'react';
import axios from 'axios';
import './AuthForm.css';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'Normal User' // Default role for standard signup [cite: 10, 13]
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Centralized submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      await handleLogin();
    } else {
      await handleSignup();
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/login`, {
        email: formData.email,
        password: formData.password
      });

      // Store credentials for the session [cite: 8]
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      alert("Login Successful!");

      // Redirect based on role assigned in the system 
      const role = response.data.user.role;
      if (role === 'System Administrator') {
        window.location.href = '/admin-dashboard';
      } else if (role === 'Store Owner') {
        window.location.href = '/owner-dashboard';
      } else {
        window.location.href = '/users';
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    setLoading(true);
    try {
      // Normal users sign up through this public form [cite: 10, 37]
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/signup`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        address: formData.address,
        role: 'Normal User'
      });

      alert(response.data.message);
      setIsLogin(true); // Switch to login view after registration [cite: 37]
    } catch (error) {
      alert(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" name="name" placeholder="Min 20 characters" 
                  minLength="20" maxLength="60" required 
                  onChange={handleChange} // [cite: 63]
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea 
                  name="address" placeholder="Max 400 characters"
                  maxLength="400" required 
                  onChange={handleChange} // [cite: 64]
                ></textarea>
              </div>
            </>
          )}

          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" name="email" required 
              onChange={handleChange} // [cite: 67]
            /> 
          </div>

          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" name="password" 
              minLength="8" maxLength="16" required 
              placeholder="8-16 chars, Uppercase, Special"
              onChange={handleChange} // [cite: 65, 66]
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Processing..." : (isLogin ? 'Login' : 'Register')}
          </button>
        </form>

        <p className="toggle-text">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <span onClick={() => setIsLogin(!isLogin)} className="toggle-link">
            {isLogin ? ' Sign Up' : ' Login'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;