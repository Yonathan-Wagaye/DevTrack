import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { logoutUser } from '../redux/thunks/authThunks'
import { clearSession } from '../config/session'
import { DevTrackLogo } from './icons/Icons'
import '../styles/Navbar.css'

const Navbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  
  // Get auth state from Redux instead of props
  const { isAuthenticated, user } = useSelector(state => state.auth)
  
  console.log('🧭 Navbar Debug:', { isAuthenticated, user, currentPath: location.pathname })
  
  // Helper function to determine if a nav link is active
  const isActiveRoute = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard'
    }
    if (path === '/tasks') {
      return location.pathname === '/tasks' || location.pathname.startsWith('/tasks/')
    }
    if (path === '/projects') {
      return location.pathname === '/projects' || location.pathname.startsWith('/projects/')
    }
    if (path === '/commits') {
      return location.pathname === '/commits' || location.pathname.startsWith('/commits/')
    }
    return false
  }
  
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Left Side - Brand Name */}
        <div className="navbar-brand" onClick={() => navigate(isAuthenticated ? '/dashboard' : '/')}>
          <DevTrackLogo size={22} />
          <span>DevTrack</span>
        </div>

        {/* Center - Navigation Links (only show if authenticated) */}
        {isAuthenticated && user && (
          <div className="navbar-nav">
            <button 
              onClick={() => navigate('/dashboard')} 
              className={`nav-link ${isActiveRoute('/dashboard') ? 'active' : ''}`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => navigate('/tasks')} 
              className={`nav-link ${isActiveRoute('/tasks') ? 'active' : ''}`}
            >
              Tasks
            </button>
            <button 
              onClick={() => navigate('/projects')} 
              className={`nav-link ${isActiveRoute('/projects') ? 'active' : ''}`}
            >
              Projects
            </button>
            <button 
              onClick={() => navigate('/commits')} 
              className={`nav-link ${isActiveRoute('/commits') ? 'active' : ''}`}
            >
              Commits
            </button>
          </div>
        )}

        {/* Right Side - Conditional rendering based on auth status */}
        <div className="navbar-right">
          {isAuthenticated && user ? (
            // Logged in user - show user menu and logout
            <>
              <span className="user-email">{user.email}</span>
              <button 
                className="logout-btn"
                onClick={async () => {
                  console.log('🚪 Logging out...')
                  clearSession()
                  await dispatch(logoutUser())
                  navigate('/')
                }}
              >
                Logout
              </button>
            </>
          ) : (
            // Non-logged in user - show login and get started
            <>
              <button onClick={() => navigate('/login')} className="login-link">Login</button>
              <button onClick={() => navigate('/register')} className="start-button">Get Started</button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
