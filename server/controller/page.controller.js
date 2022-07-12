const { getFullHost } = require('../utils/req');

function setPageCookies(ctx) {
  const hostname = getFullHost(ctx);

  ctx.cookies.set('SPORTS_UUID', ctx.uuid, {
    httpOnly: false,
    domain: hostname,
    path: '/',
    maxAge: 365 * 24 * 60 * 60 * 1000
  });

  ctx.cookies.set('SPORTS_VERSION', ctx.version, {
    httpOnly: false,
    domain: hostname,
    path: '/'
  });

  ctx.cookies.set('SPORTS_LANG_CODE', ctx.langCode, {
    httpOnly: false,
    domain: hostname,
    path: '/',
    maxAge: 365 * 24 * 60 * 60 * 1000
  });

  ctx.cookies.set('SPORTS_STATUS_BAR_HEIGHT', ctx.statusBarHeight, {
    httpOnly: false,
    domain: hostname,
    path: '/'
  });

  ctx.cookies.set('SPORTS_TOKEN', ctx.token, {
    httpOnly: true,
    domain: hostname,
    path: '/'
  });

  ctx.cookies.set('SPORTS_THEME', ctx.theme, {
    httpOnly: false,
    domain: hostname,
    path: '/'
  });
}

module.exports = class PageController {
  constructor() {}

  async page(ctx, next) {
    // ssr 上下文对象
    let ssrContext = {
      routeData: {}
    };
    // page url参数是 cookies 值的来源，在 page 中写入 cookies
    setPageCookies(ctx);

    return ctx.ssrRender(ssrContext);
  }
};
