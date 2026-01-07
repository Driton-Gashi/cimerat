import { useState } from 'react';
import type { loanFilterType } from '../../../../libs/types';
import MyIcon from '../../../icons/MyIcon';
import FilterItem from '../FilterItem';

type P = {
   isLoanStatusOpen: boolean;
   setLoanFilter: React.Dispatch<React.SetStateAction<loanFilterType>>;
   status: '' | 'paid' | 'unpaid';
};
const LoanStatus = ({ isLoanStatusOpen, setLoanFilter, status }: P) => {
   const changeStatus = (statusStr: '' | 'paid' | 'unpaid') => {
      setLoanFilter((prev) => {
         const next = { ...prev, status: statusStr };

         const isOn = statusStr !== '';

         return {
            ...next,
            isFilterOn: isOn,
            isLoanStatusOpen: false,
         };
      });
   };

   return (
      <FilterItem
         id="typeFilter"
         clickEvent={() => {
            setLoanFilter((prev) => {
               return {
                  ...prev,
                  isLoanStatusOpen: !prev.isLoanStatusOpen,
                  isDatePickerOpen: false,
               };
            });
         }}
      >
         <div id="type" className="payments-filter-controls-item">
            Status {status} <MyIcon iconName="chevronDown" />
            {isLoanStatusOpen && (
               <div className="payments-type-filter-controls-item-sub">
                  <div
                     onClick={() => changeStatus('paid')}
                     className={status === 'paid' ? 'active' : ''}
                     id="payment-type"
                  >
                     Paid
                  </div>
                  <div
                     onClick={() => changeStatus('unpaid')}
                     className={status === 'unpaid' ? 'active' : ''}
                     id="payment-type"
                  >
                     Unpaid
                  </div>

                  <div onClick={() => changeStatus('')} id="payment-type">
                     Clear Status
                  </div>
               </div>
            )}
         </div>
      </FilterItem>
   );
};

export default LoanStatus;
