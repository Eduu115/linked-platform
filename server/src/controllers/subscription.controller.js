import prisma from '../config/database.js'

export const getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await prisma.subscription.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        service: {
          select: {
            id: true,
            title: true,
            category: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    res.json({
      success: true,
      subscriptions,
      count: subscriptions.length,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching subscriptions',
      error: error.message,
    })
  }
}

export const getSubscriptionById = async (req, res) => {
  try {
    const { id } = req.params

    const subscription = await prisma.subscription.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        service: true,
      },
    })

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found',
      })
    }

    res.json({
      success: true,
      subscription,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching subscription',
      error: error.message,
    })
  }
}

export const getUserSubscriptions = async (req, res) => {
  try {
    const subscriptions = await prisma.subscription.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        service: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    res.json({
      success: true,
      subscriptions,
      count: subscriptions.length,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user subscriptions',
      error: error.message,
    })
  }
}

export const createSubscription = async (req, res) => {
  try {
    const { serviceId } = req.body

    // Verificar que el servicio existe
    const service = await prisma.service.findUnique({
      where: { id: parseInt(serviceId) },
    })

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      })
    }

    // Calcular fecha de fin según el período
    let endDate = null
    if (service.period === 'mes') {
      endDate = new Date()
      endDate.setMonth(endDate.getMonth() + 1)
    }

    const newSubscription = await prisma.subscription.create({
      data: {
        userId: req.user.id,
        serviceId: parseInt(serviceId),
        status: 'active',
        startDate: new Date(),
        endDate,
        price: service.price,
        period: service.period,
      },
      include: {
        service: true,
      },
    })

    res.status(201).json({
      success: true,
      message: 'Subscription created successfully',
      subscription: newSubscription,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating subscription',
      error: error.message,
    })
  }
}

export const cancelSubscription = async (req, res) => {
  try {
    const { id } = req.params

    const subscription = await prisma.subscription.findUnique({
      where: { id: parseInt(id) },
    })

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found',
      })
    }

    // Verificar que la suscripción pertenece al usuario
    if (subscription.userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You can only cancel your own subscriptions',
      })
    }

    const updatedSubscription = await prisma.subscription.update({
      where: { id: parseInt(id) },
      data: {
        status: 'cancelled',
        cancelledAt: new Date(),
      },
      include: {
        service: true,
      },
    })

    res.json({
      success: true,
      message: 'Subscription cancelled successfully',
      subscription: updatedSubscription,
    })
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found',
      })
    }
    res.status(500).json({
      success: false,
      message: 'Error cancelling subscription',
      error: error.message,
    })
  }
}
