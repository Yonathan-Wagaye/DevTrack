import pool from '../config/database.js'

class Commit {
  // Create a new commit record
  static async create(commitData) {
    const { 
      project_id, 
      commit_sha, 
      commit_message, 
      author_name, 
      author_email, 
      commit_date, 
      files_changed = 0, 
      additions = 0, 
      deletions = 0, 
      commit_url 
    } = commitData
    
    const query = `
      INSERT INTO commits (
        project_id, commit_sha, commit_message, author_name, author_email, 
        commit_date, files_changed, additions, deletions, commit_url
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (commit_sha) DO UPDATE SET
        commit_message = EXCLUDED.commit_message,
        files_changed = EXCLUDED.files_changed,
        additions = EXCLUDED.additions,
        deletions = EXCLUDED.deletions,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `
    
    const values = [
      project_id, commit_sha, commit_message, author_name, author_email,
      commit_date, files_changed, additions, deletions, commit_url
    ]
    
    try {
      const result = await pool.query(query, values)
      return result.rows[0]
    } catch (error) {
      throw new Error(`Error creating commit: ${error.message}`)
    }
  }

  // Get commits for a project
  static async findByProjectId(projectId, limit = 50) {
    const query = `
      SELECT * FROM commits 
      WHERE project_id = $1 
      ORDER BY commit_date DESC 
      LIMIT $2
    `
    
    try {
      const result = await pool.query(query, [projectId, limit])
      return result.rows
    } catch (error) {
      throw new Error(`Error fetching commits: ${error.message}`)
    }
  }

  // Get commit statistics for a project
  static async getProjectStats(projectId, days = 30) {
    const query = `
      SELECT 
        COUNT(*) as total_commits,
        COUNT(DISTINCT author_email) as unique_authors,
        SUM(additions) as total_additions,
        SUM(deletions) as total_deletions,
        AVG(files_changed) as avg_files_changed
      FROM commits 
      WHERE project_id = $1 
      AND commit_date >= NOW() - INTERVAL '${days} days'
    `
    
    try {
      const result = await pool.query(query, [projectId])
      return result.rows[0]
    } catch (error) {
      throw new Error(`Error fetching commit stats: ${error.message}`)
    }
  }

  // Get daily commit activity for charts
  static async getDailyActivity(projectId, days = 30) {
    const query = `
      SELECT 
        DATE(commit_date) as date,
        COUNT(*) as commits_count,
        SUM(additions) as daily_additions,
        SUM(deletions) as daily_deletions
      FROM commits 
      WHERE project_id = $1 
      AND commit_date >= NOW() - INTERVAL '${days} days'
      GROUP BY DATE(commit_date)
      ORDER BY date DESC
    `
    
    try {
      const result = await pool.query(query, [projectId])
      return result.rows
    } catch (error) {
      throw new Error(`Error fetching daily activity: ${error.message}`)
    }
  }

  // Delete commits for a project (when project is deleted)
  static async deleteByProjectId(projectId) {
    const query = `DELETE FROM commits WHERE project_id = $1`
    
    try {
      const result = await pool.query(query, [projectId])
      return result.rowCount
    } catch (error) {
      throw new Error(`Error deleting commits: ${error.message}`)
    }
  }
}

export default Commit
