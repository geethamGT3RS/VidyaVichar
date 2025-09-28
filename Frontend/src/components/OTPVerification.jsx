import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './OTPVerification.css';

const OTPVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email } = location.state || {};
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('/api/verifyotp', {
        email: email,
        otp: otp
      });
      toast.success('Account verified successfully! 🎉', {
        position: "top-right",
        autoClose: 2000,
      });
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      let errorMessage = 'Something went wrong. Please try again.';
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error;
      }
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendLoading(true);
    try {
      const response = await axios.post('/api/getotp', {
        email: email
      });
      toast.success('New OTP sent to your email! 📧', {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      let errorMessage = 'Failed to resend OTP. Please try again.';
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error;
      }
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 4000,
      });
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="otp-bg">
      <div className="otp-container">
        <div className="logo-section">
          <div className="logo-icon">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="logo-title">VidyaVichara</h1>
        </div>
        <div className="verification-header">
          <h2 className="verification-title">Verify Your Email</h2>
          <p className="verification-text">We've sent a verification code to your email address. Please enter the code below.</p>
        </div>
        <form className="otp-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" value={email || "user@example.com"} readOnly className="email-input" />
          </div>
          <div className="form-group">
            <label className="form-label">Verification Code</label>
            <input type="text" placeholder="Enter 6-digit code" maxLength="6" className="otp-input" value={otp} onChange={(e) => setOtp(e.target.value)} required />
          </div>
          <button type="submit" className="verify-btn" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify Code'}
          </button>
          <div className="resend-section">
            <p className="resend-text">Didn't receive the code?</p>
            <button type="button" className="resend-btn" onClick={handleResendCode} disabled={resendLoading}>
              {resendLoading ? 'Sending...' : 'Resend Code'}
            </button>
          </div>
        </form>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
      </div>
    </div>
  );
};

export default OTPVerification;
