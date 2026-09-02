import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchProject } from '../redux/thunks/projectThunks'
import { clearCurrentProject } from '../redux/slices/projectSlice'
import { fetchTasks, updateTask } from '../redux/thunks/taskThunks'
import TaskCard from '../components/tasks/TaskCard'
import TaskModal from '../components/tasks/TaskModal'

import LoadingSpinner from '../components/common/LoadingSpinner'
import { TaskIcon } from '../components/icons/Icons'
import '../styles/ProjectPage.css'

const ProjectPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id: projectId } = useParams()
  
  const { currentProject, isLoading, error } = useSelector(state => state.projects)
  
  // Modal state
  const [selectedTask, setSelectedTask] = useState(null)
  
  // Drag and drop state
  const [draggedTask, setDraggedTask] = useState(null)
  const [dragOverColumn, setDragOverColumn] = useState(null)

  useEffect(() => {
    console.log('📂 ProjectPage: useEffect triggered with projectId:', projectId, 'type:', typeof projectId)
    
    if (projectId && !isNaN(projectId)) {
      const numericProjectId = parseInt(projectId, 10)
      console.log('📂 ProjectPage: Fetching project with numeric ID:', numericProjectId)
      dispatch(fetchProject(numericProjectId))
    } else {
      console.error('📂 ProjectPage: Invalid projectId:', projectId)
      // Redirect back to tasks page if invalid ID
      navigate('/tasks')
    }

    // Cleanup when component unmounts
    return () => {
      dispatch(clearCurrentProject())
    }
  }, [dispatch, projectId, navigate])

  const handleBackToProjects = () => {
    navigate('/projects')
  }

  const handleCreateTask = () => {
    navigate('/tasks/create', { 
      state: { projectId: parseInt(projectId) } 
    })
  }

  const handleEditProject = () => {
    navigate(`/projects/${projectId}/edit`)
  }

  // Modal handlers
  const handleTaskClick = (task) => {
    console.log('🎯 Task clicked:', task)
    setSelectedTask(task)
  }

  const handleCloseModal = () => {
    setSelectedTask(null)
  }

  // Drag and drop handlers
  const handleDragStart = (task) => {
    console.log('🎯 Drag started:', task)
    setDraggedTask(task)
  }

  const handleDragEnd = () => {
    console.log('🎯 Drag ended')
    setDraggedTask(null)
    setDragOverColumn(null)
  }

  const handleDragOver = (e, status) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverColumn(status)
  }

  const handleDragLeave = (e) => {
    // Only clear drag over if we're actually leaving the column
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX
    const y = e.clientY
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDragOverColumn(null)
    }
  }

  const handleDrop = async (e, newStatus) => {
    e.preventDefault()
    
    if (!draggedTask || draggedTask.status === newStatus) {
      setDragOverColumn(null)
      return
    }

    console.log('🎯 Dropping task:', draggedTask.title, 'to status:', newStatus)

    try {
      // Update task status in backend
      const result = await dispatch(updateTask({
        taskId: draggedTask.id,
        taskData: { status: newStatus }
      }))

      if (updateTask.fulfilled.match(result)) {
        console.log('✅ Task status updated successfully')
        // Refresh project data to show updated task in new column
        dispatch(fetchProject(parseInt(projectId)))
      } else {
        console.error('❌ Failed to update task status')
      }
    } catch (error) {
      console.error('❌ Error updating task status:', error)
    }

    setDragOverColumn(null)
    setDraggedTask(null)
  }

  if (isLoading) {
    return <LoadingSpinner message="Loading project..." />
  }

  if (error) {
    return (
      <div className="error-page">
        <div className="error-content">
          <h2>❌ Error Loading Project</h2>
          <p>{error}</p>
          <div className="error-actions">
            <button onClick={() => dispatch(fetchProject(parseInt(projectId)))}>
              Try Again
            </button>
            <button onClick={handleBackToProjects} className="secondary">
              Back to Projects
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!currentProject) {
    return (
      <div className="error-page">
        <div className="error-content">
          <h2>📂 Project Not Found</h2>
          <p>The project you're looking for doesn't exist or you don't have access to it.</p>
          <button onClick={handleBackToProjects}>
            Back to Projects
          </button>
        </div>
      </div>
    )
  }

  const { name, description, color, tasks = [] } = currentProject

  // Group tasks by status
  const tasksByStatus = {
    pending: tasks.filter(task => task.status === 'pending'),
    'in-progress': tasks.filter(task => task.status === 'in-progress'),
    completed: tasks.filter(task => task.status === 'completed')
  }

  return (
    <div className="project-page">
      <div className="project-page-header">
        <div className="project-page-header-content">
          {/* Header Top Row: Back Button (left) + Actions (right) */}
          <div className="project-page-header-top">
            <div className="project-page-back-nav">
              <button 
                className="project-page-back-button"
                onClick={handleBackToProjects}
              >
                ← Back to Projects
              </button>
            </div>
            
            <div className="project-page-actions">
              <button 
                className="project-page-edit-btn"
                onClick={handleEditProject}
              >
                Edit Project
              </button>
              <button 
                className="project-page-add-task-btn"
                onClick={handleCreateTask}
              >
                + Add Task
              </button>
            </div>
          </div>

          {/* Project Title Section - Left Aligned */}
          <div className="project-page-title-section">
            <div className="project-page-title-row">
              <div className="project-page-color-indicator" style={{ backgroundColor: color }}></div>
              <div className="project-page-title-text">
                <h1 className="project-page-title">{name}</h1>
                {description && <p className="project-page-description">{description}</p>}
              </div>
            </div>
          </div>

          {/* Project Stats - Immediately Below Title */}
          <div className="project-page-stats">
            <div className="project-page-stat-card">
              <span className="project-page-stat-number">{tasks.length}</span>
              <span className="project-page-stat-label">Total Tasks</span>
            </div>
            <div className="project-page-stat-card">
              <span className="project-page-stat-number">{tasksByStatus.pending.length}</span>
              <span className="project-page-stat-label">Pending</span>
            </div>
            <div className="project-page-stat-card">
              <span className="project-page-stat-number">{tasksByStatus['in-progress'].length}</span>
              <span className="project-page-stat-label">In Progress</span>
            </div>
            <div className="project-page-stat-card">
              <span className="project-page-stat-number">{tasksByStatus.completed.length}</span>
              <span className="project-page-stat-label">Completed</span>
            </div>
          </div>
        </div>
      </div>

      <div className="page-content">
        {tasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <TaskIcon size={40} />
            </div>
            <h3>No Tasks Yet</h3>
            <p>Add your first task to get started with this project</p>
            <button 
              className="create-task-btn primary"
              onClick={handleCreateTask}
            >
              Add Your First Task
            </button>
          </div>
        ) : (
          <div className="tasks-kanban">
            <div className="status-column">
              <div className="column-header pending">
                <h3>Pending</h3>
                <span className="task-count">{tasksByStatus.pending.length}</span>
              </div>
              <div 
                className={`tasks-list ${dragOverColumn === 'pending' ? 'drag-over' : ''}`}
                onDragOver={(e) => handleDragOver(e, 'pending')}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, 'pending')}
              >
                {tasksByStatus.pending.length === 0 ? (
                  <div className="drop-zone">
                    <div className="drop-zone-text">
                      {draggedTask && draggedTask.status !== 'pending' 
                        ? 'Drop here to move to Pending' 
                        : 'No pending tasks'
                      }
                    </div>
                  </div>
                ) : (
                  tasksByStatus.pending.map(task => (
                    <TaskCard 
                      key={task.id} 
                      task={task} 
                      projectColor={color} 
                      onClick={handleTaskClick}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                      isDragging={draggedTask?.id === task.id}
                    />
                  ))
                )}
              </div>
            </div>

            <div className="status-column">
              <div className="column-header in-progress">
                <h3>In Progress</h3>
                <span className="task-count">{tasksByStatus['in-progress'].length}</span>
              </div>
              <div 
                className={`tasks-list ${dragOverColumn === 'in-progress' ? 'drag-over' : ''}`}
                onDragOver={(e) => handleDragOver(e, 'in-progress')}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, 'in-progress')}
              >
                {tasksByStatus['in-progress'].length === 0 ? (
                  <div className="drop-zone">
                    <div className="drop-zone-text">
                      {draggedTask && draggedTask.status !== 'in-progress' 
                        ? 'Drop here to move to In Progress' 
                        : 'No tasks in progress'
                      }
                    </div>
                  </div>
                ) : (
                  tasksByStatus['in-progress'].map(task => (
                    <TaskCard 
                      key={task.id} 
                      task={task} 
                      projectColor={color} 
                      onClick={handleTaskClick}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                      isDragging={draggedTask?.id === task.id}
                    />
                  ))
                )}
              </div>
            </div>

            <div className="status-column">
              <div className="column-header completed">
                <h3>Completed</h3>
                <span className="task-count">{tasksByStatus.completed.length}</span>
              </div>
              <div 
                className={`tasks-list ${dragOverColumn === 'completed' ? 'drag-over' : ''}`}
                onDragOver={(e) => handleDragOver(e, 'completed')}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, 'completed')}
              >
                {tasksByStatus.completed.length === 0 ? (
                  <div className="drop-zone">
                    <div className="drop-zone-text">
                      {draggedTask && draggedTask.status !== 'completed' 
                        ? 'Drop here to mark as Completed' 
                        : 'No completed tasks'
                      }
                    </div>
                  </div>
                ) : (
                  tasksByStatus.completed.map(task => (
                    <TaskCard 
                      key={task.id} 
                      task={task} 
                      projectColor={color} 
                      onClick={handleTaskClick}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                      isDragging={draggedTask?.id === task.id}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Task Modal */}
      {selectedTask && (
        <TaskModal
          task={selectedTask}
          isOpen={true}
          onClose={handleCloseModal}
          onTaskUpdate={() => dispatch(fetchProject(parseInt(projectId)))}
        />
      )}
    </div>
  )
}

export default ProjectPage
