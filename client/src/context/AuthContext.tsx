import {
   createContext,
   useContext,
   useState,
   useEffect,
   useCallback,
   type ReactNode,
} from 'react';
import { get, post, patch, setCurrentApartmentId, getCurrentApartmentId } from '../libs/api';
import type { AuthUser, Apartment } from '../libs/types';

type AuthState = {
   user: AuthUser | null;
   token: string | null;
   apartments: Apartment[];
   currentApartmentId: number | null;
   loading: boolean;
};

type AuthContextValue = AuthState & {
   login: (email: string, password: string) => Promise<void>;
   signup: (email: string, password: string, name: string, lastname: string, phone: string) => Promise<void>;
   logout: () => void;
   setCurrentApartment: (apartmentId: number) => Promise<void>;
   refreshAuth: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
   const [state, setState] = useState<AuthState>({
      user: null,
      token: null,
      apartments: [],
      currentApartmentId: null,
      loading: true,
   });

   const refreshAuth = useCallback(async () => {
      const token = localStorage.getItem('token');
      if (!token) {
         setState((s) => ({ ...s, user: null, token: null, apartments: [], currentApartmentId: null, loading: false }));
         return;
      }
      try {
         const data = await get('/auth/me');
         const aptId = data.currentApartmentId ?? getCurrentApartmentId() ?? (data.apartments?.[0]?.id ?? null);
         if (aptId != null) setCurrentApartmentId(aptId);
         setState({
            user: data.user,
            token,
            apartments: data.apartments ?? [],
            currentApartmentId: aptId,
            loading: false,
         });
      } catch {
         localStorage.removeItem('token');
         localStorage.removeItem('user');
         setCurrentApartmentId(null);
         setState((s) => ({ ...s, user: null, token: null, apartments: [], currentApartmentId: null, loading: false }));
      }
   }, []);

   useEffect(() => {
      refreshAuth();
   }, [refreshAuth]);

   useEffect(() => {
      const onLogout = () => refreshAuth();
      window.addEventListener('auth:logout', onLogout);
      return () => window.removeEventListener('auth:logout', onLogout);
   }, [refreshAuth]);

   const login = useCallback(
      async (email: string, password: string) => {
         const data = await post('/auth/login', { email, password });
         localStorage.setItem('token', data.token);
         const aptId = data.currentApartmentId ?? data.apartments?.[0]?.id ?? null;
         if (aptId != null) setCurrentApartmentId(aptId);
         setState({
            user: data.user,
            token: data.token,
            apartments: data.apartments ?? [],
            currentApartmentId: aptId,
            loading: false,
         });
         return data;
      },
      [],
   );

   const signup = useCallback(
      async (email: string, password: string, name: string, lastname: string, phone: string) => {
         const data = await post('/auth/signup', { email, password, name, lastname, phone });
         localStorage.setItem('token', data.token);
         const aptId = data.currentApartmentId ?? data.apartments?.[0]?.id ?? null;
         if (aptId != null) setCurrentApartmentId(aptId);
         setState({
            user: data.user,
            token: data.token,
            apartments: data.apartments ?? [],
            currentApartmentId: aptId,
            loading: false,
         });
         return data;
      },
      [],
   );

   const logout = useCallback(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setCurrentApartmentId(null);
      setState((s) => ({ ...s, user: null, token: null, apartments: [], currentApartmentId: null }));
   }, []);

   const setCurrentApartment = useCallback(async (apartmentId: number) => {
      await patch('/auth/me/current-apartment', { apartment_id: apartmentId });
      setCurrentApartmentId(apartmentId);
      setState((s) => ({ ...s, currentApartmentId: apartmentId }));
   }, []);

   return (
      <AuthContext.Provider
         value={{
            ...state,
            login,
            signup,
            logout,
            setCurrentApartment,
            refreshAuth,
         }}
      >
         {children}
      </AuthContext.Provider>
   );
}

export function useAuth() {
   const ctx = useContext(AuthContext);
   if (!ctx) throw new Error('useAuth must be used within AuthProvider');
   return ctx;
}
