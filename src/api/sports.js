import request from '@/utils/request';

/**
 * 用户注单
 * @param {Number} timeType 时间类型 1：今天，2：昨日，3：七日内，4：一月内
 * @param {Number} orderStatus 注单类型 0：未结算，1：已结算
 * @param {Number} matchId 赛事id
 * @param {Number} page 页码
 * @param {Number} limit 每页条数
 */
export function getOrderList(params) {
  return request({
    method: 'get',
    url: '/api/sports/order/getOrderList',
    params
  });
}
