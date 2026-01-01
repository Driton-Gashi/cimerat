import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import type { paymentFilterType } from '../../../libs/types';

type P = {
   dateState: Date;
   setDate: React.Dispatch<React.SetStateAction<paymentFilterType>>;
};

const DatePickerTable = ({ dateState, setDate }: P) => {
   return (
      <DatePicker
         selected={dateState}
         onChange={(selectedDate: Date | null) => {
            if (!selectedDate) return;
            setDate((prev) => {
               return {
                  ...prev,
                  date: selectedDate,
               };
            });
         }}
         inline
         onClickOutside={(e) => {
            const target = e.target as HTMLDivElement;

            if (target.id == 'date') return;
            setDate((prev) => {
               return {
                  ...prev,
                  isDatePickerOpen: false,
               };
            });
         }}
      />
   );
};

export default DatePickerTable;
