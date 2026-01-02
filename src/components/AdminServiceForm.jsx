import { useState, useEffect } from 'react'
import { servicesAPI } from '../services/api'
import { motion } from 'framer-motion'

const AdminServiceForm = () => {
  const [showForm, setShowForm] = useState(false)
  const [editingService, setEditingService] = useState(null)
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    category: 'Hosting',
    title: '',
    description: '',
    features: '',
    price: '',
    period: 'mes',
    popular: false,
  })
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const categories = ['Hosting', 'Cloud Storage', 'Clases', 'Consultoría']

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await servicesAPI.getAll()
        setServices(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Error fetching services:', error)
        setServices([])
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
  }, [])

  const handleEdit = (service) => {
    setEditingService(service)
    setFormData({
      category: service.category,
      title: service.title,
      description: service.description,
      features: Array.isArray(service.features) 
        ? service.features.join('\n') 
        : service.features || '',
      price: service.price.toString(),
      period: service.period,
      popular: service.popular || false,
    })
    setShowForm(true)
    setError('')
    setSuccess('')
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingService(null)
    setFormData({
      category: 'Hosting',
      title: '',
      description: '',
      features: '',
      price: '',
      period: 'mes',
      popular: false,
    })
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const featuresArray = formData.features
        .split('\n')
        .map((feature) => feature.trim())
        .filter((feature) => feature)

      const serviceData = {
        category: formData.category,
        title: formData.title,
        description: formData.description,
        features: featuresArray,
        price: parseFloat(formData.price),
        period: formData.period,
        popular: formData.popular,
      }

      if (editingService) {
        await servicesAPI.update(editingService.id, serviceData)
        setSuccess('Servicio actualizado exitosamente')
      } else {
        await servicesAPI.create(serviceData)
        setSuccess('Servicio creado exitosamente')
      }
      
      // Limpiar formulario
      setFormData({
        category: 'Hosting',
        title: '',
        description: '',
        features: '',
        price: '',
        period: 'mes',
        popular: false,
      })
      
      // Recargar servicios
      const data = await servicesAPI.getAll()
      setServices(Array.isArray(data) ? data : [])
      
      setTimeout(() => {
        setSuccess('')
        handleCancel()
      }, 2000)
    } catch (error) {
      setError(error.message || `Error al ${editingService ? 'actualizar' : 'crear'} el servicio`)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Gestionar Servicios
        </h2>
        <button
          onClick={() => {
            if (showForm) {
              handleCancel()
            } else {
              setShowForm(true)
              setEditingService(null)
              setFormData({
                category: 'Hosting',
                title: '',
                description: '',
                features: '',
                price: '',
                period: 'mes',
                popular: false,
              })
              setError('')
              setSuccess('')
            }
          }}
          className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
        >
          {showForm ? 'Cancelar' : 'Nuevo Servicio'}
        </button>
      </div>

      {success && (
        <div className="mb-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 px-4 py-3 rounded">
          {success}
        </div>
      )}

      {error && (
        <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8"
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            {editingService ? 'Editar Servicio' : 'Crear Nuevo Servicio'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Categoría
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-gray-900 focus:border-gray-900"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Título
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-gray-900 focus:border-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Descripción
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-gray-900 focus:border-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Características (una por línea)
              </label>
              <textarea
                required
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                rows={5}
                placeholder="Característica 1&#10;Característica 2&#10;..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-gray-900 focus:border-gray-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Precio
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-gray-900 focus:border-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Período
                </label>
                <select
                  required
                  value={formData.period}
                  onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-gray-900 focus:border-gray-900"
                >
                  <option value="mes">Mes</option>
                  <option value="hora">Hora</option>
                  <option value="sesión">Sesión</option>
                </select>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="popular"
                checked={formData.popular}
                onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                className="w-4 h-4 text-gray-900 bg-gray-100 border-gray-300 rounded focus:ring-gray-900"
              />
              <label htmlFor="popular" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Marcar como popular
              </label>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              {editingService ? 'Actualizar Servicio' : 'Crear Servicio'}
            </button>
          </form>
        </motion.div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Servicios Existentes ({services.length})
        </h3>
        {loading ? (
          <p className="text-gray-600 dark:text-gray-400">Cargando servicios...</p>
        ) : services.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No hay servicios</p>
        ) : (
          <div className="space-y-2">
            {services.map((service) => (
              <div
                key={service.id}
                className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{service.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {service.category} - €{service.price}/{service.period}
                  </p>
                </div>
                <button
                  onClick={() => handleEdit(service)}
                  className="px-3 py-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                >
                  Editar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminServiceForm

