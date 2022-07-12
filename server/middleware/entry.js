const { uuid } = require('../utils');
const { getFullHost } = require('../utils/req');
const { toSupportCode } = require('../lang');

function transformServiceId(serviceId) {
  serviceId = serviceId.toString();
  if (serviceId && !/-/.test(serviceId)) {
    serviceId = `${serviceId}-${serviceId}`;
  }
  return serviceId;
}
/**
 * 获取应用必要信息
 * 优先级 query => headers => cookies => defaultValue
 */
function getVars(ctx, key) {
  const serviceList = global.appConfig.serviceList || {};
  const channelConfig = serviceList[getFullHost(ctx)] || {};

  switch (key) {
    case 'version':
      // 版本信息
      return (
        ctx.query.version ||
        ctx.headers['version'] ||
        ctx.cookies.get('SPORTS_VERSION') ||
        global.appConfig.version ||
        '1.0.0'
      );
    case 'ua':
      // user-agent 信息
      return (
        ctx.headers['ua'] ||
        ctx.headers['user-agent'] ||
        ctx.headers['useragent'] ||
        ''
      );
    case 'uuid':
      // 客户端唯一ID
      return (
        ctx.query.uuid ||
        ctx.headers['uuid'] ||
        ctx.cookies.get('SPORTS_UUID') ||
        uuid()
      );
    case 'token':
      // token
      return (
        ctx.query.token ||
        ctx.headers['token'] ||
        ctx.cookies.get('SPORTS_TOKEN') ||
        ''
      );
    case 'serviceId':
      // 渠道ID
      return transformServiceId(
        ctx.query.serviceId ||
          ctx.headers['serviceid'] ||
          channelConfig.serviceId ||
          '5006-5006'
      );
    case 'langCode':
      // 语言code
      return toSupportCode(
        ctx.query.langCode ||
          ctx.headers['langcode'] ||
          ctx.cookies.get('SPORTS_LANG_CODE') ||
          channelConfig.langCode ||
          'zh-TW'
      );
    case 'statusBarHeight':
      // 手机状态栏高度
      return (
        ctx.query.statusBarHeight ||
        ctx.headers['statusbarheight'] ||
        ctx.cookies.get('SPORTS_STATUS_BAR_HEIGHT') ||
        '0'
      );
    case 'theme':
      // 主题
      return (
        ctx.query.theme ||
        ctx.headers['theme'] ||
        ctx.cookies.get('SPORTS_THEME') ||
        channelConfig.theme ||
        'light'
      );
    default:
      return '';
  }
}

module.exports = async (ctx, next) => {
  ctx.version = getVars(ctx, 'version');
  ctx.ua = getVars(ctx, 'ua');
  ctx.uuid = getVars(ctx, 'uuid');
  ctx.token = getVars(ctx, 'token');
  ctx.serviceId = getVars(ctx, 'serviceId');
  ctx.langCode = getVars(ctx, 'langCode');
  ctx.statusBarHeight = getVars(ctx, 'statusBarHeight');
  ctx.theme = getVars(ctx, 'theme');

  await next();
};
