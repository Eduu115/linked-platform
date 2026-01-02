import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { subscriptionsAPI, servicesAPI } from '../services/api'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const ClientDashboard = () => {
  const { user } = useAuth()
  const [subscriptions, setSubscriptions] = useState([])
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subscriptionsData, servicesData] = await Promise.all([
          subscriptionsAPI.getMySubscriptions(),
          servicesAPI.getAll(),
        ])
        setSubscriptions(Array.isArray(subscriptionsData) ? subscriptionsData : [])
        setServices(Array.isArray(servicesData) ? servicesData : [])
      } catch (error) {
        console.error('Error fetching data:', error)
        setSubscriptions([])
        setServices([])
      } finally {
        setLoading(false)
      }
    }
    if (user) {
      fetchData()
    }
  }, [user])

  const handleCancelSubscription = async (subscriptionId) => {
    if (window.confirm('¿Estás seguro de que quieres cancelar esta suscripción?')) {
      try {
        await subscriptionsAPI.cancel(subscriptionId)
        // Actualizar suscripciones
        const updated = await subscriptionsAPI.getMySubscriptions()
        setSubscriptions(Array.isArray(updated) ? updated : [])
      } catch (error) {
        console.error('Error canceling subscription:', error)
        alert('Error al cancelar la suscripción')
      }
    }
  }

  const getServiceById = (serviceId) => {
    return services.find((service) => service.id === serviceId)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha de fin'
    return new Date(dateString).toLocaleDateString('es-ES')
  }

  return (
    <div className="pt-20 md:pt-32 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Mi Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Bienvenido, {user?.name}
          </p>
        </motion.div>

        {/* Información del Usuario */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Información Personal
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Nombre</p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">{user?.name || 'No especificado'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">{user?.email || 'No especificado'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Teléfono</p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">{user?.phone || 'No especificado'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Dirección</p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">{user?.address || 'No especificada'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Ciudad</p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">{user?.city || 'No especificada'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Código Postal</p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">{user?.postalCode || 'No especificado'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">País</p>
              <p className="text-lg font-medium text-gray-900 dark:text-white">{user?.country || 'No especificado'}</p>
            </div>
            {user?.company && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Empresa</p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">{user.company}</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Suscripciones Activas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Mis Suscripciones
            </h2>
            <Link
              to="/services"
              className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              Ver Servicios
            </Link>
          </div>

          {loading ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
              <p className="text-gray-600 dark:text-gray-400">Cargando suscripciones...</p>
            </div>
          ) : subscriptions.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No tienes suscripciones activas
              </p>
              <Link
                to="/services"
                className="inline-block px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
              >
                Explorar Servicios
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subscriptions.map((subscription) => {
                const service = getServiceById(subscription.serviceId)
                if (!service) return null

                return (
                  <div
                    key={subscription.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-gray-900 dark:border-white"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                          {service.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {service.category}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          subscription.status === 'active'
                            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                            : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                        }`}
                      >
                        {subscription.status === 'active' ? 'Activa' : 'Cancelada'}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Precio:</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          €{subscription.price}/{subscription.period}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Inicio:
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatDate(subscription.startDate)}
                        </span>
                      </div>
                      {subscription.endDate && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Fin:
                          </span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatDate(subscription.endDate)}
                          </span>
                        </div>
                      )}
                    </div>

                    {subscription.status === 'active' && (
                      <button
                        onClick={() => handleCancelSubscription(subscription.id)}
                        className="w-full px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg font-medium hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                      >
                        Cancelar Suscripción
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default ClientDashboard

