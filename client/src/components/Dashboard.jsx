import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import '../styles/Dashboard.css'

const Dashboard = () => {
  const navigate = useNavigate()
  // Get user data from Redux
  const { user } = useSelector(state => state.auth)

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
            <h3>Active Projects</h3>
            <p className="stat-number">5</p>
            <p className="stat-label">In Progress</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Tasks Completed</h3>
            <p className="stat-number">12</p>
            <p className="stat-label">Today</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-content">
            <h3>Time Logged</h3>
            <p className="stat-number">6h 30m</p>
            <p className="stat-label">Today</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <h3>Productivity</h3>
            <p className="stat-number">85%</p>
            <p className="stat-label">On Track</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Today's Tasks */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>📋 Today's Tasks</h2>
            <button className="add-button" onClick={() => navigate('/tasks/create')}>
              + Add Task
            </button>
          </div>
          <div className="card-content">
            <div className="task-item">
              <input type="checkbox" />
              <span className="task-text">Review pull request #123</span>
              <span className="task-priority high">High</span>
            </div>
            <div className="task-item">
              <input type="checkbox" checked />
              <span className="task-text">Update documentation</span>
              <span className="task-priority medium">Medium</span>
            </div>
            <div className="task-item">
              <input type="checkbox" />
              <span className="task-text">Fix login bug</span>
              <span className="task-priority low">Low</span>
            </div>
          </div>
        </div>

        {/* Active Projects */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>🚀 Active Projects</h2>
            <button className="add-button">+ New Project</button>
          </div>
          <div className="card-content">
            <div className="project-item">
              <div className="project-info">
                <h4>DevTrack App</h4>
                <p>Personal productivity dashboard</p>
              </div>
              <div className="project-progress">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '75%' }}></div>
                </div>
                <span className="progress-text">75%</span>
              </div>
            </div>
            <div className="project-item">
              <div className="project-info">
                <h4>E-commerce API</h4>
                <p>Backend service development</p>
              </div>
              <div className="project-progress">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '30%' }}></div>
                </div>
                <span className="progress-text">30%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Time Tracking */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>⏱️ Time Tracking</h2>
          </div>
          <div className="card-content">
            <div className="time-summary">
              <div className="time-display">
                <span className="time-number">06:30</span>
                <span className="time-label">Hours Today</span>
              </div>
              <div className="time-actions">
                <button className="start-button">Start Timer</button>
                <button className="stop-button" disabled>Stop</button>
              </div>
            </div>
            <div className="time-breakdown">
              <p><strong>Project Breakdown:</strong></p>
              <p>• DevTrack: 4h 15m</p>
              <p>• E-commerce: 2h 15m</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>📈 Recent Activity</h2>
          </div>
          <div className="card-content">
            <div className="activity-item">
              <span className="activity-icon">💾</span>
              <div className="activity-content">
                <p>Committed to DevTrack repository</p>
                <span className="activity-time">2 hours ago</span>
              </div>
            </div>
            <div className="activity-item">
              <span className="activity-icon">✅</span>
              <div className="activity-content">
                <p>Completed task: Update documentation</p>
                <span className="activity-time">4 hours ago</span>
              </div>
            </div>
            <div className="activity-item">
              <span className="activity-icon">🚀</span>
              <div className="activity-content">
                <p>Started new project: E-commerce API</p>
                <span className="activity-time">1 day ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <button className="quick-action-btn" onClick={() => navigate('/tasks/create')}>
          <span className="action-icon">➕</span>
          <span>New Task</span>
        </button>
        <button className="quick-action-btn">
          <span className="action-icon">🚀</span>
          <span>New Project</span>
        </button>
        <button className="quick-action-btn">
          <span className="action-icon">⏱️</span>
          <span>Start Timer</span>
        </button>
        <button className="quick-action-btn">
          <span className="action-icon">📊</span>
          <span>View Reports</span>
        </button>
      </div>
    </div>
  )
}

export default Dashboard
