import { IRoute } from 'umi';

const PageRoutes: IRoute[] = [
  {
    path: '/account',
    routes: [
      {
        path: '/account',
        name: 'account',
        redirect: '/account/login',
      },
      {
        name: 'login',
        path: '/account/login',
        component: './account/login',
      },
    ],
  },
  {
    path: '/',
    component: '@/layouts/BasicLayout',
    wrappers: ['../pages/Authorized'], // 权限路由
    authority: ['admin', 'operator'], // 允许admin，operator权限用户访问，结合权限路由
    routes: [
      {
        path: '/',
        name: 'home',
        redirect: '/dashboard',
        hideInMenu: true,
      },
      {
        path: '/dashboard',
        name: 'dashboard',
        component: '@/pages/dashboard',
        // authority: ["admin"],  TODO
        //加入authority字段  在routeUtil中获取当前用户currentuser（登录后存在localStorage中），
        // 将currentuser和该字段对比，去设置hideInMenu，从而控制组件显示
      },
      {
        path: '/instance',
        name: 'instance',
        component: '@/pages/instance',
      },
      // {
      //   path: '/host',
      //   name: 'host',
      //   component: '@/pages/host',
      // },
      {
        path: '/node',
        name: 'node',
        component: '@/pages/node',
      },
      {
        path: '/settings',
        name: 'settings',
        component: '@/pages/settings',
        routes: [
          {
            path: '/settings',
            name: 'settings',
            redirect: '/settings/license',
            hideInMenu: true,
          },
          {
            path: 'license',
            name: 'license',
            component: '@/pages/license',
          },
          {
            path: 'network',
            name: 'network',
            component: '@/pages/network',
          },
          {
            path: 'log',
            name: 'log',
            component: '@/pages/log',
          },
        ],
      },
      // {
      //   path: '/settings/license',
      //   name: 'settings',
      //   component: '@/pages/license',
      // },
      // {
      //   path: '/settings/network',
      //   name: 'network',
      //   component: '@/pages/network',
      //   hideInMenu: true,
      // },
      // {
      //   path: '/settings/log',
      //   name: 'log',
      //   component: '@/pages/log',
      //   hideInMenu: true,
      // },
    ],
  },
];

export default PageRoutes;
