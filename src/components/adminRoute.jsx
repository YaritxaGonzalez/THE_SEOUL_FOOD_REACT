import { Navigate } from 'react-router-dom';

function AdminRoute({ children }) {
  const rol = localStorage.getItem('rolActual');

  if (rol !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminRoute;