import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI, usersAPI } from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar si hay un token y usuario guardado
    const token = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    
    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
        // Verificar que el token sigue siendo válido obteniendo el perfil
        usersAPI.getProfile()
          .then((profile) => {
            setUser(profile)
            localStorage.setItem('user', JSON.stringify(profile))
          })
          .catch(() => {
            // Token inválido, limpiar
            authAPI.logout()
            setUser(null)
          })
          .finally(() => setLoading(false))
      } catch (error) {
        authAPI.logout()
        setUser(null)
        setLoading(false)
      }
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password)
      
      if (response.success && response.user) {
        setUser(response.user)
        localStorage.setItem('user', JSON.stringify(response.user))
        return { success: true, user: response.user }
      }
      
      return { success: false, error: response.message || 'Error al iniciar sesión' }
    } catch (error) {
      return { success: false, error: error.message || 'Error al conectar con el servidor' }
    }
  }

  const register = async (email, password, name, phone, address, city, postalCode, country, company) => {
    try {
      const response = await authAPI.register({
        email,
        password,
        name,
        phone,
        address,
        city,
        postalCode,
        country,
        company,
      })
      
      if (response.success && response.user) {
        setUser(response.user)
        localStorage.setItem('user', JSON.stringify(response.user))
        return { success: true, user: response.user }
      }
      
      return { success: false, error: response.message || 'Error al registrar usuario' }
    } catch (error) {
      return { success: false, error: error.message || 'Error al conectar con el servidor' }
    }
  }

  const logout = () => {
    authAPI.logout()
    setUser(null)
  }

  const isAdmin = () => user?.role === 'admin'
  const isClient = () => user?.role === 'client'
  const isAuthenticated = () => !!user

  const value = {
    user,
    login,
    register,
    logout,
    isAdmin,
    isClient,
    isAuthenticated,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

