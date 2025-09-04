import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setCredentials, logout, setSessionLoading } from '../redux/slices/authSlice'
 
const useSession = () => {
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(true)
  const [hasCheckedSession, setHasCheckedSession] = useState(false)

  useEffect(() => {
    // Only check session once on app load
    if (hasCheckedSession) {
      console.log('🔐 useSession: Session already checked, skipping...')
      return
    }
    
    // Check for existing session on app load
    console.log('🔐 useSession: Starting session check...')
    setHasCheckedSession(true)
    dispatch(setSessionLoading(true))
    const checkSession = () => {
      try {
        const token = localStorage.getItem('devtrack_token')
        const userData = localStorage.getItem('devtrack_user')
        
        console.log('🔐 useSession: Found in localStorage:', { hasToken: !!token, hasUserData: !!userData })
        
        if (token && userData) {
          // Verify token is not expired
          const tokenData = JSON.parse(atob(token.split('.')[1]))
          const currentTime = Date.now() / 1000
          
          console.log('🔐 useSession: Token validation:', { tokenExp: tokenData.exp, currentTime, isValid: tokenData.exp > currentTime })
          
          if (tokenData.exp > currentTime) {
            // Token is valid, restore session
            const user = JSON.parse(userData)
            console.log('🔐 useSession: Restoring session for user:', user.email)
            console.log('🔐 useSession: Dispatching setCredentials with:', { user, token })
            dispatch(setCredentials({ user, token }))
          } else {
            // Token expired, clear storage
            console.log('🔐 useSession: Token expired, clearing session')
            localStorage.removeItem('devtrack_token')
            localStorage.removeItem('devtrack_user')
            dispatch(logout())
          }
        } else {
          console.log('🔐 useSession: No session data found, logging out')
          dispatch(logout())
        }
      } catch (error) {
        console.error('🔐 useSession: Session check failed:', error)
        // Clear invalid data
        localStorage.removeItem('devtrack_token')
        localStorage.removeItem('devtrack_user')
        dispatch(logout())
      } finally {
        console.log('🔐 useSession: Session check complete')
        setIsLoading(false)
        dispatch(setSessionLoading(false))
      }
    }

    checkSession()
  }, [dispatch, hasCheckedSession])

  // Save session data
  const saveSession = (user, token) => {
    try {
      console.log('🔐 useSession: Saving session to localStorage:', { user: user.email, hasToken: !!token })
      localStorage.setItem('devtrack_token', token)
      localStorage.setItem('devtrack_user', JSON.stringify(user))
      console.log('🔐 useSession: Session saved successfully')
    } catch (error) {
      console.error('🔐 useSession: Failed to save session:', error)
    }
  }

  // Clear session data
  const clearSession = () => {
    try {
      localStorage.removeItem('devtrack_token')
      localStorage.removeItem('devtrack_user')
    } catch (error) {
      console.error('Failed to clear session:', error)
    }
  }

  return {
    isLoading,
    saveSession,
    clearSession
  }
}

export default useSession
