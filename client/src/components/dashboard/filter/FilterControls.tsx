import { useState } from 'react';
import FilterItem from './FilterItem';
import { Link } from 'react-router-dom';
import type { datePickerStateType } from '../../../libs/types';
import MyIcon from '../../icons/MyIcon';

const FilterControls = () => {
   const [datePickerState, setDatePickerState] = useState<datePickerStateType>({
      date: new Date(),
      isDatePickerOpen: false,
   });

   return (
      <div className="payments-filter-wrapper">
         <div className="payments-filter-controls">
            <FilterItem iconNameProp="filter" />
            <FilterItem>Filter By</FilterItem>
            <FilterItem
               clickEvent={() => {
                  setDatePickerState((prev) => {
                     return {
                        ...prev,
                        isDatePickerOpen: !prev.isDatePickerOpen,
                     };
                  });
               }}
               type="Date"
               iconNameProp="chevronDown"
               isDatePickerOpen={datePickerState.isDatePickerOpen}
               date={datePickerState.date}
               setDate={setDatePickerState}
            >
               Date
            </FilterItem>

            <div className="payments-filter-controls-item">
               Order Type <MyIcon iconName="chevronDown" />
            </div>
            <div className="payments-filter-controls-item">
               Order Status <MyIcon iconName="chevronDown" />
            </div>
            <div className="payments-filter-controls-item red-text">
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
