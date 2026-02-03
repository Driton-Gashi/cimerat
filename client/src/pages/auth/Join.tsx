import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { get, post } from '../../libs/api';
import './auth.css';

export default function Join() {
   const [searchParams] = useSearchParams();
   const token = searchParams.get('token') || '';
   const [details, setDetails] = useState<{
      apartmentName?: string;
      inviterName?: string;
      email?: string;
   } | null>(null);
   const [error, setError] = useState('');
   const [loading, setLoading] = useState(!!token);
   const [submitting, setSubmitting] = useState(false);
   const { user, refreshAuth } = useAuth();
   const navigate = useNavigate();

   useEffect(() => {
      if (!token) {
         setLoading(false);
         return;
      }
      get(`/invitations/accept/${token}`)
         .then((data) => setDetails(data))
         .catch(() => setError('Invalid or expired invite link.'))
         .finally(() => setLoading(false));
   }, [token]);

   const handleAccept = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!user) {
         navigate(`/login?redirect=${encodeURIComponent('/join?token=' + token)}`, { replace: true });
         return;
      }
      setError('');
      setSubmitting(true);
      try {
         await post('/invitations/accept', { token });
         await refreshAuth();
         navigate('/', { replace: true });
      } catch (err) {
         setError(err instanceof Error ? err.message : 'Failed to accept invite.');
      } finally {
         setSubmitting(false);
      }
   };

   if (!token) {
      return (
         <div className="auth-page">
            <div className="auth-card">
               <h1>Join an apartment</h1>
               <p style={{ color: 'var(--gray-text)' }}>Use the invite link you received to join an apartment.</p>
               <p className="auth-footer" style={{ marginTop: 20 }}>
                  <Link to="/login">Log in</Link> · <Link to="/signup">Sign up</Link>
               </p>
            </div>
         </div>
      );
   }

   if (loading) {
      return (
         <div className="auth-page">
            <div className="auth-card">
               <p>Loading invite...</p>
            </div>
         </div>
      );
   }

   if (error && !details) {
      return (
         <div className="auth-page">
            <div className="auth-card">
               <h1>Invalid invite</h1>
               <div className="auth-error">{error}</div>
               <p className="auth-footer" style={{ marginTop: 20 }}>
                  <Link to="/login">Log in</Link> · <Link to="/signup">Sign up</Link>
               </p>
            </div>
         </div>
      );
   }

   return (
      <div className="auth-page">
         <div className="auth-card">
            <h1>Join apartment</h1>
            {details && (
               <p style={{ marginBottom: 20, color: 'var(--gray-text)' }}>
                  You&apos;ve been invited to <strong>{details.apartmentName}</strong>
                  {details.inviterName && ` by ${details.inviterName}`}.
               </p>
            )}
            {error && <div className="auth-error">{error}</div>}
            {!user ? (
               <p>
                  <Link to={`/login?redirect=${encodeURIComponent('/join?token=' + token)}`}>Log in</Link> or{' '}
                  <Link to={`/signup?redirect=${encodeURIComponent('/join?token=' + token)}`}>sign up</Link> to accept
                  this invite.
               </p>
            ) : (
               <form onSubmit={handleAccept}>
                  <button type="submit" disabled={submitting}>
                     Accept invite
                  </button>
               </form>
            )}
            <p className="auth-footer" style={{ marginTop: 20 }}>
               <Link to="/">Back to home</Link>
            </p>
         </div>
      </div>
   );
}
