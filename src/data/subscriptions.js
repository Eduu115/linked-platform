// Datos temporales de suscripciones
export let subscriptions = [
  {
    id: 1,
    userId: 2, // cliente@example.com
    serviceId: 2, // Hosting con Dominio Custom
    status: 'active',
    startDate: '2024-01-01',
    endDate: '2024-02-01',
    price: 19.99,
    period: 'mes',
  },
  {
    id: 2,
    userId: 2,
    serviceId: 7, // Desarrollo Web
    status: 'active',
    startDate: '2024-01-15',
    endDate: null, // Sin fecha de fin (servicio puntual)
    price: 30,
    period: 'hora',
  },
]

export const getSubscriptionsByUserId = (userId) => {
  return subscriptions.filter((sub) => sub.userId === userId)
}

export const addSubscription = (subscription) => {
  const newSubscription = {
    id: subscriptions.length + 1,
    ...subscription,
  }
  subscriptions.push(newSubscription)
  return newSubscription
}

export const cancelSubscription = (subscriptionId) => {
  const subscription = subscriptions.find((sub) => sub.id === subscriptionId)
  if (subscription) {
    subscription.status = 'cancelled'
    return true
  }
  return false
}

