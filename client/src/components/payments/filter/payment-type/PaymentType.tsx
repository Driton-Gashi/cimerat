import { useState } from 'react';
import type { paymentFilterType } from '../../../../libs/types';
import MyIcon from '../../../icons/MyIcon';
import FilterItem from '../FilterItem';

type P = {
   isPaymentTypeOpen: boolean;
   setPayment: React.Dispatch<React.SetStateAction<paymentFilterType>>;
   type: '' | 'Bills' | 'Personal' | 'Product';
};
const PaymentType = ({ isPaymentTypeOpen, type, setPayment }: P) => {
   const [typeState, setTypeState] = useState(type);
   const changeType = (typeStr: '' | 'Bills' | 'Personal' | 'Product') => {
      setPayment((prev) => {
         return {
            ...prev,
            type: typeStr,
         };
      });
      setTypeState(() => typeStr);
   };
   return (
      <FilterItem
         id="typeFilter"
         clickEvent={() => {
            setPayment((prev) => {
               return {
                  ...prev,
                  type: typeState,
                  isPaymentTypeOpen: !prev.isPaymentTypeOpen,
                  isDatePickerOpen: false,
                  isPaymentStatusOpen: false,
               };
            });
         }}
      >
         <div id="type" className="payments-filter-controls-item">
            Type {typeState} <MyIcon iconName="chevronDown" />
            {isPaymentTypeOpen && (
               <div className="payments-type-filter-controls-item-sub">
                  <div
                     onClick={() => changeType('Bills')}
                     className={typeState === 'Bills' ? 'active' : ''}
                     id="payment-type"
                  >
                     Bills
                  </div>
                  <div
                     onClick={() => changeType('Personal')}
                     className={typeState === 'Personal' ? 'active' : ''}
                     id="payment-type"
                  >
                     Personal
                  </div>
                  <div
                     onClick={() => changeType('Product')}
                     className={typeState === 'Product' ? 'active' : ''}
                     id="payment-type"
                  >
                     Product
                  </div>
                  <div onClick={() => changeType('')} id="payment-type">
                     Clear Type
                  </div>
               </div>
            )}
         </div>
      </FilterItem>
   );
};

export default PaymentType;
