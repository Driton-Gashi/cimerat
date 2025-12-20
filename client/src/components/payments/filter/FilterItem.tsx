import MyIcon from '../../icons/MyIcon';
import type { IconName } from '../../icons/MyIcon';

type P = {
   iconNameProp?: IconName;
   children?: React.ReactNode;
};

const FilterItem = ({ iconNameProp, children }: P) => {
   return (
      <div className="payments-filter-controls-item">
         {children} {iconNameProp && <MyIcon iconName={iconNameProp} />}
      </div>
   );
};

export default FilterItem;
