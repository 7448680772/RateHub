import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Only logged-in users with correct role can open a page
export default function ProtectedRoute({ children, role }) {
  const { user } = useAuth();

  if (!user?.token) {
    return <Navigate to="/login" />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/login" />;
  }

  return children;
}