import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function RoleRoute({ roles, children }) {
  const { session } = useAuth();

  if (!session || !roles.includes(session.rol)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RoleRoute;