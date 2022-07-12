import getEnv from '@/utils/uaEnv';
import { getQueryString } from '@/utils/element';
import { uuid } from '@/utils/common';
import { toSupportCode } from '@/lang';
import { THEME } from '@/utils/theme';

function formatServiceId(serviceId) {
  return /\d+(-\d+)?/.test(serviceId)
    ? /\d+-\d+/.test(serviceId)
      ? serviceId
      : `${serviceId}-${serviceId}`
    : '5006-5006';
}
function getCookie(key) {
  const reg = new RegExp(`(?:(?:^|.*;\\s*)${key}\\s*\\=\\s*([^;]*).*$)|^.*$`);
  return document.cookie.replace(reg, '$1');
}

export function transformStatusBar(height) {
  const uaEnv = getEnv();
  return parseInt(height) / window.devicePixelRatio + (uaEnv.isiOS ? 5 : 0);
}

export function initEnterData(enterData) {
  let version = enterData.version || getCookie('SPORTS_VERSION') || '';
  let UUID = enterData.uuid || getCookie('SPORTS_UUID') || uuid();
  let langCode = toSupportCode(enterData.langCode);
  let serviceId = formatServiceId(enterData.serviceId);
  let token = enterData.token || '';
  let theme = enterData.theme || THEME;
  let statusBarHeight = enterData.statusBarHeight || 0;
  let live_gaming_try = enterData.live_gaming_try || false;
  let api = enterData.api || '';
  let category = enterData.category || 'video';
  let ua = enterData['user-agent'] || '';

  let result = {
    version,
    uuid: UUID,
    langCode,
    serviceId,
    token,
    theme,
    statusBarHeight,
    live_gaming_try,
    api,
    category,
    ua,
    _enterData: {
      ...enterData
    }
  };

  return result;
}

export function initQueryData() {
  let [
    version,
    UUID,
    langCode,
    serviceId,
    token,
    theme,
    statusBarHeight,
    live_gaming_try,
    api,
    category
  ] = getQueryString([
    'version',
    'uuid',
    'langCode',
    'serviceId',
    'token',
    'theme',
    'statusBarHeight',
    'live_gaming_try',
    'api',
    'category'
  ]);

  version = version || getCookie('SPORTS_VERSION') || '';
  UUID = UUID || getCookie('SPORTS_UUID') || uuid();
  langCode = toSupportCode(langCode || getCookie('SPORTS_LANG_CODE'));
  serviceId = formatServiceId(serviceId || getCookie('SPORTS_SERVICE_ID'));
  token = token || '';
  theme = theme || getCookie('SPORTS_THEME') || THEME;
  statusBarHeight =
    statusBarHeight || getCookie('SPORTS_STATUS_BAR_HEIGHT') || 0;
  live_gaming_try = live_gaming_try || false;
  api = api || '';
  category = category || 'video';

  const result = {
    version,
    uuid: UUID,
    langCode,
    serviceId,
    token,
    theme,
    statusBarHeight,
    live_gaming_try,
    api,
    category,
    ua: ''
  };

  return result;
}

export function fullQuery(data = {}) {
  const params = {
    ...data
  };
  const querys = Object.keys(params).reduce((arr, key) => {
    const val = params[key];
    if (val !== null && val !== undefined && val !== '') {
      arr.push(`${key}=${val}`);
    }
    return arr;
  }, []);

  return querys.length ? `?${querys.join('&')}` : '';
}
