import MyIcon from '../../icons/MyIcon';
import type { IconName } from '../../icons/MyIcon';

type P = {
   iconNameProp?: IconName;
   children?: React.ReactNode;
   id?: string;
   clickEvent?: React.MouseEventHandler<HTMLDivElement>;
};

const FilterItem = ({ clickEvent, iconNameProp, children, id }: P) => {
   return (
      <div onClick={clickEvent} id={id} className="payments-filter-controls-item">
         {children} {iconNameProp && <MyIcon iconName={iconNameProp} />}
      </div>
   );
};

export default FilterItem;
