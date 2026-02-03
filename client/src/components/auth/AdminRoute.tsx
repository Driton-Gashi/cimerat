import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Admin from '../../pages/admin/Admin';

export default function AdminRoute() {
   const { user } = useAuth();
   if (user?.global_role !== 'platform_admin') {
      return <Navigate to="/" replace />;
   }
   return <Admin />;
}
