import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { projectsAPI, servicesAPI } from '../services/api'
import { motion } from 'framer-motion'
import AdminProjectForm from '../components/AdminProjectForm'
import AdminServiceForm from '../components/AdminServiceForm'

const AdminDashboard = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState({
    projects: 0,
    services: 0,
    users: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projectsData, servicesData] = await Promise.all([
          projectsAPI.getAll(),
          servicesAPI.getAll(),
        ])
        setStats({
          projects: Array.isArray(projectsData) ? projectsData.length : 0,
          services: Array.isArray(servicesData) ? servicesData.length : 0,
          users: 0, // TODO: Implementar endpoint de usuarios si es necesario
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }
    if (user) {
      fetchStats()
    }
  }, [user])

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
            Panel de Administración
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Bienvenido, {user?.name}
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="mb-8 border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Resumen' },
              { id: 'projects', label: 'Proyectos' },
              { id: 'services', label: 'Servicios' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-gray-900 dark:border-white text-gray-900 dark:text-white'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Proyectos
                </h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {loading ? '-' : stats.projects}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Total de proyectos
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Servicios
                </h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {loading ? '-' : stats.services}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Servicios activos
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Usuarios
                </h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {loading ? '-' : stats.users}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Usuarios registrados
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === 'projects' && <AdminProjectForm />}
          {activeTab === 'services' && <AdminServiceForm />}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

