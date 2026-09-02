import { createAsyncThunk } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import { API_BASE_URL } from '../../config/api'

// Helper function to get auth token
const getAuthToken = () => {
  const token = localStorage.getItem('devtrack_token')
  console.log('🔑 taskThunks: Getting token from localStorage:', token ? 'Token exists' : 'No token found')
  return token
}

// Create task
export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData, { rejectWithValue }) => {
    try {
      const token = getAuthToken()
      
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(taskData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create task')
      }

      const createdTask = await response.json()
      console.log('📝 TaskThunks: Task created successfully:', createdTask)
      return createdTask
      
    } catch (error) {
      console.error('📝 TaskThunks: Error creating task:', error)
      return rejectWithValue(error.message)
    }
  }
)

// Fetch tasks
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken()
      
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to fetch tasks')
      }

      const tasks = await response.json()
      console.log('📝 TaskThunks: Tasks fetched successfully:', tasks)
      return tasks
      
    } catch (error) {
      console.error('📝 TaskThunks: Error fetching tasks:', error)
      return rejectWithValue(error.message)
    }
  }
)

// Update task
export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ taskId, taskData }, { rejectWithValue }) => {
    try {
      const token = getAuthToken()
      
      console.log('📝 TaskThunks: Updating task with data:', { taskId, taskData })
      
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(taskData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update task')
      }

      const updatedTask = await response.json()
      console.log('📝 TaskThunks: Task updated successfully:', updatedTask)
      return { id: taskId, updates: updatedTask }
      
    } catch (error) {
      console.error('📝 TaskThunks: Error updating task:', error)
      return rejectWithValue(error.message)
    }
  }
)

// Delete task
export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (taskId, { rejectWithValue }) => {
    try {
      const token = getAuthToken()
      
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to delete task')
      }

      console.log('📝 TaskThunks: Task deleted successfully:', taskId)
      return taskId
      
    } catch (error) {
      console.error('📝 TaskThunks: Error deleting task:', error)
      return rejectWithValue(error.message)
    }
  }
)

// Toggle task status
export const toggleTaskStatus = createAsyncThunk(
  'tasks/toggleTaskStatus',
  async (taskId, { getState, rejectWithValue }) => {
    try {
      const state = getState()
      const task = state.tasks.tasks.find(t => t.id === taskId)
      
      if (!task) {
        throw new Error('Task not found')
      }

      const newStatus = task.status === 'completed' ? 'pending' : 'completed'
      
      const token = getAuthToken()
      
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to update task status')
      }

      const updatedTask = await response.json()
      console.log('📝 TaskThunks: Task status toggled successfully:', updatedTask)
      return { id: taskId, updates: updatedTask }
      
    } catch (error) {
      console.error('📝 TaskThunks: Error toggling task status:', error)
      return rejectWithValue(error.message)
    }
  }
)
