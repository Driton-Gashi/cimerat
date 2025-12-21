import type { Payment } from '../../../libs/types';
import PaymentTableDataItem from './PaymentTableDataItem';

type P = {
   payments: Payment[];
};

const PaymentsDataTable = ({ payments }: P) => {
   return (
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
                     <PaymentTableDataItem key={payment.id} payment={payment} />
                  ))
               )}
            </tbody>
         </table>
      </div>
   );
};

export default PaymentsDataTable;
