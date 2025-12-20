import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MyIcon from '../../components/icons/MyIcon';
import { get } from '../../libs/api';
import type { Payment, datePickerStateType } from '../../libs/types';

import FilterItem from '../../components/dashboard/filter/FilterItem';
import './payments.css';

const Payments = () => {
   const [payments, setPayments] = useState<Payment[]>([]);
   const [loading, setLoading] = useState<boolean>(true);
   const [datePickerState, setDatePickerState] = useState<datePickerStateType>({
      date: new Date(),
      isDatePickerOpen: false,
   });

   useEffect(() => {
      const fetchData = async () => {
         try {
            const payments: Payment[] = await get('/payments');

            setPayments(payments);
         } catch (error) {
            console.error('Driton we got an error: ', error);
         } finally {
            setLoading(false);
         }
      };

      fetchData();
   }, []);

   if (loading)
      return (
         <div className="payments">
            <h1>Payments</h1>
            <div className="tableWrapper">
               <table border={0}>
                  <thead>
                     <tr className="firstRow">
                        <th>ID</th>
                        <th>Category</th>
                        <th>Payment Name</th>
                        <th>Date</th>
                        <th>Payer</th>
                        <th>Amount</th>
                        <th>Status</th>
                     </tr>
                  </thead>
                  <tbody>
                     <tr>
                        <th colSpan={10}>
                           <div className="loadingPaymentsMessage">
                              Payments are loading <MyIcon iconName="loadingSvg" />
                           </div>
                        </th>
                     </tr>
                  </tbody>
               </table>
            </div>
         </div>
      );

   return (
      <div className="payments">
         <h1>Payments</h1>
         <div className="payments-filter-wrapper">
            <div className="payments-filter-controls">
               <FilterItem iconNameProp="filter" />
               <FilterItem>Filter By</FilterItem>
               <FilterItem
                  clickEvent={() => {
                     setDatePickerState((prev) => {
                        return {
                           ...prev,
                           isDatePickerOpen: !prev.isDatePickerOpen,
                        };
                     });
                  }}
                  type="Date"
                  iconNameProp="chevronDown"
                  isDatePickerOpen={datePickerState.isDatePickerOpen}
                  date={datePickerState.date}
                  setDate={setDatePickerState}
               >
                  Date
               </FilterItem>

               <div className="payments-filter-controls-item">
                  Order Type <MyIcon iconName="chevronDown" />
               </div>
               <div className="payments-filter-controls-item">
                  Order Status <MyIcon iconName="chevronDown" />
               </div>
               <div className="payments-filter-controls-item red-text">
                  <MyIcon iconName="reset" />
                  Reset Filter
               </div>
            </div>
            <Link to="/payments/create">
               <button className="create-payment-btn">+</button>
            </Link>
         </div>
         <div className="tableWrapper">
            <table border={0}>
               <thead>
                  <tr className="firstRow">
                     <th>ID</th>
                     <th>Category</th>
                     <th>Payment Name</th>
                     <th>Date</th>
                     <th>Payer</th>
                     <th>Amount</th>
                     <th>Status</th>
                  </tr>
               </thead>

               <tbody>
                  {!payments.length ? (
                     <tr>
                        <th className="errorMessage" colSpan={10}>
                           Something went wrong no payments were found!
                        </th>
                     </tr>
                  ) : (
                     payments.map((payment) => (
                        <tr key={payment.id}>
                           <td>{payment.id}</td>
                           <td>{payment.category}</td>
                           <td>{payment.name}</td>
                           <td>
                              {new Date(payment.transaction_date).toLocaleDateString('en-GB', {
                                 day: '2-digit',
                                 month: 'short',
                                 year: 'numeric',
                              })}
                           </td>
                           <td>{payment.payer_name}</td>
                           <td>{payment.amount}</td>
                           <td>
                              <div className={`status ${payment.status}`}>{payment.status}</div>
                           </td>
                        </tr>
                     ))
                  )}
               </tbody>
            </table>
         </div>
      </div>
   );
};

export default Payments;
