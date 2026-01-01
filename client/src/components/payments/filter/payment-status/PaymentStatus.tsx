import { useState } from 'react';
import type { paymentFilterType } from '../../../../libs/types';
import MyIcon from '../../../icons/MyIcon';
import FilterItem from '../FilterItem';

type P = {
   isPaymentStatusOpen: boolean;
   setPayment: React.Dispatch<React.SetStateAction<paymentFilterType>>;
   status: '' | 'paid' | 'unpaid';
};
const PaymentStatus = ({ isPaymentStatusOpen, setPayment, status }: P) => {
   const [statusState, setStatusState] = useState(status);
   const changeType = (statusStr: '' | 'paid' | 'unpaid') => {
      setPayment((prev) => {
         return {
            ...prev,
            status: statusStr,
         };
      });
      setStatusState(() => statusStr);
   };
   return (
      <FilterItem
         id="typeFilter"
         clickEvent={() => {
            setPayment((prev) => {
               return {
                  ...prev,
                  isPaymentStatusOpen: !prev.isPaymentStatusOpen,
                  isPaymentTypeOpen: false,
                  isDatePickerOpen: false,
               };
            });
         }}
      >
         <div id="type" className="payments-filter-controls-item">
            Status {statusState} <MyIcon iconName="chevronDown" />
            {isPaymentStatusOpen && (
               <div className="payments-type-filter-controls-item-sub">
                  <div
                     onClick={() => changeType('paid')}
                     className={statusState === 'paid' ? 'active' : ''}
                     id="payment-type"
                  >
                     Paid
                  </div>
                  <div
                     onClick={() => changeType('unpaid')}
                     className={statusState === 'unpaid' ? 'active' : ''}
                     id="payment-type"
                  >
                     Unpaid
                  </div>

                  <div onClick={() => changeType('')} id="payment-type">
                     Clear Status
                  </div>
               </div>
            )}
         </div>
      </FilterItem>
   );
};

export default PaymentStatus;
