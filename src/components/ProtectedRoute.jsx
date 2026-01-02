import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const ProtectedRoute = ({ children, requireAuth = false, requireAdmin = false, requireClient = false }) => {
  const { user, isAdmin, isClient, isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    )
  }

  // Si requiere autenticación y no está autenticado
  if (requireAuth && !isAuthenticated()) {
    return <Navigate to="/login" replace />
  }

  // Si requiere admin y no es admin
  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/" replace />
  }

  // Si requiere cliente y no es cliente
  if (requireClient && !isClient()) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute

