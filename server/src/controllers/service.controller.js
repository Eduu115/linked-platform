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
    const { category, title, description, features, price, period, popular } = req.body

    const newService = await prisma.service.create({
      data: {
        category,
        title,
        description,
        features,
        price: parseFloat(price),
        period,
        popular: popular || false,
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
    const { category, title, description, features, price, period, popular } = req.body

    const updatedService = await prisma.service.update({
      where: { id: parseInt(id) },
      data: {
        category,
        title,
        description,
        features,
        price: price !== undefined ? parseFloat(price) : undefined,
        period,
        popular,
      },
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
