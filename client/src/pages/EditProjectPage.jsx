import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchProject, updateProject, deleteProject } from '../redux/thunks/projectThunks'
import { updateFormField, resetForm, clearFormError, setFormError } from '../redux/slices/projectSlice'
import LoadingSpinner from '../components/common/LoadingSpinner'
import '../styles/EditProjectPage.css'

const EditProjectPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id: projectId } = useParams()

  const { user } = useSelector(state => state.auth)
  const { 
    currentProject,
    formData, 
    isFormLoading, 
    formError,
    isLoading
  } = useSelector(state => state.projects)

  const predefinedColors = [
    '#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c',
    '#e67e22', '#34495e', '#f1c40f', '#e91e63', '#ff6b35', '#27ae60'
  ]

  // Fetch project data when component mounts
  useEffect(() => {
    if (projectId && !isNaN(projectId)) {
      dispatch(fetchProject(parseInt(projectId)))
    } else {
      navigate('/projects')
    }

    // Cleanup form on unmount
    return () => {
      dispatch(resetForm())
    }
  }, [dispatch, projectId, navigate])

  // Populate form when project data is loaded
  useEffect(() => {
    if (currentProject) {
      dispatch(updateFormField({ field: 'name', value: currentProject.name || '' }))
      dispatch(updateFormField({ field: 'description', value: currentProject.description || '' }))
      dispatch(updateFormField({ field: 'color', value: currentProject.color || '#3498db' }))
      dispatch(updateFormField({ field: 'github_repo_url', value: currentProject.github_repo_url || '' }))
    }
  }, [currentProject, dispatch])

  const handleChange = (e) => {
    const { name, value } = e.target
    dispatch(updateFormField({ field: name, value }))
    
    if (formError) {
      dispatch(clearFormError())
    }
  }

  const handleColorSelect = (color) => {
    dispatch(updateFormField({ field: 'color', value: color }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!user) {
      console.error('No user found')
      return
    }

    if (!formData.name.trim()) {
      dispatch(setFormError('Project name is required'))
      return
    }

    console.log('📝 Updating project:', { projectId, formData })
    
    try {
      const result = await dispatch(updateProject({ 
        projectId: parseInt(projectId), 
        projectData: formData 
      }))
      
      if (updateProject.fulfilled.match(result)) {
        console.log('✅ Project updated successfully')
        navigate('/projects')
      }
    } catch (error) {
      console.error('❌ Error updating project:', error)
    }
  }

  const handleDelete = async () => {
    if (!currentProject) return
    
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${currentProject.name}"?\n\nThis will permanently delete the project and all its tasks. This action cannot be undone.`
    )
    
    if (!confirmDelete) return

    try {
      const result = await dispatch(deleteProject(parseInt(projectId)))
      
      if (deleteProject.fulfilled.match(result)) {
        console.log('✅ Project deleted successfully')
        navigate('/projects')
      }
    } catch (error) {
      console.error('❌ Error deleting project:', error)
    }
  }

  const handleCancel = () => {
    navigate('/projects')
  }

  if (isLoading || !currentProject) {
    return <LoadingSpinner message="Loading project..." />
  }

  return (
    <div className="edit-project-page">
      <div className="page-header">
        <div className="header-content">
          <div className="header-text">
            <h1>Edit Project</h1>
            <p>Update your project details and settings</p>
          </div>

          <div className="header-nav">
            <button
              className="back-button"
              onClick={handleCancel}
            >
              ← Back to Projects
            </button>
          </div>
        </div>
      </div>

      <div className="page-content">
        <div className="edit-project-container">
          <form onSubmit={handleSubmit} className="edit-project-form">
            {formError && (
              <div className="error-message">
                {formError}
              </div>
            )}

            <div className="form-section">
              <h3>Project Information</h3>
              
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Project Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter project name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-textarea"
                  placeholder="Describe your project (optional)"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label htmlFor="github_repo_url" className="form-label">
                  GitHub Repository
                </label>
                <input
                  type="url"
                  id="github_repo_url"
                  name="github_repo_url"
                  value={formData.github_repo_url}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="https://github.com/username/repository (optional)"
                />
                <p className="field-description">
                  Link your project to a GitHub repository to track commits
                </p>
              </div>
            </div>

            <div className="form-section">
              <h3>Project Color</h3>
              <p className="color-description">Choose a color to identify your project</p>
              
              <div className="color-grid">
                {predefinedColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`color-option ${formData.color === color ? 'selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorSelect(color)}
                    title={`Select ${color}`}
                  >
                    {formData.color === color && (
                      <span className="color-check">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-actions">
              <div className="primary-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={handleCancel}
                  disabled={isFormLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="save-button"
                  disabled={isFormLoading || !formData.name.trim()}
                >
                  {isFormLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
              
              <div className="danger-zone">
                <button
                  type="button"
                  className="delete-button"
                  onClick={handleDelete}
                  disabled={isFormLoading}
                >
                  🗑️ Delete Project
                </button>
              </div>
            </div>
          </form>

          <div className="project-info-panel">
            <h3>Project Details</h3>
            <div className="info-item">
              <label>Created:</label>
              <span>{new Date(currentProject.created_at).toLocaleDateString()}</span>
            </div>
            <div className="info-item">
              <label>Last Updated:</label>
              <span>{new Date(currentProject.updated_at).toLocaleDateString()}</span>
            </div>
            <div className="info-item">
              <label>Tasks:</label>
              <span>{currentProject.tasks?.length || 0} tasks</span>
            </div>
            {currentProject.github_owner && currentProject.github_repo_name && (
              <div className="info-item">
                <label>GitHub:</label>
                <a 
                  href={`https://github.com/${currentProject.github_owner}/${currentProject.github_repo_name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="github-link"
                >
                  {currentProject.github_owner}/{currentProject.github_repo_name} ↗
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditProjectPage
