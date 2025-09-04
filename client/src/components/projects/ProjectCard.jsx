import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../../styles/ProjectCard.css'

const ProjectCard = ({ project, onClick }) => {
  const navigate = useNavigate()
  const {
    id,
    name,
    description,
    color,
    task_count = 0,
    completed_tasks = 0,
    pending_tasks = 0,
    in_progress_tasks = 0
  } = project

  // Don't render if project is invalid
  if (!id || !name) {
    console.warn('ProjectCard: Invalid project data:', project)
    return null
  }

  const completionPercentage = task_count > 0 ? Math.round((completed_tasks / task_count) * 100) : 0

  const handleEditClick = (e) => {
    e.stopPropagation() // Prevent card click
    navigate(`/projects/${id}/edit`)
  }

  return (
    <div 
      className="project-card" 
      onClick={onClick}
      style={{ borderLeftColor: color }}
    >
      <div className="project-header">
        <div className="project-info">
          <h3 className="project-name">{name}</h3>
          {description && (
            <p className="project-description">{description}</p>
          )}
        </div>
        <div className="project-actions">
          <button 
            className="edit-project-button"
            onClick={handleEditClick}
            title="Edit Project"
          >
            ✏️
          </button>
          <div className="project-color" style={{ backgroundColor: color }}></div>
        </div>
      </div>

      <div className="project-stats">
        <div className="stats-row">
          <div className="stat-item">
            <span className="stat-number">{task_count}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{pending_tasks}</span>
            <span className="stat-label">Pending</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{completed_tasks}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>

        <div className="progress-section">
          <div className="progress-info">
            <span className="progress-label">Progress</span>
            <span className="progress-percentage">{completionPercentage}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ 
                width: `${completionPercentage}%`,
                backgroundColor: color 
              }}
            ></div>
          </div>
        </div>
      </div>

      <div className="project-footer">
        <span className="view-project">Click to view tasks →</span>
      </div>
    </div>
  )
}

export default ProjectCard
