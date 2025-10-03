import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import "./UserAuth.css";

const UserAuth = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const createUserResponse = await axios.post('/api/createuser', {  // Changed from /api/ to /api/createuser
        name: name,
        email: email,
        password: password,
        role: role
      });
      const otpResponse = await axios.post('/api/getotp', {
        email: email
      });
      toast.success('Account created! OTP sent to your email 📧', {
        position: "top-right",
        autoClose: 2000,
      });
      setTimeout(() => {
        navigate('/getotp', { 
          state: { email, name, password, role } 
        });
      }, 2000);
    } catch (error) {
      let errorMessage = 'Something went wrong. Please try again.';
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        if (status === 400 && data && data.error) {
          errorMessage = data.error;
        }
        else if (status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        }
        else if (data && data.error) {
          errorMessage = data.error;
        }
      }
      else if (error.request) {
        errorMessage = 'Unable to connect to server. Check your connection.';
      }
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 4000,
      });
      console.log('Error details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignInClick = () => {
    navigate('/');
  };

  return (
    <div className="auth-bg">
      <div className="auth-container">
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
        <p className="tagline">A clean live Q&A board for lectures — post, upvote, and triage questions without interrupting class.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input type="text" placeholder="Full Name" className="form-input" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <input type="email" placeholder="Email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <input type="password" placeholder="Password" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="form-group dropdown-group">
            <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)} required>
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
              <option value="ta">TA</option>
            </select>
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
          <div className="login-section">
            <p className="login-text">Already have an account?</p>
            <button type="button" className="login-link" onClick={handleSignInClick}>Sign in here</button>
          </div>
        </form>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
      </div>
    </div>
  );
};

export default UserAuth;
