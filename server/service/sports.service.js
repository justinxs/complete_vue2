module.exports = {
  /**
   * 用户注单
   * @param {Number} timeType 时间类型 1：今天，2：昨日，3：七日内，4：一月内
   * @param {Number} orderStatus 注单类型 0：未结算，1：已结算
   * @param {Number} matchId 赛事id
   * @param {Number} page 页码
   * @param {Number} limit 每页条数
   */
  getOrderList(ctx, params) {
    let cacheOpt = { key: `/sports/order/getOrderList`, maxAge: 0 };
    let httpOpt = {
      url: `/sports/order/getOrderList`,
      method: 'get',
      params,
      urlType: 'sports'
    };

    const data0 = {
      ascs: null,
      betTotalAmount: '0.00',
      current: '1',
      descs: null,
      hasNext: false,
      hasPrevious: false,
      optimizeCountSql: true,
      pages: '1',
      profit: '0.00',
      record: {
        '2022-07-06': {
          betAmount: 300.0,
          data: [
            {
              acCode: '',
              addition: 0,
              backAmount: null,
              betTime: '1657098219293',
              betTimeStr: '2022-07-06',
              enablePreSettle: false,
              initPresettleWs: false,
              langCode: 'zh',
              managerCode: 1,
              marketType: 'EU',
              maxCashout: null,
              maxWinAmount: 81.0,
              orderAmountTotal: 100.0,
              orderNo: '4971294657882675',
              orderStatus: '0',
              orderVOS: [
                {
                  batchNo: '',
                  beginTime: '1657096200000',
                  betResult: 0,
                  betStatus: 6,
                  cancelType: 0,
                  closingTime: null,
                  hs: 2,
                  marketId: '143411046511572511',
                  marketType: 'EU',
                  marketValue: '小 3',
                  matchDay: '',
                  matchId: '2057982',
                  matchInfo: '华萨斯 v 科马咯(1-0)',
                  matchName: '球会友谊赛',
                  matchType: 2,
                  oddFinally: '1.81',
                  oddsValue: '',
                  outrightYear: '',
                  playId: 2,
                  playName: '全场大小',
                  playOptions: 'Under',
                  playOptionsId: '148490754202518838',
                  scoreBenchmark: '',
                  settleScore: '',
                  sportId: 1,
                  sportName: '足球',
                  tournamentId: '1516',
                  tournamentPic:
                    'group1/M00/0C/F0/CgURtWCD0QuAOjjeAAB5nc6nM-A748.png'
                }
              ],
              outcome: null,
              preBetAmount: null,
              preSettleBetAmount: null,
              profitAmount: null,
              seriesSum: 1,
              seriesType: '1',
              seriesValue: '单关',
              settleTime: null,
              settleType: 1
            },
            {
              acCode: '',
              addition: 0,
              backAmount: null,
              betTime: '1657098212182',
              betTimeStr: '2022-07-06',
              enablePreSettle: false,
              initPresettleWs: false,
              langCode: 'zh',
              managerCode: 1,
              marketType: 'EU',
              maxCashout: null,
              maxWinAmount: 217.0,
              orderAmountTotal: 100.0,
              orderNo: '4971294636549670',
              orderStatus: '0',
              orderVOS: [
                {
                  batchNo: '',
                  beginTime: '1657096200000',
                  betResult: 0,
                  betStatus: 6,
                  cancelType: 0,
                  closingTime: null,
                  hs: 2,
                  marketId: '142327181740939410',
                  marketType: 'EU',
                  marketValue: '科马咯  0',
                  matchDay: '',
                  matchId: '2057982',
                  matchInfo: '华萨斯 v 科马咯(1-0)',
                  matchName: '球会友谊赛',
                  matchType: 2,
                  oddFinally: '3.17',
                  oddsValue: '',
                  outrightYear: '',
                  playId: 19,
                  playName: '上半场让球',
                  playOptions: '2',
                  playOptionsId: '140992623400310824',
                  scoreBenchmark: '1:0',
                  settleScore: '',
                  sportId: 1,
                  sportName: '足球',
                  tournamentId: '1516',
                  tournamentPic:
                    'group1/M00/0C/F0/CgURtWCD0QuAOjjeAAB5nc6nM-A748.png'
                }
              ],
              outcome: null,
              preBetAmount: null,
              preSettleBetAmount: null,
              profitAmount: null,
              seriesSum: 1,
              seriesType: '1',
              seriesValue: '单关',
              settleTime: null,
              settleType: 1
            },
            {
              acCode: '',
              addition: 0,
              backAmount: null,
              betTime: '1657098205505',
              betTimeStr: '2022-07-06',
              enablePreSettle: false,
              initPresettleWs: false,
              langCode: 'zh',
              managerCode: 1,
              marketType: 'EU',
              maxCashout: null,
              maxWinAmount: 68.0,
              orderAmountTotal: 100.0,
              orderNo: '4971294616518668',
              orderStatus: '0',
              orderVOS: [
                {
                  batchNo: '',
                  beginTime: '1657096200000',
                  betResult: 0,
                  betStatus: 6,
                  cancelType: 0,
                  closingTime: null,
                  hs: 2,
                  marketId: '146335503546744444',
                  marketType: 'EU',
                  marketValue: '华萨斯  -0.5',
                  matchDay: '',
                  matchId: '2057982',
                  matchInfo: '华萨斯 v 科马咯(1-0)',
                  matchName: '球会友谊赛',
                  matchType: 2,
                  oddFinally: '1.68',
                  oddsValue: '',
                  outrightYear: '',
                  playId: 4,
                  playName: '全场让球',
                  playOptions: '1',
                  playOptionsId: '143832536013614361',
                  scoreBenchmark: '1:0',
                  settleScore: '',
                  sportId: 1,
                  sportName: '足球',
                  tournamentId: '1516',
                  tournamentPic:
                    'group1/M00/0C/F0/CgURtWCD0QuAOjjeAAB5nc6nM-A748.png'
                }
              ],
              outcome: null,
              preBetAmount: null,
              preSettleBetAmount: null,
              profitAmount: null,
              seriesSum: 1,
              seriesType: '1',
              seriesValue: '单关',
              settleTime: null,
              settleType: 1
            }
          ],
          totalOrders: 3,
          profit: 0
        }
      },
      records: [],
      searchCount: true,
      size: '50',
      total: '3'
    };

    const data1 = {
      ascs: null,
      betTotalAmount: '0.00',
      current: '1',
      descs: null,
      hasNext: false,
      hasPrevious: false,
      optimizeCountSql: true,
      pages: '1',
      profit: '0.00',
      record: {
        '2022-07-07': {
          betAmount: 300.0,
          data: [
            {
              acCode: '',
              addition: 0,
              backAmount: 0.0,
              betTime: '1657160576570',
              betTimeStr: '2022-07-07',
              enablePreSettle: false,
              initPresettleWs: false,
              langCode: 'tw',
              managerCode: 1,
              marketType: 'EU',
              maxCashout: null,
              maxWinAmount: 1200.0,
              orderAmountTotal: 100.0,
              orderNo: '4971481729713380',
              orderStatus: '1',
              orderVOS: [
                {
                  batchNo: '',
                  beginTime: '1657153800000',
                  betResult: 3,
                  betStatus: 1,
                  cancelType: 0,
                  closingTime: '1671408000000',
                  hs: 2,
                  marketId: '140554465060432972',
                  marketType: 'EU',
                  marketValue: '平局',
                  matchDay: '',
                  matchId: '1969587',
                  matchInfo: '路禾利桑天奴SP v 普拉斯哥野SC(1-0)',
                  matchName: '巴西乙級聯賽',
                  matchType: 2,
                  oddFinally: '13.00',
                  oddsValue: '',
                  outrightYear: '2022',
                  playId: 1,
                  playName: '全場獨贏',
                  playOptions: 'X',
                  playOptionsId: '149895495253064204',
                  scoreBenchmark: '',
                  settleScore: '全場比分 1-0',
                  sportId: 1,
                  sportName: '足球',
                  tournamentId: '189',
                  tournamentPic:
                    'group1/M00/00/41/CgURtV8sf1aAArgtAAANVHlsl_E332.png'
                }
              ],
              outcome: 3,
              preBetAmount: null,
              preSettleBetAmount: null,
              profitAmount: -100.0,
              seriesSum: 1,
              seriesType: '1',
              seriesValue: '單關',
              settleTime: '1657160941853',
              settleType: 1
            },
            {
              acCode: '',
              addition: 0,
              backAmount: 99.99,
              betTime: '1657160575530',
              betTimeStr: '2022-07-07',
              enablePreSettle: false,
              initPresettleWs: false,
              langCode: 'tw',
              managerCode: 1,
              marketType: 'EU',
              maxCashout: null,
              maxWinAmount: 77.0,
              orderAmountTotal: 100.0,
              orderNo: '4971481726593379',
              orderStatus: '1',
              orderVOS: [
                {
                  batchNo: '',
                  beginTime: '1657153800000',
                  betResult: 2,
                  betStatus: 1,
                  cancelType: 0,
                  closingTime: '1671408000000',
                  hs: 2,
                  marketId: '144241264201104222',
                  marketType: 'EU',
                  marketValue: '路禾利桑天奴SP  0',
                  matchDay: '',
                  matchId: '1969587',
                  matchInfo: '路禾利桑天奴SP v 普拉斯哥野SC(1-0)',
                  matchName: '巴西乙級聯賽',
                  matchType: 2,
                  oddFinally: '1.77',
                  oddsValue: '',
                  outrightYear: '2022',
                  playId: 4,
                  playName: '全場讓球',
                  playOptions: '1',
                  playOptionsId: '142460215111200745',
                  scoreBenchmark: '1:0',
                  settleScore: '全場比分 1-0',
                  sportId: 1,
                  sportName: '足球',
                  tournamentId: '189',
                  tournamentPic:
                    'group1/M00/00/41/CgURtV8sf1aAArgtAAANVHlsl_E332.png'
                }
              ],
              outcome: 2,
              preBetAmount: null,
              preSettleBetAmount: null,
              profitAmount: -0.01,
              seriesSum: 1,
              seriesType: '1',
              seriesValue: '單關',
              settleTime: '1657160941436',
              settleType: 1
            },
            {
              acCode: '',
              addition: 0,
              backAmount: 103.0,
              betTime: '1657160574495',
              betTimeStr: '2022-07-07',
              enablePreSettle: false,
              initPresettleWs: false,
              langCode: 'tw',
              managerCode: 1,
              marketType: 'EU',
              maxCashout: null,
              maxWinAmount: 3.0,
              orderAmountTotal: 100.0,
              orderNo: '4971481723485378',
              orderStatus: '1',
              orderVOS: [
                {
                  batchNo: '',
                  beginTime: '1657153800000',
                  betResult: 4,
                  betStatus: 1,
                  cancelType: 0,
                  closingTime: '1671408000000',
                  hs: 2,
                  marketId: '140213325238240439',
                  marketType: 'EU',
                  marketValue: '小 1.5',
                  matchDay: '',
                  matchId: '1969587',
                  matchInfo: '路禾利桑天奴SP v 普拉斯哥野SC(1-0)',
                  matchName: '巴西乙級聯賽',
                  matchType: 2,
                  oddFinally: '1.03',
                  oddsValue: '',
                  outrightYear: '2022',
                  playId: 2,
                  playName: '全場大小',
                  playOptions: 'Under',
                  playOptionsId: '144410812994840985',
                  scoreBenchmark: '',
                  settleScore: '全場比分 1-0',
                  sportId: 1,
                  sportName: '足球',
                  tournamentId: '189',
                  tournamentPic:
                    'group1/M00/00/41/CgURtV8sf1aAArgtAAANVHlsl_E332.png'
                }
              ],
              outcome: 4,
              preBetAmount: null,
              preSettleBetAmount: null,
              profitAmount: 3.0,
              seriesSum: 1,
              seriesType: '1',
              seriesValue: '單關',
              settleTime: '1657160941379',
              settleType: 1
            }
          ],
          totalOrders: 3,
          profit: -97.01
        },
        '2022-07-06': {
          betAmount: 100.0,
          data: [
            {
              acCode: '',
              addition: 0,
              backAmount: 0.0,
              betTime: '1657072911434',
              betTimeStr: '2022-07-06',
              enablePreSettle: false,
              initPresettleWs: false,
              langCode: 'tw',
              managerCode: 1,
              marketType: 'EU',
              maxCashout: null,
              maxWinAmount: 75.0,
              orderAmountTotal: 100.0,
              orderNo: '4971218734311228',
              orderStatus: '1',
              orderVOS: [
                {
                  batchNo: '',
                  beginTime: '1657067400000',
                  betResult: 3,
                  betStatus: 1,
                  cancelType: 0,
                  closingTime: '1671408000000',
                  hs: 2,
                  marketId: '144722632571443199',
                  marketType: 'EU',
                  marketValue: '利伯泰迪  0',
                  matchDay: '',
                  matchId: '1994986',
                  matchInfo: '利伯泰迪 v 巴拉納體育會PR(1-0)',
                  matchName: '南美自由盃',
                  matchType: 2,
                  oddFinally: '1.75',
                  oddsValue: '',
                  outrightYear: '2022',
                  playId: 4,
                  playName: '全場讓球',
                  playOptions: '1',
                  playOptionsId: '149352217793327562',
                  scoreBenchmark: '1:0',
                  settleScore: '全場比分 1-1',
                  sportId: 1,
                  sportName: '足球',
                  tournamentId: '322',
                  tournamentPic:
                    'group1/M00/00/51/CgURtl9QuKKAUF6fAAAMaqweDog180.png'
                }
              ],
              outcome: 3,
              preBetAmount: null,
              preSettleBetAmount: null,
              profitAmount: -100.0,
              seriesSum: 1,
              seriesType: '1',
              seriesValue: '單關',
              settleTime: '1657074360803',
              settleType: 1
            }
          ],
          totalOrders: 1,
          profit: -100.0
        }
      },
      records: [],
      searchCount: true,
      size: '50',
      total: '4'
    };
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          code: 1,
          data: params.orderStatus == 1 ? data1 : data0,
          msg: ''
        });
      }, 1000);
    });

    return ctx.requestTo(httpOpt, cacheOpt);
  }
};
