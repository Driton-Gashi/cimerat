import { useState, useEffect, type ChangeEvent } from 'react';
import type { Complaint, ComplaintFormData } from '../../../libs/types';
import { post, get } from '../../../libs/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

import '../../payments/payments.css';
import { Link } from 'react-router-dom';
import MyIcon from '../../../components/icons/MyIcon';

type Member = { user_id: number; name: string; lastname: string; email: string };

const CreateComplaint = () => {
   const navigate = useNavigate();
   const { currentApartmentId } = useAuth();
   const [members, setMembers] = useState<Member[]>([]);

   const [formData, setFormData] = useState<ComplaintFormData>({
      name: '',
      image_url: '',
      complaints_date: '',
      complainer_id: 0,
      suspect_id: 0,
   });

   useEffect(() => {
      if (!currentApartmentId) return;
      get(`/apartments/${currentApartmentId}/members`)
         .then((data: Member[]) => {
            const list = Array.isArray(data) ? data : [];
            setMembers(list);
            if (list.length >= 2) {
               setFormData((prev) => ({
                  ...prev,
                  complainer_id: list[0].user_id,
                  suspect_id: list[1].user_id,
               }));
            } else if (list.length === 1) {
               setFormData((prev) => ({
                  ...prev,
                  complainer_id: list[0].user_id,
                  suspect_id: list[0].user_id,
               }));
            }
         })
         .catch(() => setMembers([]));
   }, [currentApartmentId]);

   const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;

      setFormData((prev) => ({
         ...prev,
         [name]: name === 'complainer_id' || name === 'suspect_id' ? Number(value) : value,
      }));
   };

   const handleSubmit = async () => {
      try {
         if (
            !formData.name ||
            !formData.complaints_date ||
            !formData.image_url ||
            !formData.complainer_id ||
            !formData.suspect_id
         ) {
            alert('Please fill all required fields');
            return;
         }

         const res = await post('/complaints', formData);

         setFormData({
            name: '',
            image_url: '',
            complaints_date: '',
            complainer_id: members[0]?.user_id ?? 0,
            suspect_id: members.length > 1 ? members[1].user_id : (members[0]?.user_id ?? 0),
         });
         let cachedComplaints: Complaint[] = JSON.parse(localStorage.getItem('complaints') ?? '[]');
         cachedComplaints.push(res.createdComplaint);
         localStorage.setItem('complaints', JSON.stringify(cachedComplaints));
         navigate('/complaints#new-complaint');
      } catch (error) {
         console.error('Error creating complaint:', error);
      }
   };

   return (
      <div className="create-payment-main">
         <div className="flex flex-space-between flex-align-center">
            <h1>Create a Complaint</h1>
            <Link to="/complaints">
               <button className="create-payment-btn">
                  <MyIcon iconName="chevronLeft" />
               </button>
            </Link>
         </div>

         <div className="create-payment-wrapper">
            <div className="payment-form-container">
               <div className="payment-form-grid">
                  <div className="payment-form-group">
                     <label>Complaint Title</label>
                     <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter the complaint title"
                     />
                  </div>

                  <div className="payment-form-group">
                     <label>Image URL</label>
                     <input
                        type="text"
                        name="image_url"
                        value={formData.image_url}
                        onChange={handleChange}
                        placeholder="Paste an image URL"
                     />
                  </div>

                  <div className="payment-form-group">
                     <label>Date Filed</label>
                     <input
                        type="date"
                        name="complaints_date"
                        value={formData.complaints_date}
                        onChange={handleChange}
                     />
                  </div>

                  <div className="payment-form-group">
                     <label>Complainer</label>
                     <select
                        name="complainer_id"
                        value={formData.complainer_id}
                        onChange={handleChange}
                     >
                        {members.map((m) => (
                           <option key={m.user_id} value={m.user_id}>
                              {m.name} {m.lastname}
                           </option>
                        ))}
                     </select>
                  </div>

                  <div className="payment-form-group">
                     <label>Suspect</label>
                     <select name="suspect_id" value={formData.suspect_id} onChange={handleChange}>
                        {members.map((m) => (
                           <option key={m.user_id} value={m.user_id}>
                              {m.name} {m.lastname}
                           </option>
                        ))}
                     </select>
                  </div>
               </div>

               <button className="payment-form-submit-btn" onClick={handleSubmit}>
                  Create Complaint
               </button>
            </div>
         </div>
      </div>
   );
};

export default CreateComplaint;
