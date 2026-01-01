import { useState } from 'react';
import FilterItem from './FilterItem';
import { Link } from 'react-router-dom';
import type { paymentFilterType } from '../../../libs/types';
import MyIcon from '../../icons/MyIcon';
import DateFilter from './date-filter/DateFilter';
import PaymentType from './payment-type/PaymentType';
import PaymentStatus from './payment-status/PaymentStatus';

const FilterControls = () => {
   const [paymentFilter, setPaymentFilter] = useState<paymentFilterType>({
      date: new Date(),
      isDatePickerOpen: false,
      isPaymentTypeOpen: false,
      isPaymentStatusOpen: false,
      type: '',
      status: '',
   });

   return (
      <div className="payments-filter-wrapper">
         <div className="payments-filter-controls">
            <FilterItem iconNameProp="filter" />
            <FilterItem>Filter By</FilterItem>

            <DateFilter
               isDatePickerOpen={paymentFilter.isDatePickerOpen}
               date={paymentFilter.date}
               setDate={setPaymentFilter}
            />

            <PaymentType
               type={paymentFilter.type}
               isPaymentTypeOpen={paymentFilter.isPaymentTypeOpen}
               setPayment={setPaymentFilter}
            />
            <PaymentStatus
               isPaymentStatusOpen={paymentFilter.isPaymentStatusOpen}
               status={paymentFilter.status}
               setPayment={setPaymentFilter}
            />

            <div
               onClick={() => {
                  setPaymentFilter(() => {
                     return {
                        date: new Date(),
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
