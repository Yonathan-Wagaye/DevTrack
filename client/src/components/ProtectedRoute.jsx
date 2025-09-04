import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const ProtectedRoute = ({ children, redirectIfAuthenticated }) => {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useSelector(state => state.auth)

  console.log('🛡️ ProtectedRoute Debug:', { isAuthenticated, user, redirectIfAuthenticated })

  useEffect(() => {
    if (redirectIfAuthenticated && isAuthenticated && user) {
      // For auth pages, redirect authenticated users to dashboard
      console.log('🛡️ ProtectedRoute: User already authenticated, redirecting to:', redirectIfAuthenticated)
      navigate(redirectIfAuthenticated)
    } else if (!redirectIfAuthenticated && (!isAuthenticated || !user)) {
      // For protected pages, redirect unauthenticated users to login
      console.log('🛡️ ProtectedRoute: User not authenticated, redirecting to login')
      navigate('/login')
    }
  }, [isAuthenticated, user, navigate, redirectIfAuthenticated])

  // Show loading while checking authentication
  if (!isAuthenticated || !user) {
    if (redirectIfAuthenticated) {
      // For auth pages, show the form while checking
      return children
    } else {
      // For protected pages, show loading
      return (
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <p>Checking authentication...</p>
        </div>
      )
    }
  }

  // User is authenticated
  if (redirectIfAuthenticated) {
    // For auth pages, redirect authenticated users
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Redirecting...</p>
      </div>
    )
  } else {
    // For protected pages, render the content
    console.log('🛡️ ProtectedRoute: User authenticated, rendering protected content')
    return children
  }
}

export default ProtectedRoute
