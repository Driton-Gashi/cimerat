import { useState } from 'react';
import type { paymentFilterType } from '../../../../libs/types';
import MyIcon from '../../../icons/MyIcon';
import FilterItem from '../FilterItem';

type P = {
   isPaymentStatusOpen: boolean;
   setPaymentFilter: React.Dispatch<React.SetStateAction<paymentFilterType>>;
   status: '' | 'paid' | 'unpaid';
};
const PaymentStatus = ({ isPaymentStatusOpen, setPaymentFilter, status }: P) => {
   const changeType = (statusStr: '' | 'paid' | 'unpaid') => {
      setPaymentFilter((prev) => {
         const next = { ...prev, status: statusStr };

         const isOn = statusStr !== '' || next.type !== '';

         return {
            ...next,
            isFilterOn: isOn,
         };
      });
   };

   return (
      <FilterItem
         id="typeFilter"
         clickEvent={() => {
            setPaymentFilter((prev) => {
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
            Status {status} <MyIcon iconName="chevronDown" />
            {isPaymentStatusOpen && (
               <div className="payments-type-filter-controls-item-sub">
                  <div
                     onClick={() => changeType('paid')}
                     className={status === 'paid' ? 'active' : ''}
                     id="payment-type"
                  >
                     Paid
                  </div>
                  <div
                     onClick={() => changeType('unpaid')}
                     className={status === 'unpaid' ? 'active' : ''}
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
