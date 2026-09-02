import Project from '../models/Project.js'

// Create a new project
export const createProject = async (req, res) => {
  try {
    const { name, description, color, github_repo_url } = req.body

    // Validate required fields
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Project name is required' })
    }

    // Parse GitHub URL if provided
    let github_owner = null
    let github_repo_name = null
    
    if (github_repo_url) {
      const { default: gitHubService } = await import('../services/githubService.js')
      const parsed = gitHubService.parseRepoUrl(github_repo_url)
      if (parsed) {
        github_owner = parsed.owner
        github_repo_name = parsed.repo
      }
    }

    const projectData = {
      name: name.trim(),
      description: description?.trim() || null,
      color: color || '#3498db',
      user_email: req.user.email,
      github_repo_url: github_repo_url?.trim() || null,
      github_owner,
      github_repo_name
    }

    const newProject = await Project.create(projectData)
    
    console.log('✅ Project created successfully:', newProject)
    res.status(201).json(newProject)
    
  } catch (error) {
    console.error('❌ Error creating project:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// Get all projects for the authenticated user
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.findByUserEmail(req.user.email)
    
    console.log(`✅ Found ${projects.length} projects for user: ${req.user.email}`)
    res.json(projects)
    
  } catch (error) {
    console.error('❌ Error fetching projects:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// Get a single project with tasks
export const getProject = async (req, res) => {
  try {
    const { id } = req.params
    
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ message: 'Valid project ID is required' })
    }

    const project = await Project.findByIdWithTasks(parseInt(id), req.user.email)
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' })
    }
    
    console.log(`✅ Found project: ${project.name} with ${project.tasks.length} tasks`)
    res.json(project)
    
  } catch (error) {
    console.error('❌ Error fetching project:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// Update project
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params
    const { name, description, color, github_repo_url } = req.body

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ message: 'Valid project ID is required' })
    }

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Project name is required' })
    }

    // Parse GitHub URL if provided
    let github_owner = null
    let github_repo_name = null
    
    if (github_repo_url) {
      const { default: gitHubService } = await import('../services/githubService.js')
      const parsed = gitHubService.parseRepoUrl(github_repo_url)
      if (parsed) {
        github_owner = parsed.owner
        github_repo_name = parsed.repo
      }
    }

    const updateData = {
      name: name.trim(),
      description: description?.trim() || null,
      color: color || '#3498db',
      github_repo_url: github_repo_url?.trim() || null,
      github_owner,
      github_repo_name
    }

    const updatedProject = await Project.update(parseInt(id), updateData, req.user.email)
    
    if (!updatedProject) {
      return res.status(404).json({ message: 'Project not found' })
    }
    
    console.log('✅ Project updated successfully:', updatedProject)
    res.json(updatedProject)
    
  } catch (error) {
    console.error('❌ Error updating project:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

// Delete project
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ message: 'Valid project ID is required' })
    }

    const deletedProject = await Project.delete(parseInt(id), req.user.email)
    
    if (!deletedProject) {
      return res.status(404).json({ message: 'Project not found' })
    }
    
    console.log('✅ Project deleted successfully:', deletedProject.name)
    res.json({ message: 'Project deleted successfully' })
    
  } catch (error) {
    console.error('❌ Error deleting project:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
