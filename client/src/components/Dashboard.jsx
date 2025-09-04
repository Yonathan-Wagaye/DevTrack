import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchDashboardStats } from '../redux/thunks/dashboardThunks'
import LoadingSpinner from './common/LoadingSpinner'
import '../styles/Dashboard.css'

const Dashboard = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  // Get user data from Redux
  const { user } = useSelector(state => state.auth)
  const { stats, isLoading, error } = useSelector(state => state.dashboard)

  // Fetch dashboard data when component mounts
  useEffect(() => {
    dispatch(fetchDashboardStats())
  }, [dispatch])

  if (isLoading) {
    return <LoadingSpinner message="Loading dashboard..." />
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <h2>Error loading dashboard</h2>
        <p>{error}</p>
        <button onClick={() => dispatch(fetchDashboardStats())}>
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="dashboard">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome back, {user?.name || 'Developer'}! 👋</h1>
          <p>Here's your development overview for today</p>
        </div>
        <div className="date-info">
          <span className="current-date">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </div>
      </div>

      {/* Quick Stats Section */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Total Projects</h3>
            <p className="stat-number">{stats.projects.total}</p>
            <p className="stat-label">Created</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>Total Tasks</h3>
            <p className="stat-number">{stats.tasks.total}</p>
            <p className="stat-label">All Time</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Completed Tasks</h3>
            <p className="stat-number">{stats.tasks.completed}</p>
            <p className="stat-label">Done</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔄</div>
          <div className="stat-content">
            <h3>In Progress</h3>
            <p className="stat-number">{stats.tasks.in_progress}</p>
            <p className="stat-label">Active</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Recent Tasks */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>📋 Recent Tasks</h2>
            <button className="add-button" onClick={() => navigate('/tasks/create')}>
              + Add Task
            </button>
          </div>
          <div className="card-content">
            {stats.recent_tasks.length > 0 ? (
              stats.recent_tasks.map((task) => (
                <div key={task.id} className="task-item">
                  <input 
                    type="checkbox" 
                    checked={task.status === 'completed'} 
                    readOnly 
                  />
                  <span className="task-text">{task.title}</span>
                  <span className={`task-priority ${task.priority}`}>
                    {task.priority}
                  </span>
                  <span className="task-project">
                    {task.project_name}
                  </span>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>No tasks yet</p>
                <button 
                  className="create-first-button"
                  onClick={() => navigate('/tasks/create')}
                >
                  Create your first task
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Recent Projects */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>🚀 Recent Projects</h2>
            <button className="add-button" onClick={() => navigate('/projects/create')}>
              + New Project
            </button>
          </div>
          <div className="card-content">
            {stats.recent_projects.length > 0 ? (
              stats.recent_projects.map((project) => (
                <div 
                  key={project.id} 
                  className="project-item"
                  onClick={() => navigate(`/projects/${project.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="project-info">
                    <h4>{project.name}</h4>
                    <p>{project.description || 'No description'}</p>
                  </div>
                  <div className="project-color-indicator">
                    <div 
                      className="color-dot" 
                      style={{ backgroundColor: project.color }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>No projects yet</p>
                <button 
                  className="create-first-button"
                  onClick={() => navigate('/projects/create')}
                >
                  Create your first project
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Summary */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>📈 Quick Summary</h2>
          </div>
          <div className="card-content">
            <div className="summary-grid">
              <div className="summary-item">
                <span className="summary-icon">📋</span>
                <div className="summary-content">
                  <p className="summary-number">{stats.tasks.pending}</p>
                  <p className="summary-label">Pending Tasks</p>
                </div>
              </div>
              <div className="summary-item">
                <span className="summary-icon">🔄</span>
                <div className="summary-content">
                  <p className="summary-number">{stats.tasks.in_progress}</p>
                  <p className="summary-label">In Progress</p>
                </div>
              </div>
              <div className="summary-item">
                <span className="summary-icon">✅</span>
                <div className="summary-content">
                  <p className="summary-number">{stats.tasks.completed}</p>
                  <p className="summary-label">Completed</p>
                </div>
              </div>
              <div className="summary-item">
                <span className="summary-icon">📊</span>
                <div className="summary-content">
                  <p className="summary-number">{stats.projects.total}</p>
                  <p className="summary-label">Projects</p>
                </div>
              </div>
            </div>
            {stats.tasks.total > 0 && (
              <div className="completion-rate">
                <p>
                  <strong>Completion Rate:</strong>{' '}
                  {Math.round((stats.tasks.completed / stats.tasks.total) * 100)}%
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <button className="quick-action-btn" onClick={() => navigate('/tasks/create')}>
          <span className="action-icon">➕</span>
          <span>New Task</span>
        </button>
        <button className="quick-action-btn" onClick={() => navigate('/projects/create')}>
          <span className="action-icon">🚀</span>
          <span>New Project</span>
        </button>
        <button className="quick-action-btn" onClick={() => navigate('/tasks')}>
          <span className="action-icon">📋</span>
          <span>All Tasks</span>
        </button>
        <button className="quick-action-btn" onClick={() => navigate('/projects')}>
          <span className="action-icon">📊</span>
          <span>All Projects</span>
        </button>
      </div>
    </div>
  )
}

export default Dashboard
