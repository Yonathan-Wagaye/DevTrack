import React from 'react'
import { useNavigate } from 'react-router-dom'
import TaskForm from '../components/tasks/TaskForm'
import '../styles/CreateTaskPage.css'

const CreateTaskPage = () => {
  const navigate = useNavigate()

  const handleSuccess = () => {
    // Navigate back to dashboard after successful creation
    navigate('/dashboard')
  }

  const handleCancel = () => {
    // Navigate back to previous page
    navigate(-1)
  }

  return (
    <div className="create-task-page">
      <div className="page-header">
        <div className="header-content">
          <div className="header-text">
            <h1>Create New Task</h1>
            <p>Add a new task to your project</p>
          </div>
        </div>
      </div>
      
      <div className="page-content">
        <TaskForm 
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  )
}

export default CreateTaskPage
