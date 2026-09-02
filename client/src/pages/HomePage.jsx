import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { GitHubLogo, TaskIcon, ChartIcon, ClockIcon, FolderIcon, UserIcon, DevTrackLogo } from '../components/icons/Icons'
import '../styles/HomePage.css'

const HomePage = () => {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useSelector(state => state.auth)

  console.log('🏠 HomePage Debug:', { isAuthenticated, user })

  // Redirect authenticated users to dashboard
  useEffect(() => {
    console.log('🔄 HomePage useEffect triggered:', { isAuthenticated, user })
    if (isAuthenticated && user) {
      console.log('🚀 Redirecting to dashboard...')
      navigate('/dashboard')
    }
  }, [isAuthenticated, user, navigate])

  // If user is authenticated, show loading (will redirect)
  if (isAuthenticated && user) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Redirecting to dashboard...</p>
      </div>
    )
  }

  // Show landing page for non-authenticated users
  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Track Your Development Productivity
          </h1>
          <p className="hero-subtitle">
            Manage tasks, track commits, monitor work hours, and visualize your coding progress. 
            Built for developers, freelancers, and remote teams.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary hero-btn">
              Get Started
            </Link>
            <Link to="/login" className="btn btn-outline hero-btn">
              Sign In
            </Link>
          </div>
         
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose DevTrack?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <TaskIcon size={20} />
              </div>
              <h3>Task Management</h3>
              <p>Create, organize, and track development tasks with ease. Assign priorities, set due dates, and monitor progress across projects.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <ChartIcon size={20} />
              </div>
              <h3>Progress Tracking</h3>
              <p>Visualize your productivity with charts and analytics. See how your tasks and commits contribute to project completion.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <GitHubLogo size={20} />
              </div>
              <h3>GitHub</h3>
              <p>Automatically track your commits and coding activity. Connect your repositories and see your contribution history.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <ClockIcon size={20} />
              </div>
              <h3>Time Tracking</h3>
              <p>Perfect for freelancers and remote workers. Track time spent on tasks and projects for accurate billing and productivity insights.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">
                <UserIcon size={20} />
              </div>
              <h3>Sign Up</h3>
              <p>Create your account in seconds. No complex setup required.</p>
            </div>
            
            <div className="step-card">
              <div className="step-number">
                <FolderIcon size={20} />
              </div>
              <h3>Add Projects</h3>
              <p>Create projects and connect your GitHub repositories for automatic commit tracking.</p>
            </div>
            
            <div className="step-card">
              <div className="step-number">
                <TaskIcon size={20} />
              </div>
              <h3>Start Tracking</h3>
              <p>Add tasks, track time, and watch your productivity metrics grow.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <h3>
                <DevTrackLogo size={22} />
                DevTrack
              </h3>
              <p>Your personal development productivity companion</p>
            </div>
            
            <div className="footer-links">
              <div className="footer-section">
                <h4>Product</h4>
                <ul>
                  <li><a href="/features">Features</a></li>
                  <li><a href="/pricing">Pricing</a></li>
                  <li><a href="/roadmap">Roadmap</a></li>
                </ul>
              </div>
              
              <div className="footer-section">
                <h4>Company</h4>
                <ul>
                  <li><a href="/about">About</a></li>
                  <li><a href="/contact">Contact</a></li>
                  <li><a href="/blog">Blog</a></li>
                </ul>
              </div>
              
              <div className="footer-section">
                <h4>Legal</h4>
                <ul>
                  <li><a href="/privacy">Privacy Policy</a></li>
                  <li><a href="/terms">Terms of Service</a></li>
                  <li><a href="/cookies">Cookie Policy</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2025 DevTrack. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage