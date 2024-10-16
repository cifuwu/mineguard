import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';

const CustomScrollbars = React.forwardRef<any, any>(
  (props, ref) => (
    <Scrollbars {...props} ref={ref} />
  )
);

CustomScrollbars.displayName = 'CustomScrollbars';

export default CustomScrollbars;
