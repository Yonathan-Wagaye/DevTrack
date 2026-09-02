import pool from '../config/database.js'

class User {
  // Create a new user
  static async create(userData) {
    const { name, email, password } = userData
    
    const query = `
      INSERT INTO users (name, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, name, email, created_at
    `
    
    const values = [name, email, password]
    
    try {
      const result = await pool.query(query, values)
      return result.rows[0]
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`)
    }
  }

  // Find user by email
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1'
    
    try {
      const result = await pool.query(query, [email])
      return result.rows[0]
    } catch (error) {
      throw new Error(`Error finding user by email: ${error.message || error}`)
    }
  }

  // Find user by ID
  static async findById(id) {
    const query = 'SELECT * FROM users WHERE id = $1'
    
    try {
      const result = await pool.query(query, [id])
      return result.rows[0]
    } catch (error) {
      throw new Error(`Error finding user by ID: ${error.message}`)
    }
  }

  // Update user
  static async update(id, updates) {
    const allowedFields = ['name', 'email', 'password']
    const updateFields = []
    const values = []
    let valueIndex = 1

    for (const [field, value] of Object.entries(updates)) {
      if (allowedFields.includes(field)) {
        const column = field === 'password' ? 'password_hash' : field
        updateFields.push(`${column} = $${valueIndex}`)
        values.push(value)
        valueIndex++
      }
    }

    if (updateFields.length === 0) {
      throw new Error('No valid fields to update')
    }

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`)
    values.push(id)

    const query = `
      UPDATE users 
      SET ${updateFields.join(', ')}
      WHERE id = $${valueIndex}
      RETURNING id, name, email, created_at, updated_at
    `

    try {
      const result = await pool.query(query, values)
      return result.rows[0]
    } catch (error) {
      throw new Error(`Error updating user: ${error.message}`)
    }
  }

  // Delete user
  static async delete(id) {
    const query = 'DELETE FROM users WHERE id = $1 RETURNING *'
    
    try {
      const result = await pool.query(query, [id])
      return result.rows[0]
    } catch (error) {
      throw new Error(`Error deleting user: ${error.message}`)
    }
  }
}

export default User