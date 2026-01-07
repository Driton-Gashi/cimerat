import type { Loan } from '../../../../libs/types';
import { formatCurrency, formatDate } from '../../../../libs/utils';

type P = {
   loan: Loan;
   id?: string;
};

const LoanTableDataItem = ({ loan, id }: P) => {
   const loanStatus = loan?.status === 'paid' ? 'Paid' : 'Unpaid';

   const date = formatDate(loan.loan_date);

   return (
      <tr id={id} key={loan.id}>
         <td>{loan.name}</td>
         <td>{date}</td>
         <td>{loan.loaner_name}</td>
         <td>{loan.loanee_name}</td>
         <td>{formatCurrency(loan.amount)}</td>
         <td>
            <div className={`status ${loanStatus}`}>{loanStatus}</div>
         </td>
      </tr>
   );
};

export default LoanTableDataItem;
