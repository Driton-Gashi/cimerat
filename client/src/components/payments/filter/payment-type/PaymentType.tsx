import type { paymentFilterType } from '../../../../libs/types';
import MyIcon from '../../../icons/MyIcon';
import FilterItem from '../FilterItem';

type P = {
   isPaymentTypeOpen: boolean;
   setPaymentFilter: React.Dispatch<React.SetStateAction<paymentFilterType>>;
   type: '' | 'Bills' | 'Personal' | 'Product';
};

const PaymentType = ({ isPaymentTypeOpen, type, setPaymentFilter }: P) => {
   const changeType = (typeStr: '' | 'Bills' | 'Personal' | 'Product') => {
      setPaymentFilter((prev) => {
         const next = { ...prev, type: typeStr };

         const isOn = typeStr !== '' || next.status === 'paid' || next.status === 'unpaid';

         return {
            ...next,
            isFilterOn: isOn,
            isPaymentTypeOpen: false,
         };
      });
   };

   return (
      <FilterItem
         id="typeFilter"
         clickEvent={() => {
            setPaymentFilter((prev) => ({
               ...prev,
               isPaymentTypeOpen: !prev.isPaymentTypeOpen,
               isDatePickerOpen: false,
               isPaymentStatusOpen: false,
            }));
         }}
      >
         <div id="type" className="payments-filter-controls-item">
            Type {type} <MyIcon iconName="chevronDown" />
            {isPaymentTypeOpen && (
               <div className="payments-type-filter-controls-item-sub">
                  <div
                     onClick={() => changeType('Bills')}
                     className={type === 'Bills' ? 'active' : ''}
                     id="payment-type"
                  >
                     Bills
                  </div>
                  <div
                     onClick={() => changeType('Personal')}
                     className={type === 'Personal' ? 'active' : ''}
                     id="payment-type"
                  >
                     Personal
                  </div>
                  <div
                     onClick={() => changeType('Product')}
                     className={type === 'Product' ? 'active' : ''}
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
