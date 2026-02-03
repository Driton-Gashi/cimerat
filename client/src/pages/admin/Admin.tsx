import { useEffect, useState, useCallback } from 'react';
import { get, post, del } from '../../libs/api';
import './admin.css';

type ApartmentRow = {
   id: number;
   name: string;
   created_at: string;
   creator_email?: string;
   creator_name?: string;
   creator_lastname?: string;
   member_count: number;
};

type MemberRow = {
   user_id: number;
   role: string;
   joined_at: string;
   name: string;
   lastname: string;
   email: string;
};

type CimeratRow = {
   id: number;
   name: string;
   lastname: string;
   email: string;
   global_role: string | null;
   apartment_id: number | null;
};

function loadApartments() {
   return get('/admin/apartments').catch(() => []);
}

function loadCimerat() {
   return get('/admin/cimerat').catch(() => []);
}

export default function Admin() {
   const [apartments, setApartments] = useState<ApartmentRow[]>([]);
   const [cimerat, setCimerat] = useState<CimeratRow[]>([]);
   const [loading, setLoading] = useState(true);
   const [loadError, setLoadError] = useState<string | null>(null);
   const [selected, setSelected] = useState<ApartmentRow | null>(null);
   const [detail, setDetail] = useState<{ members: MemberRow[] } | null>(null);
   const [addEmail, setAddEmail] = useState('');
   const [actionError, setActionError] = useState('');
   const [actionSuccess, setActionSuccess] = useState('');
   const [busy, setBusy] = useState(false);
   const [tab, setTab] = useState<'apartments' | 'users'>('apartments');

   const refreshApartments = useCallback(() => {
      return loadApartments().then(setApartments);
   }, []);

   const refreshCimerat = useCallback(() => {
      return loadCimerat().then(setCimerat);
   }, []);

   useEffect(() => {
      Promise.all([get('/admin/apartments'), get('/admin/cimerat')])
         .then(([aps, cim]) => {
            setApartments(Array.isArray(aps) ? aps : []);
            setCimerat(Array.isArray(cim) ? cim : []);
            setLoadError(null);
         })
         .catch((err) => {
            setLoadError(
               err instanceof Error ? err.message : "Couldn't load admin data. You need platform admin access.",
            );
            setApartments([]);
            setCimerat([]);
         })
         .finally(() => setLoading(false));
   }, []);

   useEffect(() => {
      if (!selected) {
         setDetail(null);
         return;
      }
      get(`/admin/apartments/${selected.id}`)
         .then(setDetail)
         .catch(() => setDetail(null));
   }, [selected]);

   const clearFeedback = () => {
      setActionError('');
      setActionSuccess('');
   };

   const handleDeleteApartment = async () => {
      if (!selected || !confirm(`Delete apartment "${selected.name}"? This cannot be undone.`)) return;
      setBusy(true);
      clearFeedback();
      try {
         await del(`/admin/apartments/${selected.id}`);
         setActionSuccess('Apartment deleted.');
         setSelected(null);
         setDetail(null);
         await refreshApartments();
         await refreshCimerat();
      } catch (e) {
         setActionError(e instanceof Error ? e.message : 'Failed to delete apartment.');
      } finally {
         setBusy(false);
      }
   };

   const handleRemoveMember = async (userId: number, name: string) => {
      if (!selected || !confirm(`Remove ${name} from this apartment?`)) return;
      setBusy(true);
      clearFeedback();
      try {
         await del(`/admin/apartments/${selected.id}/members/${userId}`);
         setActionSuccess('Member removed.');
         const next = await get(`/admin/apartments/${selected.id}`);
         setDetail(next);
         await refreshApartments();
         await refreshCimerat();
      } catch (e) {
         setActionError(e instanceof Error ? e.message : 'Failed to remove member.');
      } finally {
         setBusy(false);
      }
   };

   const handleAddMember = async (e: React.FormEvent) => {
      e.preventDefault();
      const email = addEmail.trim();
      if (!selected || !email) return;
      setBusy(true);
      clearFeedback();
      try {
         await post(`/admin/apartments/${selected.id}/members`, { email });
         setActionSuccess('Member added. They were removed from any other apartment (one apartment per account).');
         setAddEmail('');
         const next = await get(`/admin/apartments/${selected.id}`);
         setDetail(next);
         await refreshApartments();
         await refreshCimerat();
      } catch (e) {
         setActionError(e instanceof Error ? e.message : 'Failed to add member.');
      } finally {
         setBusy(false);
      }
   };

   const handleDeleteUser = async (user: CimeratRow) => {
      const name = [user.name, user.lastname].filter(Boolean).join(' ') || user.email;
      if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return;
      setBusy(true);
      clearFeedback();
      try {
         await del(`/admin/cimerat/${user.id}`);
         setActionSuccess('User deleted.');
         await refreshCimerat();
         await refreshApartments();
         if (selected) {
            const next = await get(`/admin/apartments/${selected.id}`).catch(() => null);
            if (next) setDetail(next);
         }
      } catch (e) {
         setActionError(e instanceof Error ? e.message : 'Failed to delete user.');
      } finally {
         setBusy(false);
      }
   };

   if (loading) {
      return (
         <div className="admin-page">
            <h1>Platform admin</h1>
            <p>Loading...</p>
         </div>
      );
   }

   return (
      <div className="admin-page">
         <h1>Platform admin</h1>
         <div className="admin-tabs">
            <button
               type="button"
               className={tab === 'apartments' ? 'active' : ''}
               onClick={() => setTab('apartments')}
            >
               Apartments
            </button>
            <button
               type="button"
               className={tab === 'users' ? 'active' : ''}
               onClick={() => setTab('users')}
            >
               Users (cimerat)
            </button>
         </div>

         {loadError && <p className="admin-message admin-error">{loadError}</p>}
         {actionError && <p className="admin-message admin-error">{actionError}</p>}
         {actionSuccess && <p className="admin-message admin-success">{actionSuccess}</p>}

         {tab === 'apartments' && (
            <div className="admin-grid">
               <div className="admin-list">
                  <table className="admin-table" aria-label="Click a row to manage the apartment">
                     <thead>
                        <tr>
                           <th>Name</th>
                           <th>Created by</th>
                           <th>Members</th>
                        </tr>
                     </thead>
                     <tbody>
                        {apartments.length === 0 && !loadError ? (
                           <tr>
                              <td colSpan={3}>No apartments.</td>
                           </tr>
                        ) : (
                        apartments.map((a) => (
                           <tr
                              key={a.id}
                              className={selected?.id === a.id ? 'selected' : ''}
                              onClick={() => setSelected(a)}
                           >
                              <td>{a.name}</td>
                              <td>
                                 {[a.creator_name, a.creator_lastname].filter(Boolean).join(' ') ||
                                    a.creator_email ||
                                    '–'}
                              </td>
                              <td>{a.member_count}</td>
                           </tr>
                        ))
                        )}
                     </tbody>
                  </table>
               </div>
               <div className="admin-detail">
                  {selected ? (
                     <>
                        <div className="admin-detail-header">
                           <h2>{selected.name}</h2>
                           <button
                              type="button"
                              className="admin-btn admin-btn-danger"
                              disabled={busy}
                              onClick={handleDeleteApartment}
                           >
                              Delete apartment
                           </button>
                        </div>
                        <p className="admin-hint">An account can only be in one apartment. Adding someone here removes them from any other.</p>
                        <form onSubmit={handleAddMember} className="admin-add-member-form">
                           <input
                              type="email"
                              placeholder="Email to add"
                              value={addEmail}
                              onChange={(e) => setAddEmail(e.target.value)}
                              required
                           />
                           <button type="submit" disabled={busy}>
                              Add to apartment
                           </button>
                        </form>
                        {detail?.members?.length ? (
                           <table className="admin-table">
                              <thead>
                                 <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th></th>
                                 </tr>
                              </thead>
                              <tbody>
                                 {detail.members.map((m) => (
                                    <tr key={m.user_id}>
                                       <td>{[m.name, m.lastname].filter(Boolean).join(' ')}</td>
                                       <td>{m.email}</td>
                                       <td>{m.role}</td>
                                       <td>
                                          <button
                                             type="button"
                                             className="admin-btn admin-btn-small"
                                             disabled={busy}
                                             onClick={() =>
                                                handleRemoveMember(
                                                   m.user_id,
                                                   [m.name, m.lastname].filter(Boolean).join(' ') || m.email,
                                                )
                                             }
                                          >
                                             Remove
                                          </button>
                                       </td>
                                    </tr>
                                 ))}
                              </tbody>
                           </table>
                        ) : (
                           <p>No members or loading...</p>
                        )}
                     </>
                  ) : (
                     <p className="admin-detail-empty">
                        Select an apartment from the list to manage it: delete the apartment, add members by
                        email, or remove members.
                     </p>
                  )}
               </div>
            </div>
         )}

         {tab === 'users' && (
            <div className="admin-list admin-users-list">
               <table className="admin-table">
                  <thead>
                     <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Apartment</th>
                        <th></th>
                     </tr>
                  </thead>
                  <tbody>
                     {cimerat.length === 0 && !loadError ? (
                        <tr>
                           <td colSpan={4}>No users (cimerat).</td>
                        </tr>
                     ) : (
                     cimerat.map((u) => (
                        <tr key={u.id}>
                           <td>{[u.name, u.lastname].filter(Boolean).join(' ') || '–'}</td>
                           <td>{u.email}</td>
                           <td>
                              {u.apartment_id
                                 ? apartments.find((a) => a.id === u.apartment_id)?.name ?? `#${u.apartment_id}`
                                 : '–'}
                           </td>
                           <td>
                              <button
                                 type="button"
                                 className="admin-btn admin-btn-danger admin-btn-small"
                                 disabled={busy}
                                 onClick={() => handleDeleteUser(u)}
                              >
                                 Delete user
                              </button>
                           </td>
                        </tr>
                     ))
                     )}
                  </tbody>
               </table>
            </div>
         )}
      </div>
   );
}
