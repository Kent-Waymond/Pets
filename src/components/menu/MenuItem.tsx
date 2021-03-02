import React, { useMemo } from 'react';
import classnames from 'classnames';

export interface IMenuItemProps {
  ItemKey: string;
  title?: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
  selected?: boolean;
}

export function MenuItem(props: IMenuItemProps) {
  const { ItemKey, title, icon, disabled, selected } = props;

  const ComputedMenuItemClass = useMemo(() => {
    return classnames(
      'menu-item',
      {
        'menu-item-disabled': disabled,
      },
      {
        'menu-item-selected': selected,
      },
    );
  }, [disabled, selected]);
  return (
    <div className={ComputedMenuItemClass} data-key={ItemKey}>
      {/* {icon && (
        <span data-key={ItemKey}>{icon}</span>
      )} */}
      {icon && icon}
      <span>{title ?? ItemKey}</span>
    </div>
  );
}
