import React, { useState } from 'react'
import '../../styles/TaskModal.css'

const TaskEditModal = ({ task, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || 'medium',
    status: task?.status || 'pending',
    due_date: task?.due_date ? task.due_date.split('T')[0] : '',
    time_estimate: task?.time_estimate || ''
  })
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState({})

  if (!isOpen || !task) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required'
    }
    
    if (formData.time_estimate && (isNaN(formData.time_estimate) || formData.time_estimate < 0)) {
      newErrors.time_estimate = 'Time estimate must be a positive number'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSaving(true)
    
    try {
      const updatedData = {
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim(),
        time_estimate: formData.time_estimate ? parseInt(formData.time_estimate) : null,
        due_date: formData.due_date || null
      }
      
      await onSave(updatedData)
    } catch (error) {
      console.error('Error saving task:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#e74c3c'
      case 'medium': return '#f39c12'
      case 'low': return '#27ae60'
      default: return '#95a5a6'
    }
  }

  return (
    <div className="task-modal-overlay" onClick={onClose}>
      <div className="task-modal task-edit-modal" onClick={(e) => e.stopPropagation()}>
        <div className="task-modal-header">
          <div className="task-modal-title">
            <h2>Edit Task</h2>
          </div>
          <button className="close-modal-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="task-edit-form">
          <div className="task-modal-content">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="title">Task Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`form-input ${errors.title ? 'error' : ''}`}
                  placeholder="Enter task title"
                />
                {errors.title && <span className="error-text">{errors.title}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-textarea"
                  placeholder="Enter task description (optional)"
                  rows="3"
                />
              </div>
            </div>

            <div className="form-row two-columns">
              <div className="form-group">
                <label htmlFor="priority">Priority</label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <div 
                  className="priority-preview"
                  style={{ backgroundColor: getPriorityColor(formData.priority) }}
                />
              </div>

              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="form-row two-columns">
              <div className="form-group">
                <label htmlFor="due_date">Due Date</label>
                <input
                  type="date"
                  id="due_date"
                  name="due_date"
                  value={formData.due_date}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="time_estimate">Time Required (hours)</label>
                <input
                  type="number"
                  id="time_estimate"
                  name="time_estimate"
                  value={formData.time_estimate}
                  onChange={handleChange}
                  className={`form-input ${errors.time_estimate ? 'error' : ''}`}
                  placeholder="e.g., 4"
                  min="0"
                  step="0.5"
                />
                {errors.time_estimate && <span className="error-text">{errors.time_estimate}</span>}
              </div>
            </div>
          </div>

          <div className="task-modal-actions">
            <button 
              type="button"
              className="btn-cancel" 
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="btn-save" 
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : '💾 Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TaskEditModal
