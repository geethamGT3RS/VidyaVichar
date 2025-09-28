import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ResetPassword.css';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};
  
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    fetch('/api/resetpassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        otp: otp,
        newPassword: newPassword
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
      toast.success('Password reset successfully! 🎉');
      setTimeout(() => {
        navigate('/');
      }, 2000);
      setLoading(false);
    })
    .catch(error => {
      if (error.error) {
        toast.error(error.error);
      } else {
        toast.error('Something went wrong');
      }
      setLoading(false);
    });
  };

  const goToLogin = () => {
    navigate('/');
  };

  return (
    <div className="reset-bg">
      <div className="reset-container">
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
        
        <div className="reset-header">
          <h2 className="reset-title">Reset Password</h2>
          <p className="reset-subtitle">Enter the code sent to your email and new password</p>
        </div>

        <form className="reset-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" value={email || ""} readOnly className="email-display" />
          </div>
          
          <div className="form-group">
            <input 
              type="text" 
              placeholder="Enter 6-digit reset code" 
              maxLength="6"
              className="form-input" 
              value={otp} 
              onChange={(e) => setOtp(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group">
            <input 
              type="password" 
              placeholder="Enter new password" 
              className="form-input" 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              required 
            />
          </div>

          <button type="submit" className="update-btn" disabled={loading}>
            {loading ? 'Updating...' : 'Update Password'}
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

export default ResetPassword;
