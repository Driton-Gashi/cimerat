import type { Payment, paymentFilterType } from '../../../../libs/types';
import PaymentTableDataItem from './PaymentTableDataItem';

type P = {
   payments: Payment[];
   paymentFilter: paymentFilterType;
};

const PaymentsDataTable = ({ payments, paymentFilter }: P) => {
   return (
      <div className="tableWrapper">
         <table border={0}>
            <thead>
               <tr className="firstRow">
                  <th>Category</th>
                  <th>Payment Name</th>
                  <th>Date</th>
                  <th>Payer</th>
                  <th>Amount</th>
                  <th>Status</th>
               </tr>
            </thead>

            <tbody>
               {payments.length === 0 ? (
                  paymentFilter.isFilterOn ? (
                     <tr>
                        <td colSpan={10}>No payments found with these filters</td>
                     </tr>
                  ) : (
                     <tr>
                        <td colSpan={10}>No payments to show!</td>
                     </tr>
                  )
               ) : (
                  payments.map((payment, index) => {
                     if (index == payments.length - 1)
                        return (
                           <PaymentTableDataItem
                              id="new-payment"
                              key={payment.id}
                              payment={payment}
                           />
                        );
                     return <PaymentTableDataItem key={payment.id} payment={payment} />;
                  })
               )}
            </tbody>
         </table>
      </div>
   );
};

export default PaymentsDataTable;
