import { createSlice } from '@reduxjs/toolkit'
import { fetchDashboardStats } from '../thunks/dashboardThunks'

const initialState = {
  stats: {
    projects: {
      total: 0
    },
    tasks: {
      total: 0,
      pending: 0,
      in_progress: 0,
      completed: 0
    },
    recent_projects: [],
    recent_tasks: []
  },
  isLoading: false,
  error: null,
  lastUpdated: null
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearStats: (state) => {
      state.stats = initialState.stats
      state.lastUpdated = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.isLoading = false
        state.stats = action.payload
        state.lastUpdated = new Date().toISOString()
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  }
})

export const { clearError, clearStats } = dashboardSlice.actions
export default dashboardSlice.reducer
