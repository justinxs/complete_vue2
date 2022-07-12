const sportsService = require('../service/sports.service');
const { getRealParams } = require('../utils');

module.exports = class SportsController {
  /**
   * 用户注单
   * @param {*} ctx
   * @param {*} next
   */
  async getOrderList(ctx, next) {
    try {
      let params = {
        timeType: ctx.query.timeType,
        orderStatus: ctx.query.orderStatus,
        matchId: ctx.query.matchId,
        page: ctx.query.page,
        limit: ctx.query.limit
      };
      let result = await sportsService.getOrderList(ctx, getRealParams(params));
      return (ctx.body = ctx.successBody(result));
    } catch (ex) {
      console.error(ex);
      return (ctx.body = ctx.errorBody(ex));
    }
  }
};
