import { createAsyncThunk } from '@reduxjs/toolkit'
import { API_BASE_URL } from '../../config/api'

const getAuthToken = () => {
  const token = localStorage.getItem('devtrack_token')
  console.log('🔑 dashboardThunks: Getting token from localStorage:', token ? 'Token exists' : 'No token found')
  return token
}

// Fetch dashboard statistics
export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken()
      if (!token) {
        throw new Error('No authentication token found')
      }

      console.log('📊 DashboardThunks: Fetching dashboard stats...')
      
      const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to fetch dashboard stats')
      }

      const stats = await response.json()
      console.log('✅ DashboardThunks: Dashboard stats fetched successfully:', stats)
      return stats

    } catch (error) {
      console.error('📊 DashboardThunks: Error fetching dashboard stats:', error)
      return rejectWithValue(error.message)
    }
  }
)
