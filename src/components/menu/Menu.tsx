import React, { useEffect, useMemo, useState } from 'react';
import classnames from 'classnames';
import { IMenuItemProps, MenuItem } from './MenuItem';

export type MenuItemType = IMenuItemProps;
export interface IMenuProps {
  items: MenuItemType[];
  defaultSelectedKey?: string[];
  mode?: 'vertical' | 'horizontal';
  onClick?: (key: string, selectedKeys: string[], domEvent?: Event) => void;
  selectedKeys?: string[];
}

export function Menu(props: IMenuProps) {
  const { items, mode, onClick } = props;
  const [menuItemSelected, changeMenuItemSelected] = useState<string[]>([]);

  useEffect(() => {
    if (items instanceof Array) {
      const firstKey = items[0] ? items[0].ItemKey : '';
      changeMenuItemSelected([firstKey]);
      if (onClick) {
        onClick(firstKey, [firstKey]);
      }
    }
  }, [items, onClick]);

  const computedMenuClasses = useMemo(() => {
    return classnames('menu', {
      'menu-horizontal': mode === 'horizontal',
    });
  }, [mode]);

  function handleMenuClick(event: any) {
    let target = event.target;
    while (target && !target?.dataset?.key) {
      target = target?.parentNode;
    }
    if (target) {
      const key = target.dataset.key;
      changeMenuItemSelected([key]);
      if (onClick) {
        onClick(key, [key], event);
      }
    }
  }

  return (
    <div className={computedMenuClasses} onClick={handleMenuClick}>
      {items instanceof Array &&
        items.map((item: MenuItemType) => {
          const { ItemKey, selected, ...restItem } = item;
          const itemSelected = selected ?? menuItemSelected?.includes(ItemKey);

          return (
            <MenuItem
              key={ItemKey}
              ItemKey={ItemKey}
              selected={itemSelected}
              {...restItem}
            />
          );
        })}
    </div>
  );
}
