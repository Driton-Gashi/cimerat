import { useEffect, useMemo, useState } from 'react';
import { get } from '../../../libs/api';
import { formatDate } from '../../../libs/utils';
import type { Complaint } from '../../../libs/types';
import { Link, useParams } from 'react-router-dom';
import MyIcon from '../../../components/icons/MyIcon';
import './complaintsPage.css';
import OverviewCard from '../../../components/dashboard/overview-card/OverviewCard';

const ComplaintsPage = () => {
   const [complaint, setComplaint] = useState<Complaint | null>(null);
   const [loading, setLoading] = useState<boolean>(true);
   const [error, setError] = useState<string | null>(null);

   const { id } = useParams();

   useEffect(() => {
      let cancelled = false;

      const fetchData = async () => {
         setLoading(true);
         setError(null);

         try {
            const data: Complaint = await get(`/complaints/${id}`);

            if (!cancelled) setComplaint(data);
         } catch (err) {
            console.error(err);
            if (!cancelled) setError('Failed to load complaint. Please try again.');
         } finally {
            if (!cancelled) setLoading(false);
         }
      };

      if (id) fetchData();
      else {
         setError('Missing complaint id.');
         setLoading(false);
      }

      return () => {
         cancelled = true;
      };
   }, [id]);

   const complainerDisplay = useMemo(() => {
      if (!complaint) return '-';
      if (complaint.complainer_name) return complaint.complainer_name;
      return `Complainer #${complaint.complainer_id}`;
   }, [complaint]);

   const suspectDisplay = useMemo(() => {
      if (!complaint) return '-';
      if (complaint.suspect_name) return complaint.suspect_name;
      return `Suspect #${complaint.suspect_id}`;
   }, [complaint]);

   if (loading)
      return (
         <div className="singleComplaint">
            <div className="flex flex-space-between flex-align-center">
               <h1>Loading...</h1>
               <Link to="/complaints">
                  <button className="create-payment-btn" aria-label="Back to complaints">
                     <MyIcon iconName="chevronLeft" />
                  </button>
               </Link>
            </div>

            <OverviewCard>Loading complaint details...</OverviewCard>
         </div>
      );

   if (error)
      return (
         <div className="singleComplaint">
            <div className="flex flex-space-between flex-align-center">
               <h1>Complaint</h1>
               <Link to="/complaints">
                  <button className="create-payment-btn" aria-label="Back to complaints">
                     <MyIcon iconName="chevronLeft" />
                  </button>
               </Link>
            </div>

            <OverviewCard>
               <div className="complaintError">
                  <p>{error}</p>
               </div>
            </OverviewCard>
         </div>
      );

   if (!complaint)
      return (
         <div className="singleComplaint">
            <div className="flex flex-space-between flex-align-center">
               <h1>Complaint</h1>
               <Link to="/complaints">
                  <button className="create-payment-btn" aria-label="Back to complaints">
                     <MyIcon iconName="chevronLeft" />
                  </button>
               </Link>
            </div>

            <OverviewCard>No complaint found.</OverviewCard>
         </div>
      );

   return (
      <div className="singleComplaint">
         <div className="flex flex-space-between flex-align-center">
            <div className="complaintTitleWrap">
               <h1 className="complaintTitle">{complaint.name}</h1>
            </div>

            <div className="complaintActions">
               <Link to="/complaints">
                  <button className="create-payment-btn" aria-label="Back to complaints">
                     <MyIcon iconName="chevronLeft" />
                  </button>
               </Link>
            </div>
         </div>

         <div className="complaintGrid">
            <OverviewCard>
               <div className="complaintImageWrap">
                  <img
                     src={complaint.image_url}
                     alt={complaint.name}
                     className="complaintImage"
                  />
               </div>
            </OverviewCard>

            <OverviewCard>
               <div className="complaintDetails">
                  <div className="complaintRow">
                     <span className="complaintKey">Date filed</span>
                     <span className="complaintVal">
                        {formatDate(complaint.complaints_date)}
                     </span>
                  </div>

                  <div className="complaintRow">
                     <span className="complaintKey">Complainer</span>
                     <span className="complaintVal">{complainerDisplay}</span>
                  </div>

                  <div className="complaintRow">
                     <span className="complaintKey">Suspect</span>
                     <span className="complaintVal">{suspectDisplay}</span>
                  </div>

                  <div className="complaintRow">
                     <span className="complaintKey">Complaint ID</span>
                     <span className="complaintVal">#{complaint.id}</span>
                  </div>
               </div>
            </OverviewCard>
         </div>
      </div>
   );
};

export default ComplaintsPage;
