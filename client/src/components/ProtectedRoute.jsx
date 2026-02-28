import { Navigate } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // Show a simple loading spinner while Supabase checks the session
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If Supabase confirms there is no user, redirect to the login page (assuming '/' is login)
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // If the user is logged in, render the protected page they requested
  return children;
}