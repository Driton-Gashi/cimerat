import { useState, type ChangeEvent } from 'react';
import type { Complaint, ComplaintFormData } from '../../../libs/types';
import { post } from '../../../libs/api';
import { useNavigate } from 'react-router-dom';

import '../../payments/payments.css';
import { Link } from 'react-router-dom';
import MyIcon from '../../../components/icons/MyIcon';

const CreateComplaint = () => {
   const navigate = useNavigate();

   const [formData, setFormData] = useState<ComplaintFormData>({
      name: '',
      image_url: '',
      complaints_date: '',
      complainer_id: 1,
      suspect_id: 2,
   });

   const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;

      setFormData((prev) => ({
         ...prev,
         [name]:
            name === 'complainer_id' || name === 'suspect_id' ? Number(value) : value,
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
            complainer_id: 1,
            suspect_id: 2,
         });
         let cachedComplaints: Complaint[] = JSON.parse(
            localStorage.getItem('complaints') ?? '[]',
         );
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
                     <label>Complainer ID</label>
                     <input
                        type="number"
                        name="complainer_id"
                        value={formData.complainer_id}
                        onChange={handleChange}
                        placeholder="Enter complainer ID"
                        min={1}
                     />
                  </div>

                  <div className="payment-form-group">
                     <label>Suspect ID</label>
                     <input
                        type="number"
                        name="suspect_id"
                        value={formData.suspect_id}
                        onChange={handleChange}
                        placeholder="Enter suspect ID"
                        min={1}
                     />
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
