import React from 'react'
import { BrowserRouter, Routes, Route, Router } from 'react-router-dom'
import { useSelector } from 'react-redux'
import HomePage from './pages/HomePage'
import Navbar from './components/Navbar'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import LoginForm from './components/auth/LoginForm'
import RegisterForm from './components/auth/RegisterForm'
import Dashboard from './components/Dashboard'
import CreateTaskPage from './pages/CreateTaskPage'
import CreateProjectPage from './pages/CreateProjectPage'
import TasksPage from './pages/TasksPage'
import ProjectsPage from './pages/ProjectsPage'
import ProjectPage from './pages/ProjectPage'
import CommitsPage from './pages/CommitsPage'
import ProtectedRoute from './components/ProtectedRoute'
import useSession from './hooks/useSession'
import './App.css'

// Session wrapper component
function AppContent() {
  const { isLoading } = useSession()
  const { isLoading: authLoading, isAuthenticated, user } = useSelector(state => state.auth)

  console.log('🔍 AppContent Debug:', { isLoading, authLoading, isAuthenticated, user })

  if (isLoading || authLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className='App'>
      <Navbar />
                  <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={
            <ProtectedRoute redirectIfAuthenticated="/dashboard">
              <LoginForm />
            </ProtectedRoute>
          } />
          <Route path='/register' element={
            <ProtectedRoute redirectIfAuthenticated="/dashboard">
              <RegisterForm />
            </ProtectedRoute>
          } />
          <Route path='/dashboard' element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path='/tasks' element={
            <ProtectedRoute>
              <TasksPage />
            </ProtectedRoute>
          } />
          <Route path='/tasks/create' element={
            <ProtectedRoute>
              <CreateTaskPage />
            </ProtectedRoute>
          } />
          <Route path='/projects' element={
            <ProtectedRoute>
              <ProjectsPage />
            </ProtectedRoute>
          } />
          <Route path='/projects/create' element={
            <ProtectedRoute>
              <CreateProjectPage />
            </ProtectedRoute>
          } />
          <Route path='/projects/:id' element={
            <ProtectedRoute>
              <ProjectPage />
            </ProtectedRoute>
          } />
                              <Route path='/commits' element={
                      <ProtectedRoute>
                        <CommitsPage />
                      </ProtectedRoute>
                    } />
        </Routes>
    </div>
  )
}

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </Provider>
  )
}

export default App
