import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="text-center py-32 font-serif text-mink-light animate-pulse text-xl">Loading...</div>
  if (!user || user.role !== 'admin') return <Navigate to="/" replace />
  return children
}
