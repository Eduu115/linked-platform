import prisma from '../config/database.js'

export const getServices = async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    res.json({
      success: true,
      services,
      count: services.length,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching services',
      error: error.message,
    })
  }
}

export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params

    const service = await prisma.service.findUnique({
      where: { id: parseInt(id) },
    })

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      })
    }

    res.json({
      success: true,
      service,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching service',
      error: error.message,
    })
  }
}

export const createService = async (req, res) => {
  try {
    // Parsear features si viene como string
    let features = req.body.features
    if (typeof features === 'string') {
      try {
        features = JSON.parse(features)
      } catch {
        features = features.split('\n').map(f => f.trim()).filter(f => f)
      }
    }

    const { category, title, description, price, period, popular } = req.body

    const newService = await prisma.service.create({
      data: {
        category,
        title,
        description,
        features,
        price: parseFloat(price),
        period,
        popular: popular === 'true' || popular === true,
      },
    })

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      service: newService,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating service',
      error: error.message,
    })
  }
}

export const updateService = async (req, res) => {
  try {
    const { id } = req.params
    
    // Obtener servicio actual
    const currentService = await prisma.service.findUnique({
      where: { id: parseInt(id) },
    })

    if (!currentService) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      })
    }

    // Parsear features si viene como string
    let features = req.body.features
    if (features !== undefined) {
      if (typeof features === 'string') {
        try {
          features = JSON.parse(features)
        } catch {
          features = features.split('\n').map(f => f.trim()).filter(f => f)
        }
      }
    }

    const { category, title, description, price, period, popular } = req.body

    const updateData = {}
    if (category !== undefined) updateData.category = category
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (features !== undefined) updateData.features = features
    if (price !== undefined) updateData.price = parseFloat(price)
    if (period !== undefined) updateData.period = period
    if (popular !== undefined) updateData.popular = popular === 'true' || popular === true

    const updatedService = await prisma.service.update({
      where: { id: parseInt(id) },
      data: updateData,
    })

    res.json({
      success: true,
      message: 'Service updated successfully',
      service: updatedService,
    })
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      })
    }
    res.status(500).json({
      success: false,
      message: 'Error updating service',
      error: error.message,
    })
  }
}

export const deleteService = async (req, res) => {
  try {
    const { id } = req.params

    await prisma.service.delete({
      where: { id: parseInt(id) },
    })

    res.json({
      success: true,
      message: 'Service deleted successfully',
    })
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      })
    }
    res.status(500).json({
      success: false,
      message: 'Error deleting service',
      error: error.message,
    })
  }
}
