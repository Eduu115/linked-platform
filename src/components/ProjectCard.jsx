import { motion } from 'framer-motion'
import { useState } from 'react'

const ProjectCard = ({ project, index }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl dark:hover:shadow-gray-900/50 transition-all duration-300"
    >
      <div className="relative h-48 md:h-64 overflow-hidden bg-gray-100 dark:bg-gray-700">
        <img
          src={project.image}
          alt={project.name}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
        />
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
            isHovered ? 'opacity-0' : 'opacity-0'
          }`}
        />
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {project.name}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm leading-relaxed">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {Array.isArray(project.technologies) 
            ? project.technologies.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
                >
                  {tech}
                </span>
              ))
            : typeof project.technologies === 'string'
              ? project.technologies.split(',').map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
                  >
                    {tech.trim()}
                  </span>
                ))
              : null
          }
        </div>

        <div className="flex gap-3">
          <a
            href={project.previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-center rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors text-sm"
          >
            Preview
          </a>
          <a
            href={project.detailsUrl}
            className="flex-1 px-4 py-2 bg-transparent text-gray-900 dark:text-white border-2 border-gray-900 dark:border-white text-center rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm"
          >
            Detalles
          </a>
        </div>
      </div>
    </motion.div>
  )
}

export default ProjectCard

