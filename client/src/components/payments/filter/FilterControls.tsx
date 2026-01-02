import FilterItem from './FilterItem';
import { Link } from 'react-router-dom';
import type { paymentFilterType } from '../../../libs/types';
import MyIcon from '../../icons/MyIcon';
import DateFilter from './date-filter/DateFilter';
import PaymentType from './payment-type/PaymentType';
import PaymentStatus from './payment-status/PaymentStatus';

type P = {
   paymentFilter: paymentFilterType;
   setPaymentFilter: React.Dispatch<React.SetStateAction<paymentFilterType>>;
};

const FilterControls = ({ paymentFilter, setPaymentFilter }: P) => {
   return (
      <div className="payments-filter-wrapper">
         <div className="payments-filter-controls">
            <FilterItem iconNameProp="filter" />
            <FilterItem>Filter By</FilterItem>

            <DateFilter
               isDatePickerOpen={paymentFilter.isDatePickerOpen}
               date={paymentFilter.date}
               setPaymentFilter={setPaymentFilter}
            />

            <PaymentType
               type={paymentFilter.type}
               isPaymentTypeOpen={paymentFilter.isPaymentTypeOpen}
               setPaymentFilter={setPaymentFilter}
            />

            <PaymentStatus
               isPaymentStatusOpen={paymentFilter.isPaymentStatusOpen}
               status={paymentFilter.status}
               setPaymentFilter={setPaymentFilter}
            />

            <div
               onClick={() => {
                  setPaymentFilter(() => {
                     return {
                        isFilterOn: false,
                        isMonthFilterOn: false,
                        date: null,
                        isPaymentTypeOpen: false,
                        isDatePickerOpen: false,
                        isPaymentStatusOpen: false,
                        type: '',
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
         <Link to="/payments/create">
            <button className="create-payment-btn">+</button>
         </Link>
      </div>
   );
};

export default FilterControls;
