import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updateFormField, resetForm, clearFormError } from '../../redux/slices/taskSlice'
import { createTask } from '../../redux/thunks/taskThunks'
import '../../styles/TaskForm.css'

const TaskForm = ({ onSuccess, onCancel }) => {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const { 
    formData, 
    isFormLoading, 
    formError, 
    projects, 
    priorities, 
    statuses 
  } = useSelector(state => state.tasks)

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    dispatch(updateFormField({ field: name, value }))
    // Clear any previous errors when user starts typing
    if (formError) {
      dispatch(clearFormError())
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      // Validate required fields
      if (!formData.title.trim()) {
        throw new Error('Task title is required')
      }

      // Prepare task data
      const taskData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        status: formData.status,
        projectId: parseInt(formData.project),
        dueDate: formData.dueDate || null,
        timeEstimate: formData.timeEstimate ? parseInt(formData.timeEstimate) : null,
        userId: user.id
      }

      console.log('📝 TaskForm: Submitting task:', taskData)

      // Dispatch the create task thunk
      const result = await dispatch(createTask(taskData))
      
      if (createTask.fulfilled.match(result)) {
        console.log('📝 TaskForm: Task created successfully')
        // Reset form and call success callback
        dispatch(resetForm())
        onSuccess()
      } else {
        console.error('📝 TaskForm: Failed to create task:', result.error)
      }
      
    } catch (err) {
      console.error('📝 TaskForm: Error in form submission:', err)
    }
  }

  // Handle cancel
  const handleCancel = () => {
    // Reset form when canceling
    dispatch(resetForm())
    if (onCancel) {
      onCancel()
    }
  }

  return (
    <div className="task-form-container">
      <form onSubmit={handleSubmit} className="task-form">
        {formError && (
          <div className="error-message">
            {formError}
          </div>
        )}

        {/* Title Field */}
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Task Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter task title"
            required
          />
        </div>

        {/* Description Field */}
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
            placeholder="Enter task description (optional)"
            rows="4"
          />
        </div>

        {/* Priority and Status Row */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="priority" className="form-label">
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="form-select"
            >
                          {priorities.map(priority => (
              <option key={priority.value} value={priority.value}>
                {priority.label}
              </option>
            ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="status" className="form-label">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="form-select"
            >
                          {statuses.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
            </select>
          </div>
        </div>

        {/* Project and Due Date Row */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="project" className="form-label">
              Project
            </label>
            <select
              id="project"
              name="project"
              value={formData.project}
              onChange={handleChange}
              className="form-select"
            >
                          {projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="dueDate" className="form-label">
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>

        {/* Time Estimate */}
        <div className="form-group">
          <label htmlFor="timeEstimate" className="form-label">
            Time Estimate (minutes)
          </label>
          <input
            type="number"
            id="timeEstimate"
            name="timeEstimate"
            value={formData.timeEstimate}
            onChange={handleChange}
            className="form-input"
            placeholder="e.g., 120 for 2 hours"
            min="1"
          />
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            onClick={handleCancel}
            className="btn btn-secondary"
            disabled={isFormLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isFormLoading}
          >
            {isFormLoading ? 'Creating Task...' : 'Create Task'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default TaskForm