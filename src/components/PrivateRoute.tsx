import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore, Role } from '../store/authStore';

interface PrivateRouteProps {
  allowedRole?: Role;
}

export function PrivateRoute({ allowedRole }: PrivateRouteProps) {
  const { user, token } = useAuthStore();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={user.role === 'HOC_VIEN' ? '/student/dashboard' : '/tutor/dashboard'} replace />;
  }

  return <Outlet />;
}
