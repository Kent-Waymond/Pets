import { defineConfig } from 'umi';
import PageRoutes from './config.route';
import APP_PROXY from './config.proxy';

let SERVICE_URL = process.env.APP_SERVICE_URL || '';
let APP_VERSION = process.env.APP_FRONTEND_VERSION || '';
let PROXY_URL = process.env.APP_PROXY_URL || '';
console.log('APP SERVICE_URL: ', SERVICE_URL);
console.log('APP PROXY_URL: ', PROXY_URL);
console.log('APP VERSION: ', APP_VERSION);

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  dva: {
    immer: true,
    hmr: false,
  },
  locale: {
    default: 'zh-CN',
    antd: true,
    title: false,
    baseNavigator: true,
    baseSeparator: '-',
  },
  title: 'Pets',
  favicon: '/favicon.png',
  routes: PageRoutes,
  theme: {
    '@primary-color': '#2a92fc',
  },
  history: { type: 'hash' },
  define: {
    'process.env.APP_SERVICE_URL': SERVICE_URL,
    'process.env.APP_FRONTEND_VERSION': APP_VERSION,
  },
  proxy: APP_PROXY,
});
