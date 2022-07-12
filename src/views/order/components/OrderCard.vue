<template>
  <div class="order-card c-bg">
    <div class="match-unit border-c second-fc">
      <img
        class="unit-logo"
        :src="imagesHost + '/' + match.tournamentPic"
        alt=""
      />
      <span class="unit-name">{{ match.matchName }}</span>
    </div>
    <div class="match-detail">
      <div class="match-title">
        <span class="heavy-fc">{{ match.matchInfo }}</span>
        <span class="start-time second-fc">{{
          new Date(+match.beginTime).format($t('month_day_hm'))
        }}</span>
        <i class="tag-line primary-bg"></i>
      </div>
      <div class="match-belongs third-fc">
        {{ match.sportName
        }}<span
          >&thinsp;{{
            matchTypeMap[match.matchType] || match.matchType
          }}&ensp;</span
        >{{ match.playName }}&nbsp;{{
          match.scoreBenchmark
            ? `[${match.scoreBenchmark.replace(':', '-')}]`
            : ''
        }}&thinsp;&nbsp;<span
          >[{{ marketTypeMap[match.marketType] || match.marketType }}]</span
        >
      </div>
      <div class="match-result heavy-fc">
        <span>{{ match.marketValue }}</span
        ><span class="primary-fc"
          >&nbsp;&nbsp;@&thinsp;{{ match.oddFinally }}</span
        >
      </div>
    </div>
    <div class="bet-detail card-bg fourth-fc">
      <div class="start">
        <span>{{ $t('bet_amount') }}</span>
        <span class="heavy-fc amount">{{
          (+info.orderAmountTotal || 0).toFixed(2)
        }}</span>
      </div>
      <div class="center">
        <span>{{ orderStatus == 1 ? $t('return_back') : $t('max_win') }}</span>
        <span :class="['amount', info.outcome == 4 ? 'win-fc' : 'heavy-fc']">{{
          orderStatus == 1
            ? (+info.backAmount || 0).toFixed(2)
            : (+info.maxWinAmount || 0).toFixed(2)
        }}</span>
      </div>
      <div class="end">
        <span :class="[orderStatus == 1 ? '' : 'v-hidden']">{{
          match.settleScore || '-'
        }}</span>
        <span
          :class="[
            orderStatus == 1
              ? info.outcome == 4
                ? 'win-fc'
                : 'heavy-fc'
              : 'success-fc'
          ]"
          >{{
            orderStatus == 1
              ? outcomeMap[info.outcome] || info.outcome
              : orderStatusMap[info.orderStatus] || info.orderStatus
          }}</span
        >
      </div>
    </div>
    <div class="order-footer fourth-fc">
      <span @click="copy(info.orderNo)"
        >{{ $t('bet_order_num') }}
        <span class="second-fc">{{ info.orderNo }}</span
        ><i class="copy copy-icon"></i
      ></span>
      <span
        >{{ $t('bet_time') }}&nbsp;<span class="second-fc">{{
          new Date(+info.betTime).format($t('month_day_hm'))
        }}</span></span
      >
    </div>
  </div>
</template>
<script>
let clipboard;

export default {
  props: {
    orderStatus: {
      type: Number,
      default: 0
    },
    info: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {};
  },
  computed: {
    imagesHost() {
      return this.$store.state.linkMap.images;
    },
    matchTypeMap() {
      return {
        1: this.$t('pre_pan'),
        2: this.$t('rock_ball'),
        3: this.$t('champion')
      };
    },
    marketTypeMap() {
      return {
        HK: this.$t('hk_pan'),
        EU: this.$t('eu_pan')
      };
    },
    outcomeMap() {
      return {
        1: '',
        2: this.$t('water_leave'),
        3: this.$t('lose'),
        4: this.$t('win'),
        5: this.$t('half_win'),
        6: this.$t('half_lose'),
        7: this.$t('match_cancel'),
        8: this.$t('match_delay')
      };
    },
    orderStatusMap() {
      return {
        0: this.$t('bet_success'),
        1: this.$t('settled'),
        2: this.$t('bet_order_cancel'),
        3: this.$t('confirming'),
        4: this.$t('bet_fail')
      };
    },
    match() {
      // match.betResult 投注项结算结果 0：无结果，2：走水，3：输，4：赢，5：赢一半， 6：输一半，7：赛事取消，8：赛事延期， 11：比赛延迟，12：比赛中断，13：未知， 15：比赛放弃，16：异常盘口
      // match.betStatus 注单状态 0：未结算，1：已结算，2：结算异常，3：注单取消
      // match.matchType 赛事类型 1：早盘赛事，2：滚球盘赛事，3：冠军盘赛事

      // info.preSettle 提前结算部分或者全额区分 1：部分，2：全额，0或者null：没有提前结算 3：部分提前结算取消，4：全额提取结算取消
      // info.enablePreSettle 0：关闭提前结算，1：开启提前结算
      // info.outcome 输赢结算状态 2：走水，3：输，4：赢，5：半赢，6：半输， 7：赛事取消，8：赛事延期
      // info.addition 印度尼西亚、马来盘附加金额， 如果大于0需要商户在该字段前加“+”号 (针对印度尼西亚盘和马来盘做的特殊处理 实际付款金额-投注金额)
      // info.orderStatus 订单状态 0：未结算，1：已结算，2：注单取消，3：确认中，4：投注失败
      const orderVOS = this.info.orderVOS;
      return orderVOS ? orderVOS[0] : {};
    }
  },
  methods: {
    getClipboard() {
      return clipboard || (clipboard = require('clipboard-polyfill/text'));
    },
    copy(text) {
      this.getClipboard()
        .writeText(text)
        .then(
          () => {
            this.$toast(this.$t('copy_order_success'));
          },
          () => {
            this.$toast(this.$t('copy_order_fail'));
          }
        );
    }
  }
};
</script>
