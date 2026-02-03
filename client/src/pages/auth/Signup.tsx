import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './auth.css';

export default function Signup() {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [name, setName] = useState('');
   const [lastname, setLastname] = useState('');
   const [phone, setPhone] = useState('');
   const [error, setError] = useState('');
   const [submitting, setSubmitting] = useState(false);
   const { signup } = useAuth();
   const navigate = useNavigate();

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      setSubmitting(true);
      try {
         const data = await signup(email.trim(), password, name.trim(), lastname.trim(), phone.trim());
         const hasApartments = Array.isArray(data?.apartments) && data.apartments.length > 0;
         navigate(hasApartments ? '/' : '/onboarding', { replace: true });
      } catch (err) {
         setError(err instanceof Error ? err.message : 'Sign up failed.');
      } finally {
         setSubmitting(false);
      }
   };

   return (
      <div className="auth-page">
         <div className="auth-card">
            <h1>Create your account</h1>
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
                  autoComplete="new-password"
               />
               <label htmlFor="name">First name</label>
               <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="given-name"
               />
               <label htmlFor="lastname">Last name</label>
               <input
                  id="lastname"
                  type="text"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  required
                  autoComplete="family-name"
               />
               <label htmlFor="phone">Phone</label>
               <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  autoComplete="tel"
               />
               <button type="submit" disabled={submitting}>
                  Sign up
               </button>
            </form>
            <p className="auth-footer">
               Already have an account? <Link to="/login">Log in</Link>
            </p>
         </div>
      </div>
   );
}
