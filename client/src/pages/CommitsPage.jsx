import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchProjects } from '../redux/thunks/projectThunks'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { API_BASE_URL } from '../config/api'
import GitHubLogo from '../components/icons/GitHubLogo'
import '../styles/CommitsPage.css'

const CommitsPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { projects, isLoading } = useSelector(state => state.projects)
  
  const [commits, setCommits] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)
  const [isLoadingCommits, setIsLoadingCommits] = useState(false)
  const [syncLoading, setSyncLoading] = useState(false)

  useEffect(() => {
    dispatch(fetchProjects())
  }, [dispatch])

  const getAuthToken = () => {
    return localStorage.getItem('devtrack_token')
  }

  const fetchProjectCommits = async (projectId) => {
    setIsLoadingCommits(true)
    try {
      const token = getAuthToken()
      const response = await fetch(`${API_BASE_URL}/commits/project/${projectId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const commitData = await response.json()
        setCommits(commitData)
      } else {
        console.error('Failed to fetch commits')
        setCommits([])
      }
    } catch (error) {
      console.error('Error fetching commits:', error)
      setCommits([])
    } finally {
      setIsLoadingCommits(false)
    }
  }

  const syncProjectCommits = async (projectId) => {
    setSyncLoading(true)
    try {
      const token = getAuthToken()
      const response = await fetch(`${API_BASE_URL}/commits/project/${projectId}/sync`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const result = await response.json()
        console.log('✅ Sync successful:', result)
        // Refresh commits after sync
        fetchProjectCommits(projectId)
      } else {
        const error = await response.json()
        console.error('Sync failed:', error.message)
      }
    } catch (error) {
      console.error('Error syncing commits:', error)
    } finally {
      setSyncLoading(false)
    }
  }

  const handleProjectSelect = (project) => {
    setSelectedProject(project)
    if (project.github_owner && project.github_repo_name) {
      fetchProjectCommits(project.id)
    } else {
      setCommits([])
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const githubProjects = projects.filter(p => p.github_owner && p.github_repo_name)

  useEffect(() => {
    const first = projects.find(p => p.github_owner && p.github_repo_name)
    if (!selectedProject && first) {
      handleProjectSelect(first)
    }
  }, [projects, selectedProject])

  if (isLoading) {
    return <LoadingSpinner message="Loading projects..." />
  }

  return (
    <div className="commits-page app-page">
      <div className="app-page-card">
        <div className="app-page-head">
          <div>
            <h1 className="page-title-with-logo">
              <GitHubLogo size={22} />
              Commits
            </h1>
            <p>Track development progress across your repositories</p>
          </div>
        </div>

        {githubProjects.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <GitHubLogo size={32} />
            </div>
            <h3>No GitHub projects</h3>
            <p>Add a repository URL to a project to track commits</p>
            <button
              className="create-project-btn"
              onClick={() => navigate('/projects/create')}
            >
              Create project with GitHub
            </button>
          </div>
        ) : (
          <>
            <div className="project-pills">
              {githubProjects.map(project => (
                <button
                  key={project.id}
                  type="button"
                  className={`project-pill ${selectedProject?.id === project.id ? 'active' : ''}`}
                  onClick={() => handleProjectSelect(project)}
                >
                  <span
                    className="project-color"
                    style={{ backgroundColor: project.color }}
                  />
                  {project.name}
                </button>
              ))}
            </div>

            {selectedProject && (
              <div className="commits-container">
                <div className="commits-header">
                  <div className="commits-title">
                    <h3>{selectedProject.name}</h3>
                    <p>
                      <a
                        href={`https://github.com/${selectedProject.github_owner}/${selectedProject.github_repo_name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="repo-link"
                      >
                        {selectedProject.github_owner}/{selectedProject.github_repo_name}
                      </a>
                    </p>
                  </div>
                  <button
                    className="sync-button"
                    onClick={() => syncProjectCommits(selectedProject.id)}
                    disabled={syncLoading}
                  >
                    {syncLoading ? 'Syncing...' : 'Sync commits'}
                  </button>
                </div>

                <div className="commits-list">
                  {isLoadingCommits ? (
                    <div className="loading-commits">
                      <LoadingSpinner message="Loading commits..." />
                    </div>
                  ) : commits.length === 0 ? (
                    <div className="no-commits">
                      <p>No commits found. Sync to fetch from GitHub.</p>
                    </div>
                  ) : (
                    commits.map(commit => (
                      <div key={commit.id} className="commit-item">
                        <div className="commit-header">
                          <div className="commit-message">
                            {commit.commit_message.split('\n')[0]}
                          </div>
                          <div className="commit-date">
                            {formatDate(commit.commit_date)}
                          </div>
                        </div>
                        <div className="commit-details">
                          <div className="commit-author">
                            {commit.author_name}
                          </div>
                          <div className="commit-stats">
                            {commit.files_changed > 0 && (
                              <span className="stat-item">
                                {commit.files_changed} files
                              </span>
                            )}
                            {commit.additions > 0 && (
                              <span className="stat-item additions">
                                +{commit.additions}
                              </span>
                            )}
                            {commit.deletions > 0 && (
                              <span className="stat-item deletions">
                                -{commit.deletions}
                              </span>
                            )}
                          </div>
                          <div className="commit-sha">
                            <a
                              href={commit.commit_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="sha-link"
                            >
                              {commit.commit_sha.substring(0, 7)}
                            </a>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default CommitsPage
