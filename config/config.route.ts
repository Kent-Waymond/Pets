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
    authority: ['admin', 'petMaster', 'passby'], // 允许admin，petMaster,passby权限用户访问，结合权限路由
    routes: [
      {
        path: '/',
        name: 'home',
        redirect: '/dashboard',
        hideInMenu: true,
        authority: ['admin', 'petMaster'],
      },
      {
        path: '/dashboard',
        name: 'dashboard',
        component: '@/pages/dashboard',
        authority: ['admin', 'petMaster'],
        //加入authority字段  在routeUtil中获取当前用户currentuser（登录后存在localStorage中），
        // 将currentuser和该字段对比，去设置hideInMenu，从而控制组件显示
      },
      {
        path: '/vaccine',
        name: 'vaccine',
        component: '@/pages/vaccine',
        authority: ['admin', 'petMaster'],
      },
      {
        path: '/settings',
        name: 'settings',
        component: '@/pages/settings',
        authority: ['admin', 'petMaster', 'passby'],
        routes: [
          {
            path: 'community',
            name: 'community',
            component: '@/pages/community',
            authority: ['admin', 'petMaster'],
          },
          {
            path: 'square',
            name: 'square',
            component: '@/pages/square',
            authority: ['admin', 'petMaster'],
          },
          {
            path: 'feedback',
            name: 'feedback',
            component: '@/pages/feedback',
            authority: ['admin', 'petMaster', 'passby'],
          },
        ],
      },
      {
        path: '/homePage',
        name: 'homePage',
        component: '@/pages/homePage',
        authority: ['admin', 'petMaster', 'passby'],
        hideInMenu: true,
        routes: [
          {
            path: 'moment',
            name: 'moment',
            component: '@/pages/moment',
            authority: ['admin', 'petMaster'],
          },
          {
            path: 'myfeedback',
            name: 'myfeedback',
            component: '@/pages/myfeedback',
            authority: ['admin', 'petMaster', 'passby'],
          },
        ],
      },
      {
        path: '/info',
        name: 'info',
        component: '@/pages/info',
        authority: ['admin', 'petMaster'],
      },
    ],
  },
];

export default PageRoutes;
