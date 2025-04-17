// ContextMenuItem.tsx
import React from 'react';

interface ContextMenuItemProps {
  icon?: React.ReactNode;
  label: string;
  onClick?: () => void;
  href?: string;
}

const ContextMenuItem: React.FC<ContextMenuItemProps> = ( props) => {
  const classes = "flex items-center px-4 py-2 text-sm hover:bg-gray-100 transition";

  if (props.href) {
    return (
      <li>
        <a href={props.href} className={classes}>
          {props.icon && <span className="mr-2">{props.icon}</span>}
          {props.label}
        </a>
      </li>
    );
  }

  return (
    <li>
      <button onClick={props.onClick} className={`${classes} w-full text-left`}>
        {props.icon && <span className="mr-2">{props.icon}</span>}
        {props.label}
      </button>
    </li>
  );
};

export default ContextMenuItem;
