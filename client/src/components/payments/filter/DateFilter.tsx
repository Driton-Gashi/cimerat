import type { datePickerStateType } from '../../../libs/types';
import DatePickerTable from '../../global/datepicker/DatePickerTable';
import MyIcon from '../../icons/MyIcon';

type P = {
   clickEvent: React.MouseEventHandler<HTMLDivElement>;
   isDatePickerOpen: boolean;
   date: Date;
   setDate: React.Dispatch<React.SetStateAction<datePickerStateType>>;
};
const DateFilter = ({ clickEvent, isDatePickerOpen, date, setDate }: P) => {
   return (
      <div onClick={clickEvent} id="date" className="payments-filter-controls-item">
         Date <MyIcon iconName="chevronDown" />
         {isDatePickerOpen && (
            <div className="payments-filter-controls-item-sub">
               <DatePickerTable setDate={setDate} dateState={date} />
            </div>
         )}
      </div>
   );
};

export default DateFilter;
