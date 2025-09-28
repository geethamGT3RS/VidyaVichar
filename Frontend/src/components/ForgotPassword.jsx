import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    fetch('/api/forgetpasswordotp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email })
    })
    .then(response => response.json())
    .then(data => {
      if (data.message) {
        toast.success('Reset code sent to your email! 📧');
        setTimeout(() => {
          navigate('/resetpassword', { state: { email } });
        }, 2000);
      } else if (data.error) {
        toast.error(data.error);
      }
      setLoading(false);
    })
    .catch(error => {
      toast.error('Unable to connect to server');
      setLoading(false);
    });
  };

  const goToLogin = () => {
    navigate('/');
  };

  return (
    <div className="forgot-bg">
      <div className="forgot-container">
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
        
        <div className="forgot-header">
          <h2 className="forgot-title">Forgot Password</h2>
          <p className="forgot-subtitle">Enter your email to reset your password</p>
        </div>

        <form className="forgot-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="form-input" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <button type="submit" className="reset-btn" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Code'}
          </button>

          <div className="back-section">
            <p className="back-text">Remember your password?</p>
            <button type="button" className="back-btn" onClick={goToLogin}>
              Back to Login
            </button>
          </div>
        </form>

        <ToastContainer />
      </div>
    </div>
  );
};

export default ForgotPassword;
