// Configuración de la API
// Vite inyecta variables de entorno en tiempo de build
// Si VITE_API_URL no está definida, usar el valor por defecto
let API_URL = import.meta.env.VITE_API_URL

// Si no está definida o está vacía, usar el valor por defecto
if (!API_URL || API_URL === '') {
  API_URL = 'http://localhost:3000/api'
}

// Asegurar que termine con /api si no lo tiene
if (!API_URL.endsWith('/api')) {
  API_URL = API_URL.endsWith('/') ? `${API_URL}api` : `${API_URL}/api`
}

// Debug: mostrar la URL de la API (solo en desarrollo)
if (import.meta.env.DEV) {
  console.log('API_URL configurada:', API_URL)
  console.log('VITE_API_URL desde env:', import.meta.env.VITE_API_URL)
}

// Función auxiliar para hacer peticiones
const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token')
  
  // Asegurar que endpoint empiece con /
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  const url = `${API_URL}${normalizedEndpoint}`
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, config)
    
    // Si la respuesta no es JSON, lanzar error
    let data
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      data = await response.json()
    } else {
      const text = await response.text()
      throw new Error(`Expected JSON but got: ${text.substring(0, 100)}`)
    }

    if (!response.ok) {
      throw new Error(data.message || `Error ${response.status}: ${response.statusText}`)
    }

    return data
  } catch (error) {
    console.error(`API Error [${url}]:`, error)
    throw error
  }
}

// API de Autenticación
export const authAPI = {
  login: async (email, password) => {
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    if (data.token) {
      localStorage.setItem('token', data.token)
    }
    return data
  },

  register: async (userData) => {
    const data = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
    if (data.token) {
      localStorage.setItem('token', data.token)
    }
    return data
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },
}

// API de Proyectos
export const projectsAPI = {
  getAll: async () => {
    const data = await request('/projects')
    return data.projects || data.data || data
  },

  getById: async (id) => {
    const data = await request(`/projects/${id}`)
    return data.project || data.data || data
  },

  create: async (projectData) => {
    const data = await request('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    })
    return data.project || data.data || data
  },

  update: async (id, projectData) => {
    const data = await request(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    })
    return data.project || data.data || data
  },

  delete: async (id) => {
    const data = await request(`/projects/${id}`, {
      method: 'DELETE',
    })
    return data
  },
}

// API de Servicios
export const servicesAPI = {
  getAll: async () => {
    const data = await request('/services')
    return data.services || data.data || data
  },

  getById: async (id) => {
    const data = await request(`/services/${id}`)
    return data.service || data.data || data
  },

  create: async (serviceData) => {
    const data = await request('/services', {
      method: 'POST',
      body: JSON.stringify(serviceData),
    })
    return data.service || data.data || data
  },

  update: async (id, serviceData) => {
    const data = await request(`/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(serviceData),
    })
    return data.service || data.data || data
  },

  delete: async (id) => {
    const data = await request(`/services/${id}`, {
      method: 'DELETE',
    })
    return data
  },
}

// API de Usuarios
export const usersAPI = {
  getProfile: async () => {
    const data = await request('/users/profile')
    return data.user || data.data || data
  },

  updateProfile: async (userData) => {
    const data = await request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    })
    return data.user || data.data || data
  },
}

// API de Suscripciones
export const subscriptionsAPI = {
  getMySubscriptions: async () => {
    const data = await request('/subscriptions/my-subscriptions')
    return data.subscriptions || data.data || data
  },

  create: async (subscriptionData) => {
    const data = await request('/subscriptions', {
      method: 'POST',
      body: JSON.stringify(subscriptionData),
    })
    return data.subscription || data.data || data
  },

  cancel: async (id) => {
    const data = await request(`/subscriptions/${id}/cancel`, {
      method: 'PUT',
    })
    return data.subscription || data.data || data
  },
}

