import { useState, type ChangeEvent } from 'react';
import type { PaymentFormData } from '../../libs/types';
import { post } from '../../libs/api';

import './payments.css';

const CreatePayment = () => {
   const [formData, setFormData] = useState<PaymentFormData>({
      category: 'Bills',
      name: '',
      date: '',
      payer_id: 1,
      amount: '',
      borrower_id: 1,
   });

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

         // Reset form
         setFormData({
            category: 'Bills',
            name: '',
            date: '',
            payer_id: 1,
            amount: '',
         });
      } catch (error) {
         console.error('Error creating payment:', error);
      }
   };

   return (
      <div className="create-payment-main">
         <h1>Create a Payment</h1>

         <div className="create-payment-wrapper">
            <div className="upload-payment-picture">
               <img src="/paymentPicture.png" alt="" />
               <a href="#">Upload Photo</a>
            </div>

            <div className="payment-form-container">
               <div className="payment-form-grid">
                  <div className="payment-form-group">
                     <label>Category</label>
                     <select name="category" value={formData.category} onChange={handleChange}>
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
                     <label>Payer ID</label>
                     <select name="payer_id" value={formData.payer_id} onChange={handleChange}>
                        <option value="3">Diar</option>
                        <option value="1">Driton</option>
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
