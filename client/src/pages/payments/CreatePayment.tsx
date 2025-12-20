import { useState, type ChangeEvent } from 'react';
import './payments.css';
import type { PaymentFormData } from '../../libs/types';

const CreatePayment = () => {
   const [formData, setFormData] = useState<PaymentFormData>({
      category: 'Bills',
      payment_name: '',
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
         if (!formData.payment_name || !formData.date || !formData.amount) {
            alert('Please fill all required fields');
            return;
         }

         const response = await fetch('http://localhost:4000/payments', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               category: formData.category,
               name: formData.payment_name,
               date: formData.date,
               payer_id: formData.payer_id,
               amount: Number(formData.amount),
               borrower_id: formData.borrower_id,
            }),
         });

         if (!response.ok) {
            throw new Error('Failed to create payment');
         }

         const data = await response.json();
         console.log('Payment created:', data);

         // Reset form
         setFormData({
            category: 'Bills',
            payment_name: '',
            date: '',
            payer_id: 1,
            amount: '',
            borrower_id: 1,
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
                        name="payment_name"
                        value={formData.payment_name}
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
                        <option value="1">Diar</option>
                        <option value="2">Driton</option>
                        <option value="3">Hamza</option>
                        <option value="4">Denis</option>
                        <option value="5">Adi</option>
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

                  {formData.category === 'Personal' && (
                     <div className="payment-form-group">
                        <label>Person who owes the amount</label>
                        <select
                           name="borrower_id"
                           value={formData.borrower_id}
                           onChange={handleChange}
                        >
                           <option value="1">Diar</option>
                           <option value="2">Driton</option>
                           <option value="3">Hamza</option>
                           <option value="4">Denis</option>
                           <option value="5">Adi</option>
                        </select>
                     </div>
                  )}
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
