import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './auth.css';

function isSafeRedirect(path: string): boolean {
   return path.startsWith('/') && !path.includes('//');
}

export default function Login() {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [error, setError] = useState('');
   const [submitting, setSubmitting] = useState(false);
   const { login } = useAuth();
   const navigate = useNavigate();
   const [searchParams] = useSearchParams();
   const redirect = searchParams.get('redirect');

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      setSubmitting(true);
      try {
         const data: Awaited<ReturnType<typeof login>> = await login(email.trim(), password);
         if (redirect && isSafeRedirect(redirect)) {
            navigate(redirect, { replace: true });
         } else {
            const hasApartments = Array.isArray(data?.apartments) && data.apartments.length > 0;
            navigate(hasApartments ? '/' : '/onboarding', { replace: true });
         }
      } catch (err) {
         setError(err instanceof Error ? err.message : 'Login failed.');
      } finally {
         setSubmitting(false);
      }
   };

   return (
      <div className="auth-page">
         <div className="auth-card">
            <img className="logo-img" src="/logo.jpeg" alt="Cimerat logo" />
            <h1>Log in to Cimerat</h1>
            {error && <div className="auth-error">{error}</div>}
            <form onSubmit={handleSubmit}>
               <label htmlFor="email">Email</label>
               <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
               />
               <label htmlFor="password">Password</label>
               <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
               />
               <button type="submit" disabled={submitting}>
                  Log in
               </button>
            </form>
            <p className="auth-footer">
               Don&apos;t have an account? <Link to="/signup">Sign up</Link>
            </p>
         </div>
      </div>
   );
}
