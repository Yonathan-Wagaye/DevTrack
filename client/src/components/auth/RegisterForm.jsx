import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { registerUser } from '../../redux/thunks/authThunks'
import useSession from '../../hooks/useSession'
import '../../styles/AuthForms.css'

const RegisterForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { saveSession } = useSession()
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  // Get auth state from Redux
  const { isLoading, error, showEmailVerification } = useSelector(state => state.auth)

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      // We'll handle this validation in Redux, but for now show immediate feedback
      console.error('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      console.error('Password must be at least 6 characters long')
      return
    }

    try {
      // Dispatch the registration action
      const result = await dispatch(registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password
      }))

      if (registerUser.fulfilled.match(result)) {
        console.log('Registration successful:', result.payload)
        // Clear form data after successful registration
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: ''
        })
        // Don't redirect - let the user see the email verification message
        // They can click the link to go to login when ready
      }
    } catch (error) {
      console.error('Registration error:', error)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>
        <p className="auth-subtitle">Join DevTrack and start tracking your productivity</p>
        
        {error && <div className="error-message">{error}</div>}
        
        {showEmailVerification && (
          <div className="success-message">
            <h3>🎉 Registration Successful!</h3>
            <p>Please check your email and click the verification link to activate your account.</p>
            <p>After verifying your email, you can <Link to="/login" className="auth-link">login here</Link>.</p>
          </div>
        )}
        
        {!showEmailVerification && (
          <>
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="Enter your full name"
                />
              </div>
              
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
                  placeholder="Create a password"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="Confirm your password"
                />
              </div>
              
              <button 
                type="submit" 
                className="auth-button"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
            
            <div className="auth-footer">
              <p>
                Already have an account?{' '}
                <Link to="/login" className="auth-link">
                  Sign in here
                </Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default RegisterForm