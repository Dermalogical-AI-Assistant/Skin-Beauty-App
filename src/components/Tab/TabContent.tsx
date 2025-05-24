  import React, { FC, Fragment } from "react";

  interface TabFCProps {
    children?: React.ReactNode;
    index?: number;
  }

  const TabContent: FC<TabFCProps> = (props) => {
    return (
      <Fragment>
        {props.children}
      </Fragment>
    );
  };
  export default TabContent;
