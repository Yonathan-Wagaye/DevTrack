const TOKEN_KEY = 'devtrack_token'
const USER_KEY = 'devtrack_user'

export const getStoredToken = () => localStorage.getItem(TOKEN_KEY)

export const saveSession = (user, token) => {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export const getStoredUser = () => {
  const userData = localStorage.getItem(USER_KEY)
  return userData ? JSON.parse(userData) : null
}
