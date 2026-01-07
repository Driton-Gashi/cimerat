import { useEffect, useState } from 'react';
import MyIcon from '../../components/icons/MyIcon';
import { get } from '../../libs/api';
import type { Loan, loanFilterType } from '../../libs/types';

import './loans.css';
import FilterControls from '../../components/loans/filter/FilterControls';
import LoansDataTable from '../../components/loans/filter/date-filter/LoansDataTable';

const Loans = () => {
   const [loanFilter, setLoanFilter] = useState<loanFilterType>({
      isFilterOn: false,
      isMonthFilterOn: false,
      date: null,
      isDatePickerOpen: false,
      isLoanStatusOpen: false,
      status: '',
   });

   const [allLoans, setAllLoans] = useState<Loan[]>(() => {
      try {
         return JSON.parse(localStorage.getItem('loans') ?? '[]');
      } catch {
         return [];
      }
   });

   const [loading, setLoading] = useState(allLoans.length === 0);

   useEffect(() => {
      const fetchData = async () => {
         try {
            const loans: Loan[] = await get('/loans');
            setAllLoans(loans);
            localStorage.setItem('loans', JSON.stringify(loans));
         } catch (error) {
            console.error('Error fetching loans: ', error);
         } finally {
            setLoading(false);
         }
      };

      fetchData();
   }, []);

   const loans = !loanFilter.isFilterOn
      ? allLoans
      : allLoans.filter((loan) => {
           if (loanFilter.status === 'paid' || loanFilter.status === 'unpaid') {
              if (loan.status !== loanFilter.status) return false;
           }

           if (loanFilter.isMonthFilterOn) {
              const selectedYear = loanFilter?.date?.getFullYear();
              const selectedMonth = loanFilter?.date?.getMonth();

              const d = new Date(loan.loan_date);
              if (Number.isNaN(d.getTime())) return false;

              if (d.getFullYear() !== selectedYear) return false;
              if (d.getMonth() !== selectedMonth) return false;
           }

           return true;
        });

   if (loading) return <LoanLoadingScreen />;

   return (
      <div className="payments">
         <h1>Loans</h1>
         <FilterControls loanFilter={loanFilter} setLoanFilter={setLoanFilter} />
         <LoansDataTable loanFilter={loanFilter} loans={loans} />
      </div>
   );
};

export default Loans;

const LoanLoadingScreen = () => {
   return (
      <div className="payments">
         <h1>Loans</h1>
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
                  <tr>
                     <th colSpan={10}>
                        <div className="loadingPaymentsMessage">
                           Loans are loading <MyIcon iconName="loadingSvg" />
                        </div>
                     </th>
                  </tr>
               </tbody>
            </table>
         </div>
      </div>
   );
};
