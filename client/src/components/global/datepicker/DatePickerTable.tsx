import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import type { datePickerStateType } from '../../../libs/types';

type P = {
   dateState: Date;
   setDate: React.Dispatch<React.SetStateAction<datePickerStateType>>;
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
         }} //only when value has changed
         inline
         onClickOutside={(e) => {
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
