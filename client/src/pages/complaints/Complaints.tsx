import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MyIcon from '../../components/icons/MyIcon';
import { del, get } from '../../libs/api';
import { formatDate } from '../../libs/utils';
import type { Complaint } from '../../libs/types';

import './complaints.css';

const Complaints = () => {
   const [complaints, setComplaints] = useState<Complaint[]>(() => {
      try {
         return JSON.parse(localStorage.getItem('complaints') ?? '[]');
      } catch {
         return [];
      }
   });

   const [loading, setLoading] = useState(complaints.length === 0);

   useEffect(() => {
      const fetchData = async () => {
         try {
            const complaintsData: Complaint[] = (await get('/complaints')) ?? [];
            setComplaints(complaintsData);
            localStorage.setItem('complaints', JSON.stringify(complaintsData));
         } catch (error) {
            console.error('Driton we got an error: ', error);
         } finally {
            setLoading(false);
         }
      };

      fetchData();
   }, []);

   if (loading) return <PaymentLoadingScreen />;

   const handleDelete = async (id: number) => {
      try {
         await del(`/complaints/${id}`);
         const updatedComplaints = complaints.filter((complaint) => complaint.id !== id);
         setComplaints(updatedComplaints);
         localStorage.setItem('complaints', JSON.stringify(updatedComplaints));
      } catch (error) {
         console.error('Error deleting complaint:', error);
      }
   };

   return (
      <div className="complaints">
         <div className="complaints-header flex flex-space-between flex-align-center">
            <h1>Complaints</h1>
            <Link to="/complaints/create">
               <button className="create-payment-btn" aria-label="Create complaint">
                  +
               </button>
            </Link>
         </div>

         {complaints.length === 0 ? (
            <div className="complaints-empty">No complaints yet.</div>
         ) : (
            <div className="complaints-grid" id="new-complaint">
               {complaints.map((complaint) => {
                  const complainerName =
                     complaint.complainer_name ?? `Complainer #${complaint.complainer_id}`;
                  const suspectName = complaint.suspect_name ?? `Suspect #${complaint.suspect_id}`;

                  return (
                     <div className="complaints-card" key={complaint.id}>
                        <div className="complaints-card-image-wrap">
                           <img
                              src={complaint.image_url}
                              alt={complaint.name}
                              className="complaints-card-image"
                              loading="lazy"
                           />
                        </div>
                        <div className="complaints-card-body">
                           <div className="complaints-card-title-row">
                              <h3 className="complaints-card-title">{complaint.name}</h3>
                              <button
                                 className="complaints-card-delete"
                                 onClick={() => handleDelete(complaint.id)}
                              >
                                 Delete
                              </button>
                           </div>
                           <div className="complaints-card-date">
                              Filed on {formatDate(complaint.complaints_date)}
                           </div>
                           <div className="complaints-card-people">
                              <div>
                                 <span className="complaints-card-label">Complainer</span>
                                 <span className="complaints-card-value">{complainerName}</span>
                              </div>
                              <div>
                                 <span className="complaints-card-label">Suspect</span>
                                 <span className="complaints-card-value">{suspectName}</span>
                              </div>
                           </div>
                        </div>
                     </div>
                  );
               })}
            </div>
         )}
      </div>
   );
};

export default Complaints;

const PaymentLoadingScreen = () => {
   return (
      <div className="complaints">
         <h1>Complaints</h1>
         <div className="complaints-loading">
            Complaints are loading <MyIcon iconName="loadingSvg" />
         </div>
      </div>
   );
};
