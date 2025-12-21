import type { Payment } from '../../../libs/types';

type P = {
   payment: Payment;
};

const PaymentTableDataItem = ({ payment }: P) => {
   const date = new Date(payment.transaction_date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
   });

   return (
      <tr key={payment.id}>
         <td>{payment.id}</td>
         <td>{payment.category}</td>
         <td>{payment.name}</td>
         <td>{date}</td>
         <td>{payment.payer_name}</td>
         <td>{payment.amount}</td>
         <td>
            <div className={`status ${payment.status}`}>{payment.status}</div>
         </td>
      </tr>
   );
};

export default PaymentTableDataItem;
