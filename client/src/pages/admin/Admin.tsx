import { useEffect, useState } from 'react';
import { get } from '../../libs/api';
import { useNavigate } from 'react-router-dom';
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

export default function Admin() {
   const [apartments, setApartments] = useState<ApartmentRow[]>([]);
   const [loading, setLoading] = useState(true);
   const [selected, setSelected] = useState<ApartmentRow | null>(null);
   const [detail, setDetail] = useState<{ members: any[] } | null>(null);
   const navigate = useNavigate();

   useEffect(() => {
      get('/admin/apartments')
         .then(setApartments)
         .catch(() => setApartments([]))
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

   return (
      <div className="admin-page">
         <h1>Platform admin – All apartments</h1>
         {loading ? (
            <p>Loading...</p>
         ) : (
            <div className="admin-grid">
               <div className="admin-list">
                  <table className="admin-table">
                     <thead>
                        <tr>
                           <th>Name</th>
                           <th>Created by</th>
                           <th>Members</th>
                        </tr>
                     </thead>
                     <tbody>
                        {apartments.map((a) => (
                           <tr
                              key={a.id}
                              className={selected?.id === a.id ? 'selected' : ''}
                              onClick={() => setSelected(a)}
                           >
                              <td>{a.name}</td>
                              <td>
                                 {[a.creator_name, a.creator_lastname].filter(Boolean).join(' ') || a.creator_email || '–'}
                              </td>
                              <td>{a.member_count}</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
               <div className="admin-detail">
                  {selected && (
                     <>
                        <h2>{selected.name}</h2>
                        {detail?.members?.length ? (
                           <table className="admin-table">
                              <thead>
                                 <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                 </tr>
                              </thead>
                              <tbody>
                                 {detail.members.map((m: any) => (
                                    <tr key={m.user_id}>
                                       <td>{[m.name, m.lastname].filter(Boolean).join(' ')}</td>
                                       <td>{m.email}</td>
                                       <td>{m.role}</td>
                                    </tr>
                                 ))}
                              </tbody>
                           </table>
                        ) : (
                           <p>No members or loading...</p>
                        )}
                     </>
                  )}
               </div>
            </div>
         )}
      </div>
   );
}
