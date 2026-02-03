import { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

type ProtectedRouteProps = {
   children: ReactNode;
   requireApartment?: boolean;
   requirePlatformAdmin?: boolean;
};

export default function ProtectedRoute({
   children,
   requireApartment = true,
   requirePlatformAdmin = false,
}: ProtectedRouteProps) {
   const { user, token, apartments, currentApartmentId, loading } = useAuth();
   const location = useLocation();

   if (loading) {
      return (
         <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            Loading...
         </div>
      );
   }

   if (!token || !user) {
      return <Navigate to="/login" state={{ from: location }} replace />;
   }

   if (requirePlatformAdmin && user.global_role !== 'platform_admin') {
      return <Navigate to="/" replace />;
   }

   if (requireApartment && (!apartments || apartments.length === 0)) {
      return <Navigate to="/onboarding" replace />;
   }

   if (requireApartment && currentApartmentId == null && apartments?.length) {
      return <Navigate to="/" replace />;
   }

   return <>{children}</>;
}
