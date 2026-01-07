import type { Loan, loanFilterType } from '../../../../libs/types';
import LoanTableDataItem from './LoanTableDataItem';

type P = {
   loans: Loan[];
   loanFilter: loanFilterType;
};

const LoansDataTable = ({ loans, loanFilter }: P) => {
   return (
      <div className="tableWrapper">
         <table border={0}>
            <thead>
               <tr className="firstRow">
                  <th>Name</th>
                  <th>Loan Date</th>
                  <th>Loaner</th>
                  <th>Loanee</th>
                  <th>Amount</th>
                  <th>Status</th>
               </tr>
            </thead>

            <tbody>
               {loans.length === 0 ? (
                  loanFilter.isFilterOn ? (
                     <tr>
                        <td colSpan={10}>No loans found with these filters</td>
                     </tr>
                  ) : (
                     <tr>
                        <td colSpan={10}>No loans to show!</td>
                     </tr>
                  )
               ) : (
                  loans.map((loan, index) => {
                     if (index == loans.length - 1)
                        return (
                           <LoanTableDataItem
                              id="new-loan"
                              key={loan.id}
                              loan={loan}
                           />
                        );
                     return <LoanTableDataItem key={loan.id} loan={loan} />;
                  })
               )}
            </tbody>
         </table>
      </div>
   );
};

export default LoansDataTable;
