import type { loanFilterType } from '../../../../libs/types';
import LoanDatePickerTable from './LoanDatePickerTable';
import MyIcon from '../../../icons/MyIcon';
import FilterItem from '../FilterItem';

type P = {
   isDatePickerOpen: boolean;
   date: Date | null;
   setLoanFilter: React.Dispatch<React.SetStateAction<loanFilterType>>;
};
const LoanDateFilter = ({ isDatePickerOpen, date, setLoanFilter }: P) => {
   return (
      <FilterItem
         clickEvent={(e) => {
            const target = e.target as HTMLDivElement;
            if (target.closest('.payments-filter-controls-item-sub')) return;

            setLoanFilter((prev) => {
               return {
                  ...prev,
                  isDatePickerOpen: !prev.isDatePickerOpen,
                  isLoanStatusOpen: false,
               };
            });
         }}
         id="date"
      >
         <div className="payments-filter-controls-item">
            Date {date?.toLocaleString('en-GB', { month: 'short', year: 'numeric' }) ?? ''}
            <MyIcon iconName="chevronDown" />
            {isDatePickerOpen && (
               <div className="payments-filter-controls-item-sub">
                  <LoanDatePickerTable setLoanFilter={setLoanFilter} dateState={date} />

                  <div
                     onClick={() => {
                        setLoanFilter((prev) => {
                           const next = {
                              ...prev,
                              isMonthFilterOn: false,
                              date: null,
                           };

                           const isOn = next.status === 'paid' || next.status === 'unpaid';

                           return { ...next, isFilterOn: isOn, isDatePickerOpen: false };
                        });
                     }}
                     className="link-button"
                  >
                     Clear Month
                  </div>
               </div>
            )}
         </div>
      </FilterItem>
   );
};

export default LoanDateFilter;
