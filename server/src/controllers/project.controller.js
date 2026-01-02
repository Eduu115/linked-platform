import prisma from '../config/database.js'

export const getProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    res.json({
      success: true,
      projects,
      count: projects.length,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching projects',
      error: error.message,
    })
  }
}

export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params

    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) },
    })

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      })
    }

    res.json({
      success: true,
      project,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching project',
      error: error.message,
    })
  }
}

export const createProject = async (req, res) => {
  try {
    const { name, description, technologies, image, previewUrl, detailsUrl } = req.body

    const newProject = await prisma.project.create({
      data: {
        name,
        description,
        technologies,
        image: image || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
        previewUrl,
        detailsUrl: detailsUrl || `/projects/${name.toLowerCase().replace(/\s+/g, '-')}`,
      },
    })

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      project: newProject,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating project',
      error: error.message,
    })
  }
}

export const updateProject = async (req, res) => {
  try {
    const { id } = req.params
    const { name, description, technologies, image, previewUrl, detailsUrl } = req.body

    const updatedProject = await prisma.project.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        technologies,
        image,
        previewUrl,
        detailsUrl,
      },
    })

    res.json({
      success: true,
      message: 'Project updated successfully',
      project: updatedProject,
    })
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      })
    }
    res.status(500).json({
      success: false,
      message: 'Error updating project',
      error: error.message,
    })
  }
}

export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params

    await prisma.project.delete({
      where: { id: parseInt(id) },
    })

    res.json({
      success: true,
      message: 'Project deleted successfully',
    })
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      })
    }
    res.status(500).json({
      success: false,
      message: 'Error deleting project',
      error: error.message,
    })
  }
}
