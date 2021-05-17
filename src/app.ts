export function render(oldRender: any) {
  oldRender();
}
// window.ALIYUN_YUNDUN_CONSOLE_CONFIG = {
//   CURRENT_LOCALE: "en"
// }
(window as any).FP_APP_FRONTEND_VERSION =
  process.env.APP_FRONTEND_VERSION || '0.1';
