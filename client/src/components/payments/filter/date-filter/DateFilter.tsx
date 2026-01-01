import type { paymentFilterType } from '../../../../libs/types';
import DatePickerTable from '../../../global/datepicker/DatePickerTable';
import MyIcon from '../../../icons/MyIcon';
import FilterItem from '../FilterItem';

type P = {
   isDatePickerOpen: boolean;
   date: Date;
   setDate: React.Dispatch<React.SetStateAction<paymentFilterType>>;
};
const DateFilter = ({ isDatePickerOpen, date, setDate }: P) => {
   return (
      <FilterItem
         clickEvent={() => {
            setDate((prev) => {
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
         <div id="date" className="payments-filter-controls-item">
            Date <MyIcon iconName="chevronDown" />
            {isDatePickerOpen && (
               <div className="payments-filter-controls-item-sub">
                  <DatePickerTable setDate={setDate} dateState={date} />
               </div>
            )}
         </div>
      </FilterItem>
   );
};

export default DateFilter;
