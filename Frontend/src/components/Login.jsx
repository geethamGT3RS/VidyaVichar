import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    fetch('http://localhost:8000/api/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return response.json().then(err => Promise.reject(err));
      }
    })
    .then(data => {
      if (data.token && data.user) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userEmail', data.user.email);
        localStorage.setItem('userRole', data.user.role);
        localStorage.setItem('userName', data.user.name);
        
        toast.success('Login successful! 🎉');
        
        // Role-based redirect using the role from backend response
        setTimeout(() => {
          if (data.user.role === 'student') {
            navigate('/welcomestudent');
          } else if (data.user.role === 'instructor') {
            navigate('/welcomeinstructor');
          } else if (data.user.role === 'ta') {
            navigate('/welcometa');
          } else {
            navigate('/welcome'); // fallback
          }
        }, 2000);
      }
      setLoading(false);
    })
    .catch(error => {
      console.log('Error details:', error);
      
      if (error.error) {
        toast.error(error.error);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('Login failed. Please check your credentials and try again.');
      }
      setLoading(false);
    });
  };

  const goToSignup = () => {
    navigate('/createuser');
  };

  const goToForgotPassword = () => {
    navigate('/forgetpasswordotp');
  };

  return (
    <div className="login-bg">
      <div className="login-container">
        <div className="logo-section">
          <div className="logo-icon">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="logo-title">VidyaVichara</h1>
        </div>
        
        <p className="login-tagline">A clean live Q&A board for lectures</p>
        
        <div className="login-header">
          <h2 className="login-title">Welcome Back</h2>
          <p className="login-subtitle">Sign in to your account</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input 
              type="email" 
              placeholder="Email" 
              className="form-input" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group">
            <input 
              type="password" 
              placeholder="Password" 
              className="form-input" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <div className="forgot-password-section">
            <button type="button" className="forgot-password-btn" onClick={goToForgotPassword}>
              Forgot Password?
            </button>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

          <div className="signup-section">
            <p className="signup-text">Don't have an account?</p>
            <button type="button" className="signup-btn" onClick={goToSignup}>
              Create Account
            </button>
          </div>
        </form>

        <ToastContainer />
      </div>
    </div>
  );
};

export default Login;
