import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import type { paymentFilterType } from '../../../libs/types';

type P = {
   dateState: Date | null;
   setPaymentFilter: React.Dispatch<React.SetStateAction<paymentFilterType>>;
};

const DatePickerTable = ({ dateState, setPaymentFilter }: P) => {
   return (
      <DatePicker
         selected={dateState}
         onChange={(selectedDate: Date | null) => {
            if (!selectedDate) return;

            setPaymentFilter((prev) => {
               const next = {
                  ...prev,
                  date: selectedDate,
                  isMonthFilterOn: true,
               };

               const isOn =
                  next.isMonthFilterOn ||
                  next.type !== '' ||
                  next.status === 'paid' ||
                  next.status === 'unpaid';

               return {
                  ...next,
                  isFilterOn: isOn,
                  isDatePickerOpen: false,
               };
            });
         }}
         dateFormat="MM/yyyy"
         showMonthYearPicker
         inline
      />
   );
};

export default DatePickerTable;
