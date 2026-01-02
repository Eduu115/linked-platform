import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { projectsAPI } from '../services/api'

// Función auxiliar para construir URL de imagen
const getImageUrl = (imageUrl) => {
  if (!imageUrl) return 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop'
  
  // Si ya es una URL completa (http/https), usarla directamente
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl
  }
  
  // Si es una ruta relativa que empieza con /uploads, construir URL completa
  if (imageUrl.startsWith('/uploads/')) {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
    const baseUrl = apiUrl.replace('/api', '')
    return `${baseUrl}${imageUrl}`
  }
  
  return imageUrl
}

const ProjectDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Scroll al principio cuando se carga la página
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true)
        const data = await projectsAPI.getById(id)
        setProject(data)
      } catch (error) {
        console.error('Error fetching project:', error)
        setError('No se pudo cargar el proyecto')
      } finally {
        setLoading(false)
      }
    }
    fetchProject()
  }, [id])

  if (loading) {
    return (
      <div className="pt-20 md:pt-32 pb-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Cargando proyecto...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="pt-20 md:pt-32 pb-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {error || 'Proyecto no encontrado'}
            </p>
            <Link
              to="/projects"
              className="inline-block px-6 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              Volver a Proyectos
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const imageUrl = getImageUrl(project.image)

  return (
    <div className="pt-20 md:pt-32 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Botón de volver */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Volver
          </button>
        </motion.div>

        {/* Contenido principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg"
        >
          {/* Imagen */}
          <div className="relative h-64 md:h-96 overflow-hidden bg-gray-100 dark:bg-gray-700">
            <img
              src={imageUrl}
              alt={project.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Contenido */}
          <div className="p-6 md:p-8">
            {/* Título */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {project.name}
            </h1>

            {/* Descripción completa */}
            <div className="mb-6">
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed whitespace-pre-line">
                {project.description}
              </p>
            </div>

            {/* Tecnologías */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Tecnologías Utilizadas
              </h2>
              <div className="flex flex-wrap gap-3">
                {Array.isArray(project.technologies) 
                  ? project.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
                      >
                        {tech}
                      </span>
                    ))
                  : typeof project.technologies === 'string'
                    ? project.technologies.split(',').map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-4 py-2 text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
                        >
                          {tech.trim()}
                        </span>
                      ))
                    : null
                }
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              {project.previewUrl && (
                <a
                  href={project.previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-center rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                >
                  Ver Preview
                </a>
              )}
              <Link
                to="/projects"
                className="flex-1 px-6 py-3 bg-transparent text-gray-900 dark:text-white border-2 border-gray-900 dark:border-white text-center rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Ver Todos los Proyectos
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ProjectDetail

