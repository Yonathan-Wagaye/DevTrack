import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { updateTask, deleteTask } from '../../redux/thunks/taskThunks'
import TaskEditModal from './TaskEditModal'
import '../../styles/TaskModal.css'

const TaskModal = ({ task, isOpen, onClose, onTaskUpdate }) => {
  const dispatch = useDispatch()
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  if (!isOpen || !task) return null

  const {
    id,
    title,
    description,
    priority,
    status,
    due_date,
    time_estimate,
    created_at,
    updated_at
  } = task

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
  }

  const handleSaveEdit = async (updatedTaskData) => {
    try {
      const result = await dispatch(updateTask({ taskId: id, taskData: updatedTaskData }))
      if (updateTask.fulfilled.match(result)) {
        setIsEditing(false)
        if (onTaskUpdate) {
          onTaskUpdate(result.payload)
        }
      }
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setIsDeleting(true)
      try {
        const result = await dispatch(deleteTask(id))
        if (deleteTask.fulfilled.match(result)) {
          onClose()
          if (onTaskUpdate) {
            onTaskUpdate(null, 'delete')
          }
        }
      } catch (error) {
        console.error('Error deleting task:', error)
      } finally {
        setIsDeleting(false)
      }
    }
  }

  const handleStatusChange = async (newStatus) => {
    try {
      const result = await dispatch(updateTask({ 
        taskId: id, 
        taskData: { status: newStatus } 
      }))
      if (updateTask.fulfilled.match(result)) {
        if (onTaskUpdate) {
          onTaskUpdate(result.payload)
        }
      }
    } catch (error) {
      console.error('Error updating task status:', error)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Not set'
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatTimeEstimate = (minutes) => {
    if (!minutes) return 'Not set'
    if (minutes < 60) return `${minutes} minutes`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours} hours`
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#e74c3c'
      case 'medium': return '#f39c12'
      case 'low': return '#27ae60'
      default: return '#95a5a6'
    }
  }

  const getTimeLeft = (dueDate) => {
    if (!dueDate) return null
    const now = new Date()
    const due = new Date(dueDate)
    const diff = due - now
    
    if (diff < 0) return 'Overdue'
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    if (days > 0) return `${days} days left`
    if (hours > 0) return `${hours} hours left`
    return 'Due today'
  }

  // Show edit modal if editing
  if (isEditing) {
    return (
      <TaskEditModal
        task={task}
        isOpen={true}
        onClose={handleCancelEdit}
        onSave={handleSaveEdit}
      />
    )
  }

  return (
    <div className="task-modal-overlay" onClick={onClose}>
      <div className="task-modal" onClick={(e) => e.stopPropagation()}>
        <div className="task-modal-header">
          <div className="task-modal-title">
            <div className="task-status-indicator">
              <span className={`status-badge ${status}`}>
                {status.replace('-', ' ').toUpperCase()}
              </span>
              <div 
                className="priority-indicator" 
                style={{ backgroundColor: getPriorityColor(priority) }}
                title={`${priority} priority`}
              />
            </div>
            <h2>{title}</h2>
          </div>
          <button className="close-modal-btn" onClick={onClose}>×</button>
        </div>

        <div className="task-modal-content">
          <div className="task-description-section">
            <h3>Description</h3>
            <p className="task-description">
              {description || 'No description provided'}
            </p>
          </div>

          <div className="task-details-grid">
            <div className="detail-item">
              <label>Status</label>
              <select 
                value={status} 
                onChange={(e) => handleStatusChange(e.target.value)}
                className="status-select"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="detail-item">
              <label>Priority</label>
              <span className="detail-value" style={{ color: getPriorityColor(priority) }}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </span>
            </div>

            <div className="detail-item">
              <label>Due Date</label>
              <span className="detail-value">{formatDate(due_date)}</span>
            </div>

            <div className="detail-item">
              <label>Time Left</label>
              <span className={`detail-value ${getTimeLeft(due_date) === 'Overdue' ? 'overdue' : ''}`}>
                {getTimeLeft(due_date) || 'No due date'}
              </span>
            </div>

            <div className="detail-item">
              <label>Estimated Time</label>
              <span className="detail-value">{formatTimeEstimate(time_estimate)}</span>
            </div>

            <div className="detail-item">
              <label>Created</label>
              <span className="detail-value">{formatDateTime(created_at)}</span>
            </div>

            {updated_at && updated_at !== created_at && (
              <div className="detail-item">
                <label>Last Updated</label>
                <span className="detail-value">{formatDateTime(updated_at)}</span>
              </div>
            )}

            <div className="detail-item">
              <label>Task ID</label>
              <span className="detail-value">#{id}</span>
            </div>
          </div>
        </div>

        <div className="task-modal-actions">
          <button 
            className="btn-edit" 
            onClick={handleEdit}
          >
            ✏️ Edit Task
          </button>
          <button 
            className="btn-delete" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : '🗑️ Delete Task'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default TaskModal
