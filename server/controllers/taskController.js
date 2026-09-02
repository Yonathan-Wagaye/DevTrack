import Task from '../models/Task.js'

// Create a new task
export const createTask = async (req, res) => {
  try {
    const { title, description, priority, status, projectId, dueDate, timeEstimate } = req.body

    // Validate required fields
    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Task title is required' })
    }

    // Validate priority
    const validPriorities = ['high', 'medium', 'low']
    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({ message: 'Invalid priority level' })
    }

    // Validate status
    const validStatuses = ['pending', 'in-progress', 'completed']
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' })
    }

    const taskData = {
      title: title.trim(),
      description: description?.trim() || null,
      priority: priority || 'medium',
      status: status || 'pending',
      project_id: projectId || null,
      due_date: dueDate || null,
      time_estimate: timeEstimate || null,
      user_email: req.user.email
    }

    const newTask = await Task.create(taskData)
    
    console.log('✅ Task created successfully:', newTask)
    res.status(201).json(newTask)
    
  } catch (error) {
    console.error('❌ Error creating task:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// Get all tasks for the authenticated user
export const getTasks = async (req, res) => {
  try {
    const userEmail = req.user.email
    const tasks = await Task.findByUserEmail(userEmail)
    
    console.log(`✅ Fetched ${tasks.length} tasks for user ${userEmail}`)
    res.status(200).json(tasks)
    
  } catch (error) {
    console.error('❌ Error fetching tasks:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// Get a single task
export const getTask = async (req, res) => {
  try {
    const { id } = req.params
    const userEmail = req.user.email

    const task = await Task.findByIdAndUserEmail(id, userEmail)
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }

    console.log('✅ Task fetched successfully:', task)
    res.status(200).json(task)
    
  } catch (error) {
    console.error('❌ Error fetching task:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// Update a task
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params
    const userEmail = req.user.email
    const updates = req.body

    // Check if task exists and belongs to user
    const existingTask = await Task.findByIdAndUserEmail(id, userEmail)
    if (!existingTask) {
      return res.status(404).json({ message: 'Task not found' })
    }

    // Validate priority if provided
    if (updates.priority) {
      const validPriorities = ['high', 'medium', 'low']
      if (!validPriorities.includes(updates.priority)) {
        return res.status(400).json({ message: 'Invalid priority level' })
      }
    }

    // Validate status if provided
    if (updates.status) {
      const validStatuses = ['pending', 'in-progress', 'completed']
      if (!validStatuses.includes(updates.status)) {
        return res.status(400).json({ message: 'Invalid status' })
      }
    }

    const updatedTask = await Task.updateByUserEmail(id, userEmail, updates)
    
    console.log('✅ Task updated successfully:', updatedTask)
    res.status(200).json(updatedTask)
    
  } catch (error) {
    console.error('❌ Error updating task:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// Delete a task
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params
    const userEmail = req.user.email

    // Check if task exists and belongs to user
    const existingTask = await Task.findByIdAndUserEmail(id, userEmail)
    if (!existingTask) {
      return res.status(404).json({ message: 'Task not found' })
    }

    const deletedTask = await Task.deleteByUserEmail(id, userEmail)
    
    console.log('✅ Task deleted successfully:', deletedTask)
    res.status(200).json({ message: 'Task deleted successfully' })
    
  } catch (error) {
    console.error('❌ Error deleting task:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// Get tasks by status
export const getTasksByStatus = async (req, res) => {
  try {
    const { status } = req.params
    const userEmail = req.user.email

    const validStatuses = ['pending', 'in-progress', 'completed']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' })
    }

    const tasks = await Task.findByStatusAndUserEmail(userEmail, status)
    
    console.log(`✅ Fetched ${tasks.length} ${status} tasks for user ${userEmail}`)
    res.status(200).json(tasks)
    
  } catch (error) {
    console.error('❌ Error fetching tasks by status:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// Get tasks by priority
export const getTasksByPriority = async (req, res) => {
  try {
    const { priority } = req.params
    const userEmail = req.user.email

    const validPriorities = ['high', 'medium', 'low']
    if (!validPriorities.includes(priority)) {
      return res.status(400).json({ message: 'Invalid priority' })
    }

    const tasks = await Task.findByPriorityAndUserEmail(userEmail, priority)
    
    console.log(`✅ Fetched ${tasks.length} ${priority} priority tasks for user ${userEmail}`)
    res.status(200).json(tasks)
    
  } catch (error) {
    console.error('❌ Error fetching tasks by priority:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}