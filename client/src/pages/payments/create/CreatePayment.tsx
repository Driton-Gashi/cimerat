import { useState, useEffect, type ChangeEvent } from 'react';
import type { Payment, PaymentFormData } from '../../../libs/types';
import { post, get } from '../../../libs/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

import '../payments.css';
import { Link } from 'react-router-dom';
import MyIcon from '../../../components/icons/MyIcon';

type Member = { user_id: number; name: string; lastname: string; email: string };

const CreatePayment = () => {
   const navigate = useNavigate();
   const { currentApartmentId } = useAuth();
   const [members, setMembers] = useState<Member[]>([]);

   const [formData, setFormData] = useState<PaymentFormData>({
      category: '',
      name: '',
      date: '',
      payer_id: 0,
      amount: '',
      borrower_id: undefined,
   });

   useEffect(() => {
      if (!currentApartmentId) return;
      get(`/apartments/${currentApartmentId}/members`)
         .then((data: Member[]) => setMembers(Array.isArray(data) ? data : []))
         .catch(() => setMembers([]));
   }, [currentApartmentId]);

   useEffect(() => {
      if (members.length > 0 && formData.payer_id === 0) {
         setFormData((prev) => ({ ...prev, payer_id: members[0].user_id }));
      }
   }, [members]);

   const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;

      setFormData((prev) => ({
         ...prev,
         [name]: name === 'payer_id' ? Number(value) : value,
      }));
   };

   const handleSubmit = async () => {
      try {
         if (!formData.name || !formData.date || !formData.amount) {
            alert('Please fill all required fields');
            return;
         }

         const res = await post('/payments', formData);

         setFormData({
            category: '',
            name: '',
            date: '',
            payer_id: members[0]?.user_id ?? 0,
            amount: '',
         });
         let cachedPayments: Payment[] = JSON.parse(localStorage.getItem('payments') ?? '[]');
         cachedPayments.push(res.createdPayment);
         localStorage.setItem('payments', JSON.stringify(cachedPayments));
         navigate('/payments#new-payment');
      } catch (error) {
         console.error('Error creating payment:', error);
      }
   };

   return (
      <div className="create-payment-main">
         <div className="flex flex-space-between flex-align-center">
            <h1>Create a Payment</h1>
            <Link to="/payments">
               <button className="create-payment-btn">
                  <MyIcon iconName="chevronLeft" />
               </button>
            </Link>
         </div>

         <div className="create-payment-wrapper">
            <div className="payment-form-container">
               <div className="payment-form-grid">
                  <div className="payment-form-group">
                     <label>Category</label>
                     <select name="category" value={formData.category} onChange={handleChange}>
                        <option value="">Select Payment Type</option>
                        <option value="Bills">Bills</option>
                        <option value="Personal">Personal</option>
                        <option value="Product">Product</option>
                     </select>
                  </div>

                  <div className="payment-form-group">
                     <label>Payment Name</label>
                     <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter the payment name"
                     />
                  </div>

                  <div className="payment-form-group">
                     <label>Date</label>
                     <input type="date" name="date" value={formData.date} onChange={handleChange} />
                  </div>

                  <div className="payment-form-group">
                     <label>Payer</label>
                     <select name="payer_id" value={formData.payer_id} onChange={handleChange}>
                        {members.map((m) => (
                           <option key={m.user_id} value={m.user_id}>
                              {m.name} {m.lastname}
                           </option>
                        ))}
                     </select>
                  </div>

                  <div className="payment-form-group">
                     <label>Amount</label>
                     <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        placeholder="Enter the amount"
                     />
                  </div>
               </div>

               <button className="payment-form-submit-btn" onClick={handleSubmit}>
                  Add Now
               </button>
            </div>
         </div>
      </div>
   );
};

export default CreatePayment;
