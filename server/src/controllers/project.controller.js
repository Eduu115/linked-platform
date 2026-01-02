import prisma from '../config/database.js'
import { getFileUrl, deleteFile } from '../middleware/upload.middleware.js'

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
    // Parsear technologies si viene como string
    let technologies = req.body.technologies
    if (typeof technologies === 'string') {
      try {
        technologies = JSON.parse(technologies)
      } catch {
        technologies = technologies.split(',').map(t => t.trim()).filter(t => t)
      }
    }

    const { name, description, previewUrl, detailsUrl } = req.body
    
    // Si hay archivo subido, usar su URL, sino usar la URL proporcionada o la por defecto
    let imageUrl = req.body.image
    // Si image viene como array (FormData puede duplicar campos), tomar el primer valor
    if (Array.isArray(imageUrl)) {
      imageUrl = imageUrl[0]
    }
    if (req.file) {
      imageUrl = getFileUrl(req.file.filename, req)
    } else if (!imageUrl) {
      imageUrl = 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop'
    }

    const newProject = await prisma.project.create({
      data: {
        name,
        description,
        technologies,
        image: imageUrl,
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
    // Si hay error y se subió un archivo, eliminarlo
    if (req.file) {
      deleteFile(req.file.filename)
    }
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
    
    // Obtener proyecto actual para eliminar imagen anterior si se sube una nueva
    const currentProject = await prisma.project.findUnique({
      where: { id: parseInt(id) },
    })

    if (!currentProject) {
      if (req.file) deleteFile(req.file.filename)
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      })
    }

    // Parsear technologies si viene como string
    let technologies = req.body.technologies
    if (technologies !== undefined) {
      if (typeof technologies === 'string') {
        try {
          technologies = JSON.parse(technologies)
        } catch {
          technologies = technologies.split(',').map(t => t.trim()).filter(t => t)
        }
      }
    }

    const { name, description, previewUrl, detailsUrl } = req.body
    
    // Si hay archivo subido, usar su URL y eliminar la anterior
    let imageUrl = req.body.image
    // Si image viene como array (FormData puede duplicar campos), tomar el primer valor
    if (Array.isArray(imageUrl)) {
      imageUrl = imageUrl[0]
    }
    if (req.file) {
      // Eliminar imagen anterior si existe y no es una URL externa
      if (currentProject.image && !currentProject.image.startsWith('http')) {
        // Extraer el nombre del archivo de la URL
        const oldFilename = currentProject.image.split('/').pop()
        deleteFile(oldFilename)
      }
      imageUrl = getFileUrl(req.file.filename, req)
    } else if (imageUrl === undefined) {
      imageUrl = currentProject.image
    }

    const updateData = {}
    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (technologies !== undefined) updateData.technologies = technologies
    if (imageUrl !== undefined) updateData.image = imageUrl
    if (previewUrl !== undefined) updateData.previewUrl = previewUrl
    if (detailsUrl !== undefined) updateData.detailsUrl = detailsUrl

    const updatedProject = await prisma.project.update({
      where: { id: parseInt(id) },
      data: updateData,
    })

    res.json({
      success: true,
      message: 'Project updated successfully',
      project: updatedProject,
    })
  } catch (error) {
    if (req.file) deleteFile(req.file.filename)
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
