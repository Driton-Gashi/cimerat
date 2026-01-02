import type { paymentFilterType } from '../../../../libs/types';
import DatePickerTable from '../../../global/datepicker/DatePickerTable';
import MyIcon from '../../../icons/MyIcon';
import FilterItem from '../FilterItem';

type P = {
   isDatePickerOpen: boolean;
   date: Date | null;
   setPaymentFilter: React.Dispatch<React.SetStateAction<paymentFilterType>>;
};
const DateFilter = ({ isDatePickerOpen, date, setPaymentFilter }: P) => {
   return (
      <FilterItem
         clickEvent={(e) => {
            const target = e.target as HTMLDivElement;
            if (target.closest('.payments-filter-controls-item-sub')) return;

            setPaymentFilter((prev) => {
               return {
                  ...prev,
                  isDatePickerOpen: !prev.isDatePickerOpen,
                  isPaymentStatusOpen: false,
                  isPaymentTypeOpen: false,
               };
            });
         }}
         id="date"
      >
         <div className="payments-filter-controls-item">
            Date {date?.toLocaleString('en-GB', { month: 'short', year: 'numeric' }) ?? 'MMM YYYY'}
            <MyIcon iconName="chevronDown" />
            {isDatePickerOpen && (
               <div className="payments-filter-controls-item-sub">
                  <DatePickerTable setPaymentFilter={setPaymentFilter} dateState={date} />

                  <div
                     onClick={() => {
                        setPaymentFilter((prev) => {
                           const next = {
                              ...prev,
                              isMonthFilterOn: false,
                              date: null,
                           };

                           const isOn =
                              next.type !== '' ||
                              next.status === 'paid' ||
                              next.status === 'unpaid';

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

export default DateFilter;
