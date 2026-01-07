import FilterItem from './FilterItem';
import { Link } from 'react-router-dom';
import type { loanFilterType } from '../../../libs/types';
import MyIcon from '../../icons/MyIcon';
import LoanDateFilter from './date-filter/LoanDateFilter';
import LoanStatus from './loan-status/LoanStatus';

type P = {
   loanFilter: loanFilterType;
   setLoanFilter: React.Dispatch<React.SetStateAction<loanFilterType>>;
};

const FilterControls = ({ loanFilter, setLoanFilter }: P) => {
   return (
      <div className="payments-filter-wrapper">
         <div className="payments-filter-controls">
            <FilterItem iconNameProp="filter" />
            <FilterItem>Filter By</FilterItem>

            <LoanDateFilter
               isDatePickerOpen={loanFilter.isDatePickerOpen}
               date={loanFilter.date}
               setLoanFilter={setLoanFilter}
            />

            <LoanStatus
               isLoanStatusOpen={loanFilter.isLoanStatusOpen}
               status={loanFilter.status}
               setLoanFilter={setLoanFilter}
            />

            <div
               onClick={() => {
                  setLoanFilter(() => {
                     return {
                        isFilterOn: false,
                        isMonthFilterOn: false,
                        date: null,
                        isDatePickerOpen: false,
                        isLoanStatusOpen: false,
                        status: '',
                     };
                  });
               }}
               className="payments-filter-controls-item red-text"
            >
               <MyIcon iconName="reset" />
               Reset Filter
            </div>
         </div>
         <Link to="/loans/create">
            <button className="create-payment-btn">+</button>
         </Link>
      </div>
   );
};

export default FilterControls;
