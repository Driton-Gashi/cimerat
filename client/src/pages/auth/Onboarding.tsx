import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { post } from '../../libs/api';
import './auth.css';

export default function Onboarding() {
   const [name, setName] = useState('');
   const [error, setError] = useState('');
   const [submitting, setSubmitting] = useState(false);
   const { apartments, refreshAuth } = useAuth();
   const navigate = useNavigate();

   useEffect(() => {
      if (apartments && apartments.length > 0) {
         navigate('/', { replace: true });
      }
   }, [apartments, navigate]);

   const handleCreateApartment = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      setSubmitting(true);
      try {
         await post('/apartments', { name: name.trim() });
         await refreshAuth();
         navigate('/', { replace: true });
      } catch (err) {
         setError(err instanceof Error ? err.message : 'Failed to create apartment.');
      } finally {
         setSubmitting(false);
      }
   };

   return (
      <div className="auth-page">
         <div className="auth-card">
            <h1>Join or create an apartment</h1>
            <p style={{ marginBottom: 20, color: 'var(--gray-text)', fontSize: '0.95rem' }}>
               You need to be part of an apartment to use the app. Create a new one or join with an
               invite link.
            </p>
            {error && <div className="auth-error">{error}</div>}
            <form onSubmit={handleCreateApartment}>
               <label htmlFor="apartment-name">Apartment name</label>
               <input
                  id="apartment-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Building A – Flat 3"
                  required
               />
               <button type="submit" disabled={submitting}>
                  Create apartment
               </button>
            </form>
            <p className="auth-footer" style={{ marginTop: 16 }}>
               Have an invite link? <Link to="/join">Join an apartment</Link>
            </p>
         </div>
      </div>
   );
}
