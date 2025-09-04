import React from 'react'
import '../../styles/TaskCard.css'

const TaskCard = ({ task, projectColor, onClick, onDragStart, onDragEnd, isDragging }) => {
  const {
    id,
    title,
    priority,
    status
  } = task

  const handleCardClick = (e) => {
    // Don't trigger click when dragging
    if (e.defaultPrevented) return
    
    if (onClick) {
      onClick(task)
    }
  }

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(task))
    e.dataTransfer.effectAllowed = 'move'
    
    if (onDragStart) {
      onDragStart(task)
    }
  }

  const handleDragEnd = (e) => {
    if (onDragEnd) {
      onDragEnd()
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
    <div 
      className={`task-card-mini ${status} ${isDragging ? 'dragging' : ''}`}
      onClick={handleCardClick}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      draggable={true}
      style={{ borderLeftColor: getPriorityColor(priority) }}
    >
      <div className="task-mini-header">
        <div 
          className="priority-indicator"
          style={{ backgroundColor: getPriorityColor(priority) }}
          title={`${priority} priority`}
        />
        <span className="priority-text">{priority.toUpperCase()}</span>
      </div>

      <h4 className="task-mini-title">{title}</h4>
      
      <div className="drag-handle" title="Drag to move">
        <span>⋮⋮</span>
      </div>
    </div>
  )
}

export default TaskCard
