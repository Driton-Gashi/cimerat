import { useEffect, useState } from 'react';
import { get } from '../../../libs/api';
import type { Payment } from '../../../libs/types';
import { Link, useParams } from 'react-router-dom';
import MyIcon from '../../../components/icons/MyIcon';
import './paymentPage.css';
import OverviewCard from '../../../components/dashboard/overview-card/OverviewCard';

const PaymentPage = () => {
   const [payment, setPayment] = useState<Payment | null>(null);
   const [loading, setLoading] = useState<boolean>(true);

   const { id } = useParams();

   useEffect(() => {
      try {
         const fetchData = async () => {
            const payment = await get(`/payments/${id}`);
            setPayment(payment);
         };
         fetchData();
      } catch (error) {
         console.error(error);
      } finally {
         setLoading(false);
      }
   }, []);

   if (loading)
      return (
         <div className="singlePayment">
            <div className="flex space-between align-items-center">
               <h1>Loading...</h1>
               <Link to="/payments">
                  <button className="create-payment-btn">
                     <MyIcon iconName="chevronLeft" />
                  </button>
               </Link>
            </div>
         </div>
      );

   return (
      <div className="singlePayment">
         <div className="flex space-between align-items-center">
            <h1>{payment?.name}</h1>
            <Link to="/payments">
               <button className="create-payment-btn">
                  <MyIcon iconName="chevronLeft" />
               </button>
            </Link>
         </div>
         <OverviewCard>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Unde odit, laboriosam quos
            voluptas itaque placeat distinctio ut tempore! Rem, tenetur vero ab tempore est facilis
            nulla nobis voluptatem mollitia deleniti!
         </OverviewCard>
      </div>
   );
};

export default PaymentPage;
