import pool from '../config/database.js'

class Project {
  // Create a new project
  static async create(projectData) {
    const { name, description, color, user_email, github_repo_url, github_owner, github_repo_name } = projectData
    
    // First, get the user ID from the email
    const userQuery = 'SELECT id FROM users WHERE email = $1'
    const userResult = await pool.query(userQuery, [user_email])
    
    if (userResult.rows.length === 0) {
      throw new Error('User not found')
    }
    
    const user_id = userResult.rows[0].id
    
    const query = `
      INSERT INTO projects (name, description, color, user_id, github_repo_url, github_owner, github_repo_name)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `
    
    const values = [name, description, color || '#3498db', user_id, github_repo_url, github_owner, github_repo_name]
    
    try {
      const result = await pool.query(query, values)
      return result.rows[0]
    } catch (error) {
      throw new Error(`Error creating project: ${error.message}`)
    }
  }

  // Get all projects for a user with task counts
  static async findByUserEmail(userEmail) {
    const query = `
      SELECT 
        p.*,
        COUNT(t.id) as task_count,
        COUNT(CASE WHEN t.status = 'completed' THEN 1 END) as completed_tasks,
        COUNT(CASE WHEN t.status = 'pending' THEN 1 END) as pending_tasks,
        COUNT(CASE WHEN t.status = 'in-progress' THEN 1 END) as in_progress_tasks
      FROM projects p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN tasks t ON p.id = t.project_id
      WHERE u.email = $1
      GROUP BY p.id, p.name, p.description, p.color, p.user_id, p.created_at, p.updated_at
      ORDER BY p.created_at DESC
    `
    
    try {
      const result = await pool.query(query, [userEmail])
      return result.rows
    } catch (error) {
      throw new Error(`Error fetching projects: ${error.message}`)
    }
  }

  // Get a single project with its tasks
  static async findByIdWithTasks(projectId, userEmail) {
    const projectQuery = `
      SELECT p.* FROM projects p
      LEFT JOIN users u ON p.user_id = u.id
      WHERE p.id = $1 AND u.email = $2
    `
    
    const tasksQuery = `
      SELECT t.* FROM tasks t
      LEFT JOIN projects p ON t.project_id = p.id
      LEFT JOIN users u ON p.user_id = u.id
      WHERE p.id = $1 AND u.email = $2
      ORDER BY t.created_at DESC
    `
    
    try {
      const [projectResult, tasksResult] = await Promise.all([
        pool.query(projectQuery, [projectId, userEmail]),
        pool.query(tasksQuery, [projectId, userEmail])
      ])
      
      if (projectResult.rows.length === 0) {
        return null
      }
      
      return {
        ...projectResult.rows[0],
        tasks: tasksResult.rows
      }
    } catch (error) {
      throw new Error(`Error fetching project: ${error.message}`)
    }
  }

  // Update project
  static async update(projectId, updateData, userEmail) {
    const { name, description, color, github_repo_url, github_owner, github_repo_name } = updateData
    
    const query = `
      UPDATE projects 
      SET name = $1, description = $2, color = $3, github_repo_url = $4, github_owner = $5, github_repo_name = $6, updated_at = CURRENT_TIMESTAMP
      FROM users u
      WHERE projects.id = $7 AND projects.user_id = u.id AND u.email = $8
      RETURNING projects.*
    `
    
    const values = [name, description, color, github_repo_url, github_owner, github_repo_name, projectId, userEmail]
    
    try {
      const result = await pool.query(query, values)
      return result.rows[0]
    } catch (error) {
      throw new Error(`Error updating project: ${error.message}`)
    }
  }

  // Delete project
  static async delete(projectId, userEmail) {
    const query = `
      DELETE FROM projects 
      USING users u
      WHERE projects.id = $1 AND projects.user_id = u.id AND u.email = $2
      RETURNING projects.*
    `
    
    try {
      const result = await pool.query(query, [projectId, userEmail])
      return result.rows[0]
    } catch (error) {
      throw new Error(`Error deleting project: ${error.message}`)
    }
  }
}

export default Project
