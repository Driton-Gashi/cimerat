import { useNavigate } from 'react-router-dom';
import type { Payment } from '../../../../libs/types';

type P = {
   payment: Payment;
};

const PaymentTableDataItem = ({ payment }: P) => {
   const navigate = useNavigate();
   const paymentStatus = payment?.status === 'paid' ? 'Paid' : 'Unpaid';

   const date = new Date(payment.transaction_date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
   });

   return (
      <tr onClick={() => navigate(`/payments/${payment.id}`)} key={payment.id}>
         <td>{payment.id}</td>
         <td>{payment.category}</td>
         <td>{payment.name}</td>
         <td>{date}</td>
         <td>{payment.payer_name}</td>
         <td>{payment.amount}</td>
         <td>
            <div className={`status ${paymentStatus}`}>{paymentStatus}</div>
         </td>
      </tr>
   );
};

export default PaymentTableDataItem;
