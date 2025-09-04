import pool from '../config/database.js'

export const getDashboardStats = async (req, res) => {
  try {
    const userEmail = req.user.email
    
    // Get user ID first
    const userQuery = 'SELECT id FROM users WHERE email = $1'
    const userResult = await pool.query(userQuery, [userEmail])
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' })
    }
    
    const userId = userResult.rows[0].id
    
    // Get projects count
    const projectsQuery = `
      SELECT COUNT(*) as total_projects
      FROM projects p
      WHERE p.user_id = $1
    `
    
    // Get tasks statistics
    const tasksStatsQuery = `
      SELECT 
        COUNT(*) as total_tasks,
        COUNT(CASE WHEN t.status = 'pending' THEN 1 END) as pending_tasks,
        COUNT(CASE WHEN t.status = 'in-progress' THEN 1 END) as in_progress_tasks,
        COUNT(CASE WHEN t.status = 'completed' THEN 1 END) as completed_tasks
      FROM tasks t
      INNER JOIN projects p ON t.project_id = p.id
      WHERE p.user_id = $1
    `
    
    // Get recent projects (max 5)
    const recentProjectsQuery = `
      SELECT id, name, description, color, created_at
      FROM projects
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 5
    `
    
    // Get recent tasks (max 5)
    const recentTasksQuery = `
      SELECT t.id, t.title, t.status, t.priority, t.created_at, p.name as project_name
      FROM tasks t
      INNER JOIN projects p ON t.project_id = p.id
      WHERE p.user_id = $1
      ORDER BY t.created_at DESC
      LIMIT 5
    `
    
    // Execute all queries
    const [projectsResult, tasksStatsResult, recentProjectsResult, recentTasksResult] = await Promise.all([
      pool.query(projectsQuery, [userId]),
      pool.query(tasksStatsQuery, [userId]),
      pool.query(recentProjectsQuery, [userId]),
      pool.query(recentTasksQuery, [userId])
    ])
    
    // Format the response
    const stats = {
      projects: {
        total: parseInt(projectsResult.rows[0].total_projects)
      },
      tasks: {
        total: parseInt(tasksStatsResult.rows[0].total_tasks),
        pending: parseInt(tasksStatsResult.rows[0].pending_tasks),
        in_progress: parseInt(tasksStatsResult.rows[0].in_progress_tasks),
        completed: parseInt(tasksStatsResult.rows[0].completed_tasks)
      },
      recent_projects: recentProjectsResult.rows,
      recent_tasks: recentTasksResult.rows
    }
    
    console.log('✅ Dashboard stats fetched successfully for user:', userEmail)
    res.json(stats)
    
  } catch (error) {
    console.error('❌ Error fetching dashboard stats:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
