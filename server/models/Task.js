import pool from '../config/database.js'

class Task {
  // Create a new task
  static async create(taskData) {
    const { title, description, priority, status, project_id, due_date, time_estimate, user_email } = taskData
    
    // First, get the user ID from the email
    const userQuery = 'SELECT id FROM users WHERE email = $1'
    const userResult = await pool.query(userQuery, [user_email])
    
    if (userResult.rows.length === 0) {
      throw new Error('User not found')
    }
    
    const user_id = userResult.rows[0].id
    
    const query = `
      INSERT INTO tasks (title, description, priority, status, project_id, due_date, time_estimate, user_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `
    
    const values = [title, description, priority, status, project_id, due_date, time_estimate, user_id]
    
    try {
      const result = await pool.query(query, values)
      return result.rows[0]
    } catch (error) {
      throw new Error(`Error creating task: ${error.message}`)
    }
  }

  // Get all tasks for a user by email
  static async findByUserEmail(userEmail) {
    const query = `
      SELECT t.* FROM tasks t
      JOIN users u ON t.user_id = u.id
      WHERE u.email = $1 
      ORDER BY t.created_at DESC
    `
    
    try {
      const result = await pool.query(query, [userEmail])
      return result.rows
    } catch (error) {
      throw new Error(`Error fetching tasks: ${error.message}`)
    }
  }

  // Get all tasks for a user (deprecated - use findByUserEmail)
  static async findByUserId(userId) {
    const query = `
      SELECT * FROM tasks 
      WHERE user_id = $1 
      ORDER BY created_at DESC
    `
    
    try {
      const result = await pool.query(query, [userId])
      return result.rows
    } catch (error) {
      throw new Error(`Error fetching tasks: ${error.message}`)
    }
  }

  // Get a single task by ID and user email
  static async findByIdAndUserEmail(taskId, userEmail) {
    const query = `
      SELECT t.* FROM tasks t
      JOIN users u ON t.user_id = u.id
      WHERE t.id = $1 AND u.email = $2
    `
    
    try {
      const result = await pool.query(query, [taskId, userEmail])
      return result.rows[0]
    } catch (error) {
      throw new Error(`Error fetching task: ${error.message}`)
    }
  }

  // Get a single task by ID (deprecated - use findByIdAndUserEmail)
  static async findById(taskId, userId) {
    const query = `
      SELECT * FROM tasks 
      WHERE id = $1 AND user_id = $2
    `
    
    try {
      const result = await pool.query(query, [taskId, userId])
      return result.rows[0]
    } catch (error) {
      throw new Error(`Error fetching task: ${error.message}`)
    }
  }

  // Update a task
  static async update(taskId, userId, updates) {
    const allowedFields = ['title', 'description', 'priority', 'status', 'project_id', 'due_date', 'time_estimate']
    const updateFields = []
    const values = []
    let valueIndex = 1

    // Build dynamic update query
    for (const [field, value] of Object.entries(updates)) {
      if (allowedFields.includes(field)) {
        updateFields.push(`${field} = $${valueIndex}`)
        values.push(value)
        valueIndex++
      }
    }

    if (updateFields.length === 0) {
      throw new Error('No valid fields to update')
    }

    // Add updated_at timestamp
    updateFields.push(`updated_at = CURRENT_TIMESTAMP`)
    
    // Add WHERE clause values
    values.push(taskId, userId)

    const query = `
      UPDATE tasks 
      SET ${updateFields.join(', ')}
      WHERE id = $${valueIndex} AND user_id = $${valueIndex + 1}
      RETURNING *
    `

    try {
      const result = await pool.query(query, values)
      return result.rows[0]
    } catch (error) {
      throw new Error(`Error updating task: ${error.message}`)
    }
  }

  // Update a task by user email
  static async updateByUserEmail(taskId, userEmail, updates) {
    const allowedFields = ['title', 'description', 'priority', 'status', 'project_id', 'due_date', 'time_estimate']
    const updateFields = []
    const values = []
    let valueIndex = 1

    // Build dynamic update query
    for (const [field, value] of Object.entries(updates)) {
      if (allowedFields.includes(field)) {
        updateFields.push(`${field} = $${valueIndex}`)
        values.push(value)
        valueIndex++
      }
    }

    if (updateFields.length === 0) {
      throw new Error('No valid fields to update')
    }

    // Add updated_at timestamp
    updateFields.push(`updated_at = CURRENT_TIMESTAMP`)
    
    // Add WHERE clause values
    values.push(taskId, userEmail)

    const query = `
      UPDATE tasks 
      SET ${updateFields.join(', ')}
      FROM users u
      WHERE tasks.id = $${valueIndex} AND tasks.user_id = u.id AND u.email = $${valueIndex + 1}
      RETURNING tasks.*
    `

    try {
      const result = await pool.query(query, values)
      return result.rows[0]
    } catch (error) {
      throw new Error(`Error updating task: ${error.message}`)
    }
  }

  // Delete a task by user email
  static async deleteByUserEmail(taskId, userEmail) {
    const query = `
      DELETE FROM tasks 
      USING users u
      WHERE tasks.id = $1 AND tasks.user_id = u.id AND u.email = $2
      RETURNING tasks.*
    `
    
    try {
      const result = await pool.query(query, [taskId, userEmail])
      return result.rows[0]
    } catch (error) {
      throw new Error(`Error deleting task: ${error.message}`)
    }
  }

  // Delete a task (deprecated - use deleteByUserEmail)
  static async delete(taskId, userId) {
    const query = `
      DELETE FROM tasks 
      WHERE id = $1 AND user_id = $2
      RETURNING *
    `
    
    try {
      const result = await pool.query(query, [taskId, userId])
      return result.rows[0]
    } catch (error) {
      throw new Error(`Error deleting task: ${error.message}`)
    }
  }

  // Get tasks by status and user email
  static async findByStatusAndUserEmail(userEmail, status) {
    const query = `
      SELECT t.* FROM tasks t
      JOIN users u ON t.user_id = u.id
      WHERE u.email = $1 AND t.status = $2
      ORDER BY t.created_at DESC
    `
    
    try {
      const result = await pool.query(query, [userEmail, status])
      return result.rows
    } catch (error) {
      throw new Error(`Error fetching tasks by status: ${error.message}`)
    }
  }

  // Get tasks by priority and user email
  static async findByPriorityAndUserEmail(userEmail, priority) {
    const query = `
      SELECT t.* FROM tasks t
      JOIN users u ON t.user_id = u.id
      WHERE u.email = $1 AND t.priority = $2
      ORDER BY t.created_at DESC
    `
    
    try {
      const result = await pool.query(query, [userEmail, priority])
      return result.rows
    } catch (error) {
      throw new Error(`Error fetching tasks by priority: ${error.message}`)
    }
  }

  // Get tasks by status (deprecated - use findByStatusAndUserEmail)
  static async findByStatus(userId, status) {
    const query = `
      SELECT * FROM tasks 
      WHERE user_id = $1 AND status = $2
      ORDER BY created_at DESC
    `
    
    try {
      const result = await pool.query(query, [userId, status])
      return result.rows
    } catch (error) {
      throw new Error(`Error fetching tasks by status: ${error.message}`)
    }
  }

  // Get tasks by priority (deprecated - use findByPriorityAndUserEmail)
  static async findByPriority(userId, priority) {
    const query = `
      SELECT * FROM tasks 
      WHERE user_id = $1 AND priority = $2
      ORDER BY created_at DESC
    `
    
    try {
      const result = await pool.query(query, [userId, priority])
      return result.rows
    } catch (error) {
      throw new Error(`Error fetching tasks by priority: ${error.message}`)
    }
  }
}

export default Task