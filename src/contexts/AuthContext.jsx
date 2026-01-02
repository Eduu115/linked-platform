import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Datos temporales de usuarios
const TEMP_USERS = [
  {
    id: 1,
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    name: 'Administrador',
  },
  {
    id: 2,
    email: 'cliente@example.com',
    password: 'cliente123',
    role: 'client',
    name: 'Cliente Demo',
    phone: '+34 600 123 456',
    address: 'Calle Ejemplo 123',
    city: 'Madrid',
    postalCode: '28001',
    country: 'España',
    company: 'Empresa Demo S.L.',
  },
]

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar si hay un usuario guardado
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = (email, password) => {
    // Simular login con datos temporales
    const foundUser = TEMP_USERS.find(
      (u) => u.email === email && u.password === password
    )

    if (foundUser) {
      const userData = { ...foundUser }
      delete userData.password // No guardar la contraseña
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
      return { success: true, user: userData }
    }

    return { success: false, error: 'Credenciales incorrectas' }
  }

  const register = (email, password, name, phone, address, city, postalCode, country, company) => {
    // Verificar si el email ya existe
    const existingUser = TEMP_USERS.find((u) => u.email === email)
    if (existingUser) {
      return { success: false, error: 'Este email ya está registrado' }
    }

    // Crear nuevo usuario (solo clientes pueden registrarse)
    const newUser = {
      id: TEMP_USERS.length + 1,
      email,
      password,
      role: 'client',
      name,
      phone: phone || '',
      address: address || '',
      city: city || '',
      postalCode: postalCode || '',
      country: country || '',
      company: company || '',
    }

    TEMP_USERS.push(newUser)
    const userData = { ...newUser }
    delete userData.password
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
    return { success: true, user: userData }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
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

