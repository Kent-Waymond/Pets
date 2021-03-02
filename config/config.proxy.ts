import { Redirect } from 'umi';
/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */

const { APP_PROXY_URL, NODE_ENV } = process.env;
const PROXY_MAP: any = {
  development: {
    '/api': {
      target: 'http://119.3.249.45:8080',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
      secure: false,
    },
    // '/api': {
    //   target: 'http://119.3.249.45:8080',
    //   changeOrigin: true,
    //   // hostRewrite: false,
    //   pathRewrite: { '^/api': '' },
    //   secure: false,
    // }
  },
};

let APP_PROXY = {};
if (NODE_ENV) {
  APP_PROXY = PROXY_MAP[NODE_ENV] ? PROXY_MAP[NODE_ENV] : {};
}

export default APP_PROXY;
