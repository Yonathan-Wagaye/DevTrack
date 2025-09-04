import { createSlice } from '@reduxjs/toolkit'
import {
  createProject,
  fetchProjects,
  fetchProject,
  updateProject,
  deleteProject
} from '../thunks/projectThunks'

const initialState = {
  projects: [],
  currentProject: null,
  isLoading: false,
  error: null,
  formData: {
    name: '',
    description: '',
    color: '#3498db',
    github_repo_url: ''
  },
  isFormLoading: false,
  formError: null
}

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    // Form management
    updateFormField: (state, action) => {
      const { field, value } = action.payload
      state.formData[field] = value
    },
    resetForm: (state) => {
      state.formData = {
        name: '',
        description: '',
        color: '#3498db'
      }
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

    // Project management
    setProjects: (state, action) => {
      state.projects = action.payload
    },
    addProject: (state, action) => {
      state.projects.unshift(action.payload)
    },
    updateProjectInList: (state, action) => {
      const index = state.projects.findIndex(p => p.id === action.payload.id)
      if (index !== -1) {
        state.projects[index] = action.payload
      }
    },
    removeProject: (state, action) => {
      state.projects = state.projects.filter(p => p.id !== action.payload)
    },
    setCurrentProject: (state, action) => {
      state.currentProject = action.payload
    },
    clearCurrentProject: (state) => {
      state.currentProject = null
    },

    // UI state management
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
    // Create Project
    builder
      .addCase(createProject.pending, (state) => {
        state.isFormLoading = true
        state.formError = null
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.isFormLoading = false
        state.projects.unshift(action.payload)
        state.formData = { name: '', description: '', color: '#3498db' }
      })
      .addCase(createProject.rejected, (state, action) => {
        state.isFormLoading = false
        state.formError = action.error.message
      })

    // Fetch Projects
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.isLoading = false
        state.projects = action.payload
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message
      })

    // Fetch Single Project
    builder
      .addCase(fetchProject.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchProject.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentProject = action.payload
      })
      .addCase(fetchProject.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message
      })

    // Update Project
    builder
      .addCase(updateProject.pending, (state) => {
        state.isFormLoading = true
        state.formError = null
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.isFormLoading = false
        const index = state.projects.findIndex(p => p.id === action.payload.id)
        if (index !== -1) {
          state.projects[index] = action.payload
        }
        if (state.currentProject && state.currentProject.id === action.payload.id) {
          state.currentProject = { ...state.currentProject, ...action.payload }
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.isFormLoading = false
        state.formError = action.error.message
      })

    // Delete Project
    builder
      .addCase(deleteProject.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.isLoading = false
        state.projects = state.projects.filter(p => p.id !== action.meta.arg)
        if (state.currentProject && state.currentProject.id === action.meta.arg) {
          state.currentProject = null
        }
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message
      })
  }
})

export const {
  updateFormField,
  resetForm,
  setFormLoading,
  setFormError,
  clearFormError,
  setProjects,
  addProject,
  updateProjectInList,
  removeProject,
  setCurrentProject,
  clearCurrentProject,
  setLoading,
  setError,
  clearError
} = projectSlice.actions

export default projectSlice.reducer
