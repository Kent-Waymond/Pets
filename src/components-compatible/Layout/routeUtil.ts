import { formatMessage, IRoute } from 'umi';
import { IAppMenuRecord } from './type';

export function formatterMenuDatas(
  routes: IRoute[],
  authority: string[],
  currentAuthority: string,
  prefix: string = '',
): IAppMenuRecord[] {
  // console.log(authority, '11111111111')
  // console.log(currentAuthority, '22222222')
  if (authority.indexOf(currentAuthority) === -1) {
    return [];
  }
  if (!(routes instanceof Array)) {
    return [];
  }
  let result = [];
  prefix = prefix ? prefix + '.' : '';
  for (let i = 0; i < routes.length; i++) {
    if (
      routes[i].authority &&
      routes[i].authority.indexOf(currentAuthority) === -1
    ) {
      continue;
    }
    if (routes[i].path) {
      let res: IAppMenuRecord = {
        path: routes[i].path || '',
        name: formatMessage({ id: `menu.${prefix}${routes[i].name}` }),
        icon: routes[i].icon,
        hideInMenu:
          routes[i].hideInMenu ||
          (routes[i].authority &&
            routes[i].authority.indexOf(currentAuthority) === -1),
      };
      // console.log(routes[i].path, routes[i].authority, '333333333')
      // console.log(currentAuthority, '444444444444444')
      // console.log(routes[i].authority && routes[i].authority.indexOf(currentAuthority) === -1, '55555555555555')
      if (routes[i].routes instanceof Array) {
        res.routes = formatterMenuDatas(
          routes[i].routes || [],
          authority,
          currentAuthority,
          prefix + routes[i].name,
        );
      }
      result.push(res);
    }
  }
  return result;
}

// 返回未隐藏的menu item的path
export function filterHideMenuData(menuData: IAppMenuRecord[]): string[] {
  if (menuData && menuData instanceof Array) {
    let result: string[] = [];

    for (let i = 0; i < menuData.length; i++) {
      let current = menuData[i];
      if (current && current.path) {
        if (!current.hideInMenu) {
          result.push(current.path);
        }
        if (current.routes instanceof Array) {
          let res: string[] = filterHideMenuData(current.routes);
          for (let j = 0; j < res.length; j++) {
            result.push(res[j]);
          }
        }
      }
    }
    return result;
  }
  return [];
}

function ParseMenuDataToBreadCrumbData(menuData: any[]): any[] {
  if (menuData && menuData instanceof Array) {
    let result = [];

    for (let i = 0; i < menuData.length; i++) {
      let current = menuData[i];
      if (current && current.path) {
        result.push({
          path: current.path,
          breadcrumb: current.name,
        });
        if (current.routes instanceof Array) {
          let res = ParseMenuDataToBreadCrumbData(current.routes);
          for (let j = 0; j < res.length; j++) {
            result.push(res[j]);
          }
        }
      }
    }
    return result;
  }
  return [];
}

export function formatterBreadCrumbData(
  routes: any,
  authority: any,
  currentAuthority: any,
  prefix: string = '',
): any[] {
  let menuData = formatterMenuDatas(
    routes,
    authority,
    currentAuthority,
    prefix,
  ) as any;
  let result = ParseMenuDataToBreadCrumbData(menuData);
  return result;
}
