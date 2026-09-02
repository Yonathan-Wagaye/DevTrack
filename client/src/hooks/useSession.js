import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setCredentials, logout, setSessionLoading } from '../redux/slices/authSlice'
import { API_BASE_URL } from '../config/api'
import { clearSession, getStoredToken } from '../config/session'

const useSession = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const checkSession = async () => {
      dispatch(setSessionLoading(true))

      try {
        const token = getStoredToken()

        if (!token) {
          dispatch(logout())
          return
        }

        const response = await fetch(`${API_BASE_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        if (!response.ok) {
          throw new Error('Invalid session')
        }

        const user = await response.json()
        dispatch(setCredentials({ user, token }))
      } catch {
        clearSession()
        dispatch(logout())
      } finally {
        dispatch(setSessionLoading(false))
      }
    }

    checkSession()
  }, [dispatch])
}

export default useSession
