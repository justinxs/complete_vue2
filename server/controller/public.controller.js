const publicService = require('../service/public.service');
const { getRealParams } = require('../utils');
const { isSupportCode } = require('../lang');
const { getClientIp, getFullHost } = require('../utils/req');

module.exports = class PublicController {
  /**
   * 获取apollo配置
   * @param {String} keys 配置keys,'key1,key2'
   */
  async apolloConfig(ctx, next) {
    try {
      const allowKeys = ['cdn', 'version', 'links'];
      let keys = ctx.query.keys,
        apolloConfig = global.appConfig;
      let data = keys
        ? keys
            .replace(/\s+/g, '')
            .split(',')
            .reduce((obj, k) => {
              if (allowKeys.includes(k)) {
                switch (k) {
                  case 'ipMsg':
                    obj[k] = {
                      cip: getClientIp(ctx)
                    };
                    break;
                  default:
                    obj[k] = apolloConfig[k];
                    break;
                }
              }
              return obj;
            }, {})
        : {};

      return (ctx.body = {
        code: 200,
        data,
        msg: ''
      });
    } catch (error) {
      console.error(error);
      return (ctx.body = ctx.errorBody({ msg: error.message }));
    }
  }

  async updateLang(ctx, next) {
    let langCode = ctx.request.body.langCode;
    if (isSupportCode(langCode)) {
      const hostname = getFullHost(ctx);
      ctx.langCode = langCode;
      ctx.cookies.set('SPORTS_LANG_CODE', langCode, {
        httpOnly: false,
        domain: hostname,
        path: '/',
        maxAge: 365 * 24 * 60 * 60 * 1000
      });
      return (ctx.body = {
        code: 200,
        data: {
          langCode
        },
        msg: ''
      });
    } else {
      return (ctx.body = {
        code: 500,
        data: null,
        msg: 'langCode is not support!'
      });
    }
  }
};
