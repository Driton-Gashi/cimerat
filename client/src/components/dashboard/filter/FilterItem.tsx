import MyIcon from '../../icons/MyIcon';
import type { IconName } from '../../icons/MyIcon';
import DatePickerTable from '../../global/datepicker/DatePickerTable';
import type { datePickerStateType } from '../../../libs/types';

type P = {
   iconNameProp?: IconName;
   children?: React.ReactNode;
   type?: 'Date' | 'Something else';
   clickEvent?: React.MouseEventHandler<HTMLDivElement>;
   isDatePickerOpen?: boolean;
   date?: Date;
   setDate?: React.Dispatch<React.SetStateAction<datePickerStateType>>;
};

const FilterItem = ({
   iconNameProp,
   children,
   type,
   clickEvent,
   isDatePickerOpen,
   date,
   setDate,
}: P) => {
   if (type === 'Date' && date && setDate) {
      return (
         <div onClick={clickEvent} className="payments-filter-controls-item">
            {children} {iconNameProp && <MyIcon iconName={iconNameProp} />}
            {isDatePickerOpen && (
               <div className="payments-filter-controls-item-sub">
                  <DatePickerTable setDate={setDate} dateState={date} />
               </div>
            )}
         </div>
      );
   }

   return (
      <div className="payments-filter-controls-item">
         {children} {iconNameProp && <MyIcon iconName={iconNameProp} />}
      </div>
   );
};

export default FilterItem;
