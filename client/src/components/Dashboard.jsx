import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchDashboardStats } from '../redux/thunks/dashboardThunks'
import LoadingSpinner from './common/LoadingSpinner'
import { FolderIcon, ListIcon, CheckIcon, ProgressIcon } from './icons/Icons'
import '../styles/Dashboard.css'

const Dashboard = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const { stats, isLoading, error } = useSelector(state => state.dashboard)

  useEffect(() => {
    dispatch(fetchDashboardStats())
  }, [dispatch])

  if (isLoading) {
    return <LoadingSpinner message="Loading dashboard..." />
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <h2>Unable to load dashboard</h2>
        <p>{error}</p>
        <button onClick={() => dispatch(fetchDashboardStats())}>
          Try again
        </button>
      </div>
    )
  }

  const completionRate = stats.tasks.total > 0
    ? Math.round((stats.tasks.completed / stats.tasks.total) * 100)
    : 0

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="welcome-section">
          <p className="dashboard-kicker">Overview</p>
          <h1>Welcome back, {user?.name || 'Developer'}</h1>
          <p>Your projects and tasks at a glance.</p>
        </div>
        <button className="add-button" onClick={() => navigate('/projects/create')}>
          + New project
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-head">
            <span className="stat-label">Projects</span>
            <span className="stat-icon"><FolderIcon /></span>
          </div>
          <p className="stat-number">{stats.projects.total}</p>
        </div>

        <div className="stat-card">
          <div className="stat-card-head">
            <span className="stat-label">Tasks</span>
            <span className="stat-icon"><ListIcon /></span>
          </div>
          <p className="stat-number">{stats.tasks.total}</p>
        </div>

        <div className="stat-card">
          <div className="stat-card-head">
            <span className="stat-label">Completed</span>
            <span className="stat-icon"><CheckIcon /></span>
          </div>
          <p className="stat-number">{stats.tasks.completed}</p>
        </div>

        <div className="stat-card">
          <div className="stat-card-head">
            <span className="stat-label">In progress</span>
            <span className="stat-icon"><ProgressIcon /></span>
          </div>
          <p className="stat-number">{stats.tasks.in_progress}</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="dashboard-card">
          <div className="card-header">
            <h2>Recent tasks</h2>
            <button className="ghost-button" onClick={() => navigate('/tasks/create')}>
              + Add task
            </button>
          </div>
          <div className="card-content">
            {stats.recent_tasks.length > 0 ? (
              stats.recent_tasks.map((task) => (
                <div key={task.id} className="task-item">
                  <span className={`status-dot ${task.status}`} />
                  <span className="task-text">{task.title}</span>
                  <span className="task-project">{task.project_name}</span>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <h3>No tasks yet</h3>
                <p>Create a task to start tracking your work.</p>
                <button className="ghost-button" onClick={() => navigate('/tasks/create')}>
                  Create task
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="dashboard-card">
          <div className="card-header">
            <h2>Recent projects</h2>
            <button className="ghost-button" onClick={() => navigate('/projects/create')}>
              + New project
            </button>
          </div>
          <div className="card-content">
            {stats.recent_projects.length > 0 ? (
              stats.recent_projects.map((project) => (
                <button
                  key={project.id}
                  className="dashboard-project-item"
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
                  <div className="dashboard-project-avatar">
                    {project.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="dashboard-project-copy">
                    <h4 className="dashboard-project-title">{project.name}</h4>
                    <p className="dashboard-project-description">
                      {project.description || 'No description'}
                    </p>
                  </div>
                </button>
              ))
            ) : (
              <div className="empty-state">
                <h3>No projects yet</h3>
                <p>Create a project to organize tasks and commits.</p>
                <button className="ghost-button" onClick={() => navigate('/projects/create')}>
                  Create project
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="dashboard-card">
          <div className="card-header">
            <h2>Summary</h2>
          </div>
          <div className="card-content">
            <div className="summary-list">
              <div className="summary-row">
                <span>Pending</span>
                <strong>{stats.tasks.pending}</strong>
              </div>
              <div className="summary-row">
                <span>In progress</span>
                <strong>{stats.tasks.in_progress}</strong>
              </div>
              <div className="summary-row">
                <span>Completed</span>
                <strong>{stats.tasks.completed}</strong>
              </div>
              <div className="summary-row">
                <span>Projects</span>
                <strong>{stats.projects.total}</strong>
              </div>
            </div>
            {stats.tasks.total > 0 && (
              <p className="completion-rate">Completion rate {completionRate}%</p>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Dashboard
