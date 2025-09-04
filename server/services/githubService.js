import Commit from '../models/Commit.js'

class GitHubService {
  constructor() {
    this.baseURL = 'https://api.github.com'
  }

  // Parse GitHub repository URL to extract owner and repo name
  static parseRepoUrl(repoUrl) {
    if (!repoUrl) return null

    try {
      // Handle both https://github.com/owner/repo and git@github.com:owner/repo.git formats
      let cleanUrl = repoUrl.trim()
      
      if (cleanUrl.startsWith('git@github.com:')) {
        cleanUrl = cleanUrl.replace('git@github.com:', 'https://github.com/')
      }
      
      if (cleanUrl.endsWith('.git')) {
        cleanUrl = cleanUrl.slice(0, -4)
      }

      const url = new URL(cleanUrl)
      const pathParts = url.pathname.split('/').filter(part => part.length > 0)
      
      if (pathParts.length >= 2) {
        return {
          owner: pathParts[0],
          repo: pathParts[1]
        }
      }
    } catch (error) {
      console.error('Error parsing GitHub URL:', error)
    }
    
    return null
  }

  // Fetch commits from GitHub API
  async fetchCommits(owner, repo, options = {}) {
    const { since, until, per_page = 100, page = 1 } = options
    
    let url = `${this.baseURL}/repos/${owner}/${repo}/commits?per_page=${per_page}&page=${page}`
    
    if (since) url += `&since=${since}`
    if (until) url += `&until=${until}`

    try {
      console.log(`🔍 Fetching commits from: ${url}`)
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'DevTrack-App'
        }
      })

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Repository not found or not accessible')
        }
        if (response.status === 403) {
          throw new Error('API rate limit exceeded or repository is private')
        }
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
      }

      const commits = await response.json()
      console.log(`✅ Fetched ${commits.length} commits from GitHub`)
      
      return commits.map(commit => ({
        sha: commit.sha,
        message: commit.commit.message,
        author_name: commit.commit.author.name,
        author_email: commit.commit.author.email,
        date: commit.commit.author.date,
        url: commit.html_url,
        stats: commit.stats || {}
      }))
    } catch (error) {
      console.error('❌ Error fetching commits from GitHub:', error)
      throw error
    }
  }

  // Sync commits for a project
  async syncProjectCommits(project) {
    const { id: projectId, github_owner, github_repo_name } = project

    if (!github_owner || !github_repo_name) {
      throw new Error('GitHub repository information is missing')
    }

    try {
      // Get latest commit date from database to avoid duplicates
      const existingCommits = await Commit.findByProjectId(projectId, 1)
      const since = existingCommits.length > 0 
        ? new Date(existingCommits[0].commit_date).toISOString()
        : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() // Last 30 days

      console.log(`🔄 Syncing commits for ${github_owner}/${github_repo_name} since ${since}`)

      const commits = await this.fetchCommits(github_owner, github_repo_name, { since })
      
      let syncedCount = 0
      for (const commit of commits) {
        try {
          await Commit.create({
            project_id: projectId,
            commit_sha: commit.sha,
            commit_message: commit.message,
            author_name: commit.author_name,
            author_email: commit.author_email,
            commit_date: commit.date,
            files_changed: commit.stats?.total || 0,
            additions: commit.stats?.additions || 0,
            deletions: commit.stats?.deletions || 0,
            commit_url: commit.url
          })
          syncedCount++
        } catch (error) {
          // Skip duplicate commits
          if (!error.message.includes('duplicate key')) {
            console.error('Error saving commit:', error)
          }
        }
      }

      console.log(`✅ Synced ${syncedCount} new commits for project ${projectId}`)
      return { synced: syncedCount, total: commits.length }
    } catch (error) {
      console.error(`❌ Error syncing commits for project ${projectId}:`, error)
      throw error
    }
  }

  // Get repository information
  async getRepoInfo(owner, repo) {
    try {
      const response = await fetch(`${this.baseURL}/repos/${owner}/${repo}`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'DevTrack-App'
        }
      })

      if (!response.ok) {
        throw new Error(`Repository not found: ${response.status}`)
      }

      const repoData = await response.json()
      return {
        name: repoData.name,
        full_name: repoData.full_name,
        description: repoData.description,
        stars: repoData.stargazers_count,
        forks: repoData.forks_count,
        language: repoData.language,
        updated_at: repoData.updated_at,
        url: repoData.html_url
      }
    } catch (error) {
      console.error('Error fetching repo info:', error)
      throw error
    }
  }
}

export default new GitHubService()
