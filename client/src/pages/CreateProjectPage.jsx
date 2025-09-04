import React from 'react'
import { useNavigate } from 'react-router-dom'
import ProjectForm from '../components/projects/ProjectForm'
import '../styles/CreateProjectPage.css'

const CreateProjectPage = () => {
  const navigate = useNavigate()

  const handleSuccess = () => {
    // Redirect to projects page after successful creation
    navigate('/projects')
  }

  const handleCancel = () => {
    // Go back to previous page or projects page
    navigate(-1)
  }

  return (
    <div className="create-project-page">
      <div className="page-header">
        <div className="header-content">
          <div className="header-text">
            <h1>Create New Project</h1>
            <p>Start a new project to organize your tasks and track progress</p>
          </div>
          
          <div className="header-nav">
            <button 
              className="back-button"
              onClick={handleCancel}
            >
              ← Back
            </button>
          </div>
        </div>
      </div>

      <div className="page-content">
        <ProjectForm 
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  )
}

export default CreateProjectPage
