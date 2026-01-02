import { motion } from 'framer-motion'

const ServicePricingCard = ({ service, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative bg-white dark:bg-gray-800 rounded-lg border-2 overflow-hidden transition-all duration-300 hover:shadow-xl dark:hover:shadow-gray-900/50 ${
        service.popular
          ? 'border-gray-900 dark:border-white shadow-lg'
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
      }`}
    >
      {service.popular && (
        <div className="absolute top-0 right-0 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-1 text-xs font-semibold rounded-bl-lg">
          Popular
        </div>
      )}

      <div className="p-8">
        <div className="mb-4">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            {service.category}
          </span>
        </div>

        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{service.title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">{service.description}</p>

        <div className="mb-6">
          <div className="flex items-baseline">
            <span className="text-4xl font-bold text-gray-900 dark:text-white">€{service.price}</span>
            <span className="text-gray-600 dark:text-gray-300 ml-2">/{service.period}</span>
          </div>
        </div>

        <ul className="space-y-3 mb-8">
          {service.features.map((feature, idx) => (
            <li key={idx} className="flex items-start">
              <svg
                className="w-5 h-5 text-gray-900 dark:text-white mr-3 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
            </li>
          ))}
        </ul>

        <button
          className={`w-full py-3 rounded-lg font-medium transition-colors ${
            service.popular
              ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Contratar Ahora
        </button>
      </div>
    </motion.div>
  )
}

export default ServicePricingCard

