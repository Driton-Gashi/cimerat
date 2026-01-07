import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import type { loanFilterType } from '../../../../libs/types';

type P = {
   dateState: Date | null;
   setLoanFilter: React.Dispatch<React.SetStateAction<loanFilterType>>;
};

const LoanDatePickerTable = ({ dateState, setLoanFilter }: P) => {
   return (
      <DatePicker
         selected={dateState}
         onChange={(selectedDate: Date | null) => {
            if (!selectedDate) return;

            setLoanFilter((prev) => {
               const next = {
                  ...prev,
                  date: selectedDate,
                  isMonthFilterOn: true,
               };

               const isOn = next.isMonthFilterOn || next.status === 'paid' || next.status === 'unpaid';

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

export default LoanDatePickerTable;
