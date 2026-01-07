import { useState, useEffect, type ChangeEvent } from 'react';
import type { Loan, LoanFormData, Cimer } from '../../../libs/types';
import { post, get } from '../../../libs/api';
import { useNavigate } from 'react-router-dom';

import '../loans.css';
import { Link } from 'react-router-dom';
import MyIcon from '../../../components/icons/MyIcon';

const CreateLoan = () => {
   const navigate = useNavigate();

   const [formData, setFormData] = useState<LoanFormData>({
      name: '',
      loan_date: '',
      loaner_id: 1,
      loanee_id: 1,
      amount: '',
   });

   const [cimerat, setCimerat] = useState<Cimer[]>([]);

   useEffect(() => {
      const fetchCimerat = async () => {
         try {
            const users: Cimer[] = await get('/cimerat');
            setCimerat(users);
            if (users.length > 0) {
               setFormData((prev) => ({
                  ...prev,
                  loaner_id: users[0].id,
                  loanee_id: users.length > 1 ? users[1].id : users[0].id,
               }));
            }
         } catch (error) {
            console.error('Error fetching cimerat:', error);
         }
      };

      fetchCimerat();
   }, []);

   const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;

      setFormData((prev) => ({
         ...prev,
         [name]: name === 'loaner_id' || name === 'loanee_id' ? Number(value) : value,
      }));
   };

   const handleSubmit = async () => {
      try {
         if (!formData.name || !formData.loan_date || !formData.amount) {
            alert('Please fill all required fields');
            return;
         }

         if (formData.loaner_id === formData.loanee_id) {
            alert('Loaner and loanee cannot be the same person');
            return;
         }

         const res = await post('/loans', formData);

         setFormData({
            name: '',
            loan_date: '',
            loaner_id: cimerat.length > 0 ? cimerat[0].id : 1,
            loanee_id: cimerat.length > 1 ? cimerat[1].id : cimerat[0]?.id || 1,
            amount: '',
         });
         let cachedLoans: Loan[] = JSON.parse(localStorage.getItem('loans') ?? '[]');
         cachedLoans.push(res.createdLoan);
         localStorage.setItem('loans', JSON.stringify(cachedLoans));
         navigate('/loans#new-loan');
      } catch (error) {
         console.error('Error creating loan:', error);
      }
   };

   return (
      <div className="create-payment-main">
         <div className="flex flex-space-between flex-align-center">
            <h1>Create a Loan</h1>
            <Link to="/loans">
               <button className="create-payment-btn">
                  <MyIcon iconName="chevronLeft" />
               </button>
            </Link>
         </div>

         <div className="create-payment-wrapper">
            <div className="payment-form-container">
               <div className="payment-form-grid">
                  <div className="payment-form-group">
                     <label>Loan Name</label>
                     <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter the loan name"
                     />
                  </div>

                  <div className="payment-form-group">
                     <label>Loan Date</label>
                     <input
                        type="date"
                        name="loan_date"
                        value={formData.loan_date}
                        onChange={handleChange}
                     />
                  </div>

                  <div className="payment-form-group">
                     <label>Loaner</label>
                     <select
                        name="loaner_id"
                        value={formData.loaner_id}
                        onChange={handleChange}
                     >
                        {cimerat.map((user) => (
                           <option key={user.id} value={user.id}>
                              {user.name} {user.lastname}
                           </option>
                        ))}
                     </select>
                  </div>

                  <div className="payment-form-group">
                     <label>Loanee</label>
                     <select
                        name="loanee_id"
                        value={formData.loanee_id}
                        onChange={handleChange}
                     >
                        {cimerat.map((user) => (
                           <option key={user.id} value={user.id}>
                              {user.name} {user.lastname}
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

export default CreateLoan;
