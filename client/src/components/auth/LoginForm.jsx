import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { loginUser } from '../../redux/thunks/authThunks'
import { saveSession } from '../../config/session'
import '../../styles/AuthForms.css'

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Add form state
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Get auth state from Redux
  const {isLoading, error, isAuthenticated, user} = useSelector(state => state.auth);

  // Redirect if already authenticated
  useEffect(() => {
    console.log('🔑 LoginForm useEffect: Auth state changed:', { isAuthenticated, user });
    if (isAuthenticated && user) {
      console.log('🔑 LoginForm: Redirecting to dashboard...');
      navigate('/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('🔑 LoginForm: Attempting login...')
    const result = await dispatch(loginUser(formData));

    if(loginUser.fulfilled.match(result)) {
        console.log('🔑 LoginForm: Login successful:', result.payload)
        // Save session data
        if (result.payload.user && result.payload.token) {
          console.log('🔑 LoginForm: Saving session...')
          saveSession(result.payload.user, result.payload.token)
        }
    } else {
        console.error('🔑 LoginForm: Login failed:', result.error)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <p className="auth-subtitle">Sign in to your DevTrack account</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Enter your password"
            />
          </div>
          
          <button 
            type="submit" 
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="auth-link">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginForm