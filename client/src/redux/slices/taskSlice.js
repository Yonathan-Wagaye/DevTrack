import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  // Task list
  tasks: [],
  isLoading: false,
  error: null,
  
  // Form state
  formData: {
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    project: '', // Will be set when projects are loaded
    dueDate: '',
    timeEstimate: ''
  },
  
  // Form UI state
  isFormLoading: false,
  formError: null,
  
  // Projects are now fetched from the project slice
  
  // Priority options
  priorities: [
    { value: 'high', label: 'High', color: '#ff6b6b' },
    { value: 'medium', label: 'Medium', color: '#ffb366' },
    { value: 'low', label: 'Low', color: '#4ade80' }
  ],
  
  // Status options
  statuses: [
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' }
  ]
}

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    // Form actions
    updateFormField: (state, action) => {
      const { field, value } = action.payload
      state.formData[field] = value
    },
    
    resetForm: (state) => {
      state.formData = initialState.formData
      state.formError = null
    },
    
    setFormLoading: (state, action) => {
      state.isFormLoading = action.payload
    },
    
    setFormError: (state, action) => {
      state.formError = action.payload
    },
    
    clearFormError: (state) => {
      state.formError = null
    },
    
    // Task list actions
    setTasks: (state, action) => {
      state.tasks = action.payload
    },
    
    addTask: (state, action) => {
      state.tasks.push(action.payload)
    },
    
    updateTask: (state, action) => {
      const { id, updates } = action.payload
      const taskIndex = state.tasks.findIndex(task => task.id === id)
      if (taskIndex !== -1) {
        state.tasks[taskIndex] = { ...state.tasks[taskIndex], ...updates }
      }
    },
    
    deleteTask: (state, action) => {
      const taskId = action.payload
      state.tasks = state.tasks.filter(task => task.id !== taskId)
    },
    
    toggleTaskStatus: (state, action) => {
      const taskId = action.payload
      const task = state.tasks.find(task => task.id === taskId)
      if (task) {
        task.status = task.status === 'completed' ? 'pending' : 'completed'
      }
    },
    
    // Loading and error states
    setLoading: (state, action) => {
      state.isLoading = action.payload
    },
    
    setError: (state, action) => {
      state.error = action.payload
    },
    
    clearError: (state) => {
      state.error = null
    }
  },
  
  extraReducers: (builder) => {
    // Handle async thunk states
    builder
      // Create task
      .addCase('tasks/createTask/pending', (state) => {
        state.isFormLoading = true
        state.formError = null
      })
      .addCase('tasks/createTask/fulfilled', (state, action) => {
        state.isFormLoading = false
        state.tasks.push(action.payload)
        state.formData = initialState.formData // Reset form
      })
      .addCase('tasks/createTask/rejected', (state, action) => {
        state.isFormLoading = false
        state.formError = action.payload
      })
      
      // Fetch tasks
      .addCase('tasks/fetchTasks/pending', (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase('tasks/fetchTasks/fulfilled', (state, action) => {
        state.isLoading = false
        state.tasks = action.payload
      })
      .addCase('tasks/fetchTasks/rejected', (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Update task
      .addCase('tasks/updateTask/pending', (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase('tasks/updateTask/fulfilled', (state, action) => {
        state.isLoading = false
        const { id, updates } = action.payload
        const taskIndex = state.tasks.findIndex(task => task.id === id)
        if (taskIndex !== -1) {
          state.tasks[taskIndex] = { ...state.tasks[taskIndex], ...updates }
        }
      })
      .addCase('tasks/updateTask/rejected', (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Delete task
      .addCase('tasks/deleteTask/pending', (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase('tasks/deleteTask/fulfilled', (state, action) => {
        state.isLoading = false
        const taskId = action.payload
        state.tasks = state.tasks.filter(task => task.id !== taskId)
      })
      .addCase('tasks/deleteTask/rejected', (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  }
})

export const {
  updateFormField,
  resetForm,
  setFormLoading,
  setFormError,
  clearFormError,
  setTasks,
  addTask,
  updateTask,
  deleteTask,
  toggleTaskStatus,
  setLoading,
  setError,
  clearError
} = taskSlice.actions

export default taskSlice.reducer
