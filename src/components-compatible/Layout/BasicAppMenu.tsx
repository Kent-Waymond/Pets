import React, { useMemo, useState, useEffect } from 'react';
import { IRoute, useHistory, useLocation } from 'umi';
import { Menu } from 'antd';

import { IAppMenuRecord } from './type';
import { formatterMenuDatas } from './routeUtil';

interface IBasicAppMenuProps {
  route: IRoute;
  currentAuthority: string;
}

const SubMenu = Menu.SubMenu;

export function BasicAppMenu(props: IBasicAppMenuProps) {
  const { route, currentAuthority } = props;

  const { authority = [], routes = [] } = route;
  // console.log(authority, 'authority');
  // console.log(currentAuthority, 'currentAuthority');
  // console.log(routes, 'routes');

  const history = useHistory();
  const location = useLocation();
  const [selectedKeys, ChangeSelectedKey] = useState(['/']);
  // console.log(history, 'history');
  // console.log(location, 'location ');

  const MenuDatas: IAppMenuRecord[] = useMemo(() => {
    return formatterMenuDatas(routes, authority, currentAuthority);
  }, [currentAuthority, authority, routes]);
  // console.log(MenuDatas, 'MenuDatas');
  useEffect(() => {
    ChangeSelectedKey([location.pathname]);
  }, [location.pathname]);

  function RenderMenu(Menus: object[]): React.ReactNode {
    return Menus.map((MenuItem: any, index: number) => {
      if (MenuItem.path && !MenuItem.hideInMenu) {
        let className = 'app-menu-item';
        if (location.pathname?.includes(MenuItem.path)) {
          className += ' app-menu-item-selected';
        }
        return (
          <span
            className={className}
            data-key={MenuItem.path}
            key={MenuItem.name}
            onClick={handleMenuItemClick}
          >
            {MenuItem.name}
          </span>
        );
      }
      return null;
    });
  }

  function handleMenuItemClick(event: any) {
    const targetPath = event.currentTarget.dataset.key;
    history.push(targetPath);
  }

  return <nav className="ami-menu">{RenderMenu(MenuDatas)}</nav>;
}
