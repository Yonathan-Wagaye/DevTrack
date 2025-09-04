import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchProjects } from '../redux/thunks/projectThunks'
import ProjectCard from '../components/projects/ProjectCard'
import LoadingSpinner from '../components/common/LoadingSpinner'
import '../styles/ProjectsPage.css'

const ProjectsPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { projects, isLoading, error } = useSelector(state => state.projects)

  useEffect(() => {
    console.log('📋 ProjectsPage: Fetching projects...')
    dispatch(fetchProjects())
  }, [dispatch])

  const handleProjectClick = (projectId) => {
    console.log('🔗 ProjectsPage: Navigating to project:', projectId, 'type:', typeof projectId)
    
    if (projectId && !isNaN(projectId)) {
      navigate(`/projects/${projectId}`)
    } else {
      console.error('🔗 ProjectsPage: Invalid project ID:', projectId)
      // Could show an error message to user here
    }
  }

  const handleCreateProject = () => {
    navigate('/projects/create')
  }

  if (isLoading) {
    return <LoadingSpinner message="Loading projects..." />
  }

  return (
    <div className="projects-page">
      <div className="page-header">
        <div className="header-content">
          <div className="header-text">
            <h1>Your Projects</h1>
            <p>Organize your tasks by projects. Click on a project to view its tasks.</p>
          </div>
          <button 
            className="create-project-btn"
            onClick={handleCreateProject}
          >
            + New Project
          </button>
        </div>
      </div>

      <div className="page-content">
        {error && (
          <div className="error-message">
            <p>❌ Error loading projects: {error}</p>
            <button onClick={() => dispatch(fetchProjects())}>
              Try Again
            </button>
          </div>
        )}

        {projects.length === 0 && !isLoading && !error ? (
          <div className="empty-state">
            <div className="empty-icon">📂</div>
            <h3>No Projects Yet</h3>
            <p>Create your first project to start organizing your tasks</p>
            <button 
              className="create-project-btn primary"
              onClick={handleCreateProject}
            >
              Create Your First Project
            </button>
          </div>
        ) : (
          <div className="projects-grid">
            {projects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => handleProjectClick(project.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjectsPage
