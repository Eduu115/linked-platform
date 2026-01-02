import { useState, useEffect } from 'react'
import { projectsAPI } from '../services/api'
import { motion } from 'framer-motion'

const AdminProjectForm = () => {
  const [showForm, setShowForm] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    technologies: '',
    image: '',
    previewUrl: '',
    detailsUrl: '',
  })
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectsAPI.getAll()
        setProjects(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Error fetching projects:', error)
        setProjects([])
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validar tipo de archivo
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg']
      if (!allowedTypes.includes(file.type)) {
        setError('Solo se permiten archivos PNG, JPG o JPEG')
        return
      }
      
      // Validar tamaño (5MB máximo)
      if (file.size > 5 * 1024 * 1024) {
        setError('El archivo no puede ser mayor a 5MB')
        return
      }
      
      setSelectedFile(file)
      setError('')
      
      // Crear preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleEdit = (project) => {
    setEditingProject(project)
    setFormData({
      name: project.name,
      description: project.description,
      technologies: Array.isArray(project.technologies) 
        ? project.technologies.join(', ') 
        : project.technologies || '',
      image: project.image || '',
      previewUrl: project.previewUrl || '',
      detailsUrl: project.detailsUrl || '',
    })
    setSelectedFile(null)
    setPreviewImage(project.image || null)
    setShowForm(true)
    setError('')
    setSuccess('')
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingProject(null)
    setFormData({
      name: '',
      description: '',
      technologies: '',
      image: '',
      previewUrl: '',
      detailsUrl: '',
    })
    setSelectedFile(null)
    setPreviewImage(null)
    setError('')
    setSuccess(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    try {
      const technologiesArray = formData.technologies
        .split(',')
        .map((tech) => tech.trim())
        .filter((tech) => tech)

      const projectData = {
        name: formData.name,
        description: formData.description,
        technologies: technologiesArray,
        previewUrl: formData.previewUrl,
        detailsUrl: formData.detailsUrl || `/projects/${formData.name.toLowerCase().replace(/\s+/g, '-')}`,
      }

      // Solo incluir image si no hay archivo seleccionado
      if (!selectedFile && formData.image) {
        projectData.image = formData.image
      }

      if (editingProject) {
        await projectsAPI.update(editingProject.id, projectData, selectedFile)
        setSuccess('Proyecto actualizado exitosamente')
      } else {
        await projectsAPI.create(projectData, selectedFile)
        setSuccess('Proyecto creado exitosamente')
      }
      
      // Limpiar formulario
      setFormData({
        name: '',
        description: '',
        technologies: '',
        image: '',
        previewUrl: '',
        detailsUrl: '',
      })
      setSelectedFile(null)
      setPreviewImage(null)
      
      // Recargar proyectos
      const data = await projectsAPI.getAll()
      setProjects(Array.isArray(data) ? data : [])
      
      setTimeout(() => {
        setSuccess('')
        handleCancel()
      }, 2000)
    } catch (error) {
      setError(error.message || `Error al ${editingProject ? 'actualizar' : 'crear'} el proyecto`)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Gestionar Proyectos
        </h2>
        <button
          onClick={() => {
            if (showForm) {
              handleCancel()
            } else {
              setShowForm(true)
              setEditingProject(null)
              setFormData({
                name: '',
                description: '',
                technologies: '',
                image: '',
                previewUrl: '',
                detailsUrl: '',
              })
              setSelectedFile(null)
              setPreviewImage(null)
              setError('')
              setSuccess('')
            }
          }}
          className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
        >
          {showForm ? 'Cancelar' : 'Nuevo Proyecto'}
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
            {editingProject ? 'Editar Proyecto' : 'Crear Nuevo Proyecto'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nombre del Proyecto
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                Tecnologías (separadas por comas)
              </label>
              <input
                type="text"
                required
                value={formData.technologies}
                onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                placeholder="React, Node.js, MongoDB"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-gray-900 focus:border-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Imagen de Portada (opcional)
              </label>
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-gray-900 focus:border-gray-900"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Formatos permitidos: PNG, JPG, JPEG. Tamaño máximo: 5MB
              </p>
              {previewImage && (
                <div className="mt-4">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                O URL de Imagen (si no subes archivo)
              </label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => {
                  setFormData({ ...formData, image: e.target.value })
                  if (e.target.value) {
                    setPreviewImage(e.target.value)
                    setSelectedFile(null)
                  }
                }}
                placeholder="https://..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-gray-900 focus:border-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                URL de Preview
              </label>
              <input
                type="url"
                required
                value={formData.previewUrl}
                onChange={(e) => setFormData({ ...formData, previewUrl: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-gray-900 focus:border-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                URL de Detalles (opcional)
              </label>
              <input
                type="text"
                value={formData.detailsUrl}
                onChange={(e) => setFormData({ ...formData, detailsUrl: e.target.value })}
                placeholder="/projects/nombre-proyecto"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-gray-900 focus:border-gray-900"
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              {editingProject ? 'Actualizar Proyecto' : 'Crear Proyecto'}
            </button>
          </form>
        </motion.div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Proyectos Existentes ({projects.length})
        </h3>
        {loading ? (
          <p className="text-gray-600 dark:text-gray-400">Cargando proyectos...</p>
        ) : projects.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No hay proyectos</p>
        ) : (
          <div className="space-y-2">
            {projects.map((project) => (
              <div
                key={project.id}
                className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{project.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {Array.isArray(project.technologies) ? project.technologies.join(', ') : project.technologies}
                  </p>
                </div>
                <button
                  onClick={() => handleEdit(project)}
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

export default AdminProjectForm

