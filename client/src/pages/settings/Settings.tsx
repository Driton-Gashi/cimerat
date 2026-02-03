import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { get, post, del } from '../../libs/api';
import './settings.css';

type Member = {
   user_id: number;
   role: string;
   joined_at: string;
   name: string;
   lastname: string;
   email: string;
};

export default function Settings() {
   const { user, currentApartmentId, apartments, refreshAuth } = useAuth();
   const [members, setMembers] = useState<Member[]>([]);
   const [loading, setLoading] = useState(true);
   const [inviteEmail, setInviteEmail] = useState('');
   const [inviteLink, setInviteLink] = useState('');
   const [inviteError, setInviteError] = useState('');
   const [submitting, setSubmitting] = useState(false);

   const currentApartment = apartments?.find((a) => a.id === currentApartmentId);
   const isAdmin = currentApartment?.role === 'admin';

   useEffect(() => {
      if (!currentApartmentId) return;
      get(`/apartments/${currentApartmentId}/members`)
         .then(setMembers)
         .catch(() => setMembers([]))
         .finally(() => setLoading(false));
   }, [currentApartmentId]);

   const handleInvite = async (e: React.FormEvent) => {
      e.preventDefault();
      setInviteError('');
      setSubmitting(true);
      try {
         const data = await post('/invitations', { apartment_id: currentApartmentId, email: inviteEmail.trim() });
         setInviteLink(data.inviteLink || `${window.location.origin}/join?token=${data.token}`);
         setInviteEmail('');
      } catch (err) {
         setInviteError(err instanceof Error ? err.message : 'Failed to create invite.');
      } finally {
         setSubmitting(false);
      }
   };

   const handleRemove = async (userId: number) => {
      if (!currentApartmentId || !confirm('Remove this member from the apartment?')) return;
      try {
         await del(`/apartments/${currentApartmentId}/members/${userId}`);
         setMembers((prev) => prev.filter((m) => m.user_id !== userId));
         await refreshAuth();
      } catch (err) {
         alert(err instanceof Error ? err.message : 'Failed to remove member.');
      }
   };

   if (!currentApartmentId) return null;

   return (
      <div className="settings-page">
         <h1>Settings</h1>
         <div className="settings-section">
            <h2>Apartment members</h2>
            {loading ? (
               <p>Loading...</p>
            ) : (
               <table className="settings-table">
                  <thead>
                     <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        {isAdmin && <th></th>}
                     </tr>
                  </thead>
                  <tbody>
                     {members.map((m) => {
                        return (
                           <tr key={m.user_id}>
                              <td>{[m.name, m.lastname].filter(Boolean).join(' ')}</td>
                              <td>{m.email}</td>
                              <td>{m.role}</td>
                              {isAdmin && (
                                 <td>
                                    {m.user_id !== (user && user.id) && (
                                       <button
                                          type="button"
                                          className="settings-remove-btn"
                                          onClick={() => handleRemove(m.user_id)}
                                       >
                                          Remove
                                       </button>
                                    )}
                                 </td>
                              )}
                           </tr>
                        );
                     })}
                  </tbody>
               </table>
            )}
         </div>
         {isAdmin && (
            <div className="settings-section">
               <h2>Invite someone</h2>
               <form onSubmit={handleInvite} className="settings-invite-form">
                  <input
                     type="email"
                     placeholder="Email address"
                     value={inviteEmail}
                     onChange={(e) => setInviteEmail(e.target.value)}
                     required
                  />
                  <button type="submit" disabled={submitting}>
                     Create invite link
                  </button>
               </form>
               {inviteError && <p className="auth-error">{inviteError}</p>}
               {inviteLink && (
                  <div className="invite-link-box">
                     <p>Share this link (valid 7 days):</p>
                     <input
                        type="text"
                        readOnly
                        value={inviteLink}
                        onFocus={(e) => e.target.select()}
                        className="invite-link-input"
                     />
                  </div>
               )}
            </div>
         )}
      </div>
   );
}
