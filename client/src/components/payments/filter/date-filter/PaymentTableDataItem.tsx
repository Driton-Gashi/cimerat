import { useNavigate } from 'react-router-dom';
import type { Payment } from '../../../../libs/types';
import { formatCurrency, formatDate } from '../../../../libs/utils';

type P = {
   payment: Payment;
   id?: string;
};

const PaymentTableDataItem = ({ payment, id }: P) => {
   const navigate = useNavigate();
   const paymentStatus = payment?.status === 'paid' ? 'Paid' : 'Unpaid';

   const date = formatDate(payment.transaction_date);

   return (
      <tr id={id} onClick={() => navigate(`/payments/${payment.id}`)} key={payment.id}>
         <td>{payment.category}</td>
         <td>{payment.name}</td>
         <td>{date}</td>
         <td>{payment.payer_name}</td>
         <td>{formatCurrency(payment.amount)}</td>
         <td>
            <div className={`status ${paymentStatus}`}>{paymentStatus}</div>
         </td>
      </tr>
   );
};

export default PaymentTableDataItem;
