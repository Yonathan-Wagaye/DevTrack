import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchTasks, updateTask } from '../redux/thunks/taskThunks'
import TaskCard from '../components/tasks/TaskCard'
import TaskModal from '../components/tasks/TaskModal'

import LoadingSpinner from '../components/common/LoadingSpinner'
import { TaskIcon } from '../components/icons/Icons'
import '../styles/TasksPage.css'

const TasksPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { tasks, isLoading, error } = useSelector(state => state.tasks)
  
  // Modal state
  const [selectedTask, setSelectedTask] = useState(null)
  
  // Drag and drop state
  const [draggedTask, setDraggedTask] = useState(null)
  const [dragOverColumn, setDragOverColumn] = useState(null)

  useEffect(() => {
    console.log('📋 TasksPage: Fetching tasks...')
    dispatch(fetchTasks())
  }, [dispatch])

  const handleCreateTask = () => {
    navigate('/tasks/create')
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
      const result = await dispatch(updateTask({
        taskId: draggedTask.id,
        taskData: { status: newStatus }
      }))

      if (updateTask.fulfilled.match(result)) {
        console.log('✅ Task status updated successfully')
        dispatch(fetchTasks()) // Refresh tasks
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
    return <LoadingSpinner message="Loading tasks..." />
  }

  // Group tasks by status
  const tasksByStatus = {
    pending: tasks.filter(task => task.status === 'pending'),
    'in-progress': tasks.filter(task => task.status === 'in-progress'),
    completed: tasks.filter(task => task.status === 'completed')
  }

  const totalTasks = tasks.length
  const completedTasks = tasksByStatus.completed.length
  const pendingTasks = tasksByStatus.pending.length
  const inProgressTasks = tasksByStatus['in-progress'].length

  return (
    <div className="tasks-page app-page">
      <div className="app-page-card">
        <div className="app-page-head">
          <div>
            <h1>Tasks</h1>
            <p>Manage tasks by status across all projects.</p>
          </div>
          <button className="create-task-btn primary" onClick={handleCreateTask}>
            + Add Task
          </button>
        </div>

        <div className="app-page-stats">
          <span><strong>{totalTasks}</strong> total</span>
          <span><strong>{pendingTasks}</strong> pending</span>
          <span><strong>{inProgressTasks}</strong> in progress</span>
          <span><strong>{completedTasks}</strong> completed</span>
        </div>

        {error && (
          <div className="error-message">
            <p>Error loading tasks: {error}</p>
            <button onClick={() => dispatch(fetchTasks())}>Try again</button>
          </div>
        )}

        {totalTasks === 0 && !isLoading && !error ? (
          <div className="empty-state">
            <div className="empty-icon">
              <TaskIcon size={32} />
            </div>
            <h3>No tasks yet</h3>
            <p>Create your first task to get started with DevTrack</p>
            <button className="create-task-btn primary" onClick={handleCreateTask}>
              Create your first task
            </button>
          </div>
        ) : (
          <div className="tasks-kanban">
            <div className="status-column">
              <div className="column-header pending">
                <h3>Pending</h3>
                <span className="task-count">{pendingTasks}</span>
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
                <span className="task-count">{inProgressTasks}</span>
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
                <span className="task-count">{completedTasks}</span>
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

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          isOpen={true}
          onClose={handleCloseModal}
          onTaskUpdate={() => dispatch(fetchTasks())}
        />
      )}
    </div>
  )
}

export default TasksPage
