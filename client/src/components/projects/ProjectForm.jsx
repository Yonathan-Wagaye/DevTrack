import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updateFormField, resetForm, clearFormError } from '../../redux/slices/projectSlice'
import { createProject } from '../../redux/thunks/projectThunks'
import GitHubLogo from '../icons/GitHubLogo'
import '../../styles/ProjectForm.css'

const ProjectForm = ({ onSuccess, onCancel }) => {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const { 
    formData, 
    isFormLoading, 
    formError 
  } = useSelector(state => state.projects)

  const predefinedColors = [
    '#f5f5f5',
    '#d4d4d4',
    '#a3a3a3',
    '#737373',
    '#525252',
    '#404040',
    '#6b7280',
    '#9ca3af',
    '#d1d5db',
    '#4b5563',
    '#374151',
    '#1f2937'
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    dispatch(updateFormField({ field: name, value }))
    if (formError) {
      dispatch(clearFormError())
    }
  }

  const handleColorSelect = (color) => {
    dispatch(updateFormField({ field: 'color', value: color }))
    if (formError) {
      dispatch(clearFormError())
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (!formData.name.trim()) {
        throw new Error('Project name is required')
      }
      
      const projectData = {
        name: formData.name.trim(),
        description: formData.description?.trim() || null,
        color: formData.color || '#3498db',
        github_repo_url: formData.github_repo_url?.trim() || null
      }
      
      console.log('📝 ProjectForm: Submitting project:', projectData)
      const result = await dispatch(createProject(projectData))
      
      if (createProject.fulfilled.match(result)) {
        console.log('📝 ProjectForm: Project created successfully')
        dispatch(resetForm())
        if (onSuccess) {
          onSuccess()
        }
      } else {
        console.error('📝 ProjectForm: Failed to create project:', result.error)
      }
    } catch (err) {
      console.error('📝 ProjectForm: Error in form submission:', err)
    }
  }

  const handleCancel = () => {
    dispatch(resetForm())
    if (onCancel) {
      onCancel()
    }
  }

  return (
    <div className="project-form-container">
      <form onSubmit={handleSubmit} className="project-form">
        <div className="form-section">
          <h3>Project Details</h3>
          
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
            <label htmlFor="github_repo_url" className="form-label label-with-logo">
              <GitHubLogo size={16} />
              GitHub repository
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

          <div className="form-group">
            <label htmlFor="color" className="form-label">
              Custom Color
            </label>
            <div className="custom-color-input">
              <input
                type="color"
                id="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="form-color-picker"
              />
              <span className="color-value">{formData.color}</span>
            </div>
          </div>
        </div>

        {formError && (
          <div className="form-error">
            <p>❌ {formError}</p>
          </div>
        )}

        <div className="form-actions">
          <button
            type="button"
            onClick={handleCancel}
            className="btn-cancel"
            disabled={isFormLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-submit"
            disabled={isFormLoading || !formData.name.trim()}
          >
            {isFormLoading ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProjectForm
