import Commit from '../models/Commit.js'
import Project from '../models/Project.js'
import GitHubService from '../services/githubService.js'
import pool from '../config/database.js'

// Get commits for a project
export const getProjectCommits = async (req, res) => {
  try {
    const { projectId } = req.params
    const { limit = 50 } = req.query
    const userEmail = req.user.email

    // Verify project belongs to user
    const project = await Project.findByIdWithTasks(parseInt(projectId), userEmail)
    if (!project) {
      return res.status(404).json({ message: 'Project not found' })
    }

    const commits = await Commit.findByProjectId(parseInt(projectId), parseInt(limit))
    
    console.log(`✅ Fetched ${commits.length} commits for project ${projectId}`)
    res.status(200).json(commits)
    
  } catch (error) {
    console.error('❌ Error fetching commits:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// Get commit statistics for a project
export const getProjectCommitStats = async (req, res) => {
  try {
    const { projectId } = req.params
    const { days = 30 } = req.query
    const userEmail = req.user.email

    // Verify project belongs to user
    const project = await Project.findByIdWithTasks(parseInt(projectId), userEmail)
    if (!project) {
      return res.status(404).json({ message: 'Project not found' })
    }

    const stats = await Commit.getProjectStats(parseInt(projectId), parseInt(days))
    const dailyActivity = await Commit.getDailyActivity(parseInt(projectId), parseInt(days))
    
    res.status(200).json({
      stats,
      dailyActivity
    })
    
  } catch (error) {
    console.error('❌ Error fetching commit stats:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// Sync commits from GitHub
export const syncProjectCommits = async (req, res) => {
  try {
    const { projectId } = req.params
    const userEmail = req.user.email

    // Get project with GitHub info
    const project = await Project.findByIdWithTasks(parseInt(projectId), userEmail)
    if (!project) {
      return res.status(404).json({ message: 'Project not found' })
    }

    if (!project.github_owner || !project.github_repo_name) {
      return res.status(400).json({ 
        message: 'Project does not have GitHub repository configured' 
      })
    }

    console.log(`🔄 Starting sync for project ${projectId}`)
    const result = await GitHubService.syncProjectCommits(project)
    
    res.status(200).json({
      message: `Successfully synced ${result.synced} commits`,
      synced: result.synced,
      total: result.total
    })
    
  } catch (error) {
    console.error('❌ Error syncing commits:', error)
    res.status(500).json({ 
      message: error.message.includes('GitHub') ? error.message : 'Internal server error' 
    })
  }
}

// Validate GitHub repository
export const validateGitHubRepo = async (req, res) => {
  try {
    const { repoUrl } = req.body

    if (!repoUrl) {
      return res.status(400).json({ message: 'Repository URL is required' })
    }

    const parsed = GitHubService.parseRepoUrl(repoUrl)
    if (!parsed) {
      return res.status(400).json({ message: 'Invalid GitHub repository URL' })
    }

    const repoInfo = await GitHubService.getRepoInfo(parsed.owner, parsed.repo)
    
    res.status(200).json({
      valid: true,
      owner: parsed.owner,
      repo: parsed.repo,
      info: repoInfo
    })
    
  } catch (error) {
    console.error('❌ Error validating GitHub repo:', error)
    res.status(400).json({ 
      valid: false,
      message: error.message.includes('not found') ? 'Repository not found or not accessible' : 'Invalid repository'
    })
  }
}

// Get all commits across projects for user
export const getUserCommits = async (req, res) => {
  try {
    const { limit = 100, days = 30 } = req.query
    const userEmail = req.user.email

    const query = `
      SELECT c.*, p.name as project_name, p.color as project_color
      FROM commits c
      JOIN projects p ON c.project_id = p.id
      JOIN users u ON p.user_id = u.id
      WHERE u.email = $1 
      AND c.commit_date >= NOW() - INTERVAL '${parseInt(days)} days'
      ORDER BY c.commit_date DESC
      LIMIT $2
    `

    const result = await pool.query(query, [userEmail, parseInt(limit)])
    
    res.status(200).json(result.rows)
    
  } catch (error) {
    console.error('❌ Error fetching user commits:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
