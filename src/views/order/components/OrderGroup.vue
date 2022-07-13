<template>
  <div class="order-group-container">
    <van-list
      ref="list"
      v-model="loadStatus.loading"
      :finished="loadStatus.finished"
      :error.sync="loadStatus.error"
      :style="{ height: loadStatus.isEmpty ? '100%' : '' }"
      @load="vanListLoad"
    >
      <NoData
        v-if="loadStatus.isEmpty"
        :text="
          orderStatus == 1 ? $t('no_settle_order') : $t('no_unsettle_order')
        "
      ></NoData>
      <div v-else class="order-group-wrap" :class="{ pb: !loadStatus.loading }">
        <div v-if="orderStatus == 1" class="order-condition heavy-fc">
          <div
            class="order-c-item c-bg order-date"
            @click="toggleCondition('timeType')"
          >
            <i :class="curTimeType.icon"></i>
            <span class="cond-text">{{ curTimeType.text }}</span>
            <i class="caret caret-m-icon border-t-icon-c"></i>
          </div>
          <div
            class="order-c-item c-bg order-sort"
            @click="toggleCondition('orderBy')"
          >
            <i :class="curOrderBy.icon"></i>
            <span class="cond-text">{{ curOrderBy.text }}</span>
            <i class="caret caret-m-icon border-t-icon-c"></i>
          </div>
        </div>

        <div class="order-group-list">
          <div v-for="group in groups" :key="group.dateStr" class="order-group">
            <div class="group-head">
              <span class="date heavy-fc">{{
                new Date(group.dateStr.replace(/-/g, '/')).format(
                  $t('month_day')
                )
              }}</span>
              <div v-if="orderStatus == 1" class="overview second-fc">
                <span class="w-fc">{{ $t('pen_count') }}&nbsp;</span
                >{{ group.totalOrders }}&emsp;<span class="w-fc"
                  >{{ $t('bet') }}&nbsp;</span
                >{{ group.betAmount }}&emsp;<span class="w-fc"
                  >{{ $t('lose_win') }}&nbsp;</span
                >{{ group.profit }}
              </div>
            </div>
            <OrderCard
              v-for="(order, i) in group.data"
              :key="i"
              :order-status="orderStatus"
              :info="order"
            ></OrderCard>
          </div>
        </div>
      </div>
      <template #finished><span></span></template>
      <template #error><span></span></template>
      <template #loading>
        <div class="order-skeleton-wrap">
          <OrderSkeleton v-for="n in 5" :key="n"></OrderSkeleton>
        </div>
      </template>
    </van-list>
  </div>
</template>
<script>
import { List } from 'vant';
import OrderCard from './OrderCard.vue';
import OrderSkeleton from './OrderSkeleton.vue';
import { getOrderList } from '@/api/sports';

export default {
  components: {
    OrderCard,
    OrderSkeleton,
    [List.name]: List
  },
  props: {
    orderStatus: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      groups: [],
      conditionMap: {
        timeTypeIndex: 0,
        orderByIndex: 0
      },
      loadStatus: {
        refreshing: false,
        loading: false,
        error: false,
        finished: false,
        isEmpty: false,
        page: 0,
        limit: 50
      }
    };
  },
  computed: {
    timeTypeOptions() {
      return [
        { id: 3, text: this.$t('days_day', { n: 7 }), icon: 'calendar-icon' },
        { id: 4, text: this.$t('days_day', { n: 30 }), icon: 'calendar-icon' }
      ];
    },
    curTimeType() {
      const { timeTypeIndex } = this.conditionMap;
      return this.timeTypeOptions[timeTypeIndex] || {};
    },
    orderByOptions() {
      return [
        { id: 2, text: this.$t('def_sort'), icon: 'sort1-icon' },
        { id: 1, text: this.$t('bet_time'), icon: 'sort2-icon' }
      ];
    },
    curOrderBy() {
      const { orderByIndex } = this.conditionMap;
      return this.orderByOptions[orderByIndex] || {};
    }
  },
  methods: {
    toggleCondition(key) {
      if (this.loadStatus.loading || this.loadStatus.refreshing) return;

      const step = (len, curIndex) => (++curIndex >= len ? 0 : curIndex);
      switch (key) {
        case 'timeType':
          this.conditionMap.timeTypeIndex = step(
            this.timeTypeOptions.length,
            this.conditionMap.timeTypeIndex
          );
          break;
        case 'orderBy':
          this.conditionMap.orderByIndex = step(
            this.orderByOptions.length,
            this.conditionMap.orderByIndex
          );
          break;
        default:
          break;
      }

      this.reloadOrder();
    },
    reloadOrder() {
      const { loadStatus, groups } = this.$options.data.call(this);
      this.groups = groups;
      this.loadStatus = loadStatus;
    },
    pullRefresh() {
      this.loadStatus.page = 1;
      this.loadStatus.error = false;
      this.getOrder(true);
    },
    vanListLoad() {
      this.loadStatus.page++;
      this.getOrder(false);
    },
    async getOrder(isRefresh) {
      let groupList = [],
        count = 0,
        groups = this.groups,
        isError = false;

      try {
        const LD = await getOrderList({
          orderStatus: this.orderStatus,
          timeType: this.curTimeType.id,
          orderBy: this.curOrderBy.id,
          page: this.loadStatus.page,
          limit: this.loadStatus.limit
        });
        if (LD.code == 200) {
          const orderData = LD.data;
          groupList = orderData.record
            ? Object.keys(orderData.record).map((dateStr) => {
                const groupItem = orderData.record[dateStr];
                count += groupItem.data.length;
                return {
                  dateStr,
                  ...groupItem
                };
              })
            : [];
          groups = isRefresh ? groupList : this.mergeGroup(groups, groupList);
        } else {
          isError = true;
          this.$toastError(LD.msg);
        }
      } catch (err) {
        isError = true;
        this.$toastError(err);
      }

      this.loadStatus.refreshing = false;
      this.loadStatus.loading = false;
      this.loadStatus.finished = count < this.loadStatus.limit;
      this.loadStatus.isEmpty = groups.length == 0;

      if (isError) {
        this.loadStatus.error = true;
        this.loadStatus.finished = false;
        if (this.loadStatus.page > 0) {
          this.loadStatus.page--;
        }
      }

      this.groups = groups;

      return groupList;
    },
    mergeGroup(targetGroup, group) {
      const result = targetGroup.map((tg) => ({ ...tg }));
      group.forEach((item) => {
        let existIndex = undefined;
        if (
          result.some((tg, i) => {
            const isExist = tg.dateStr === item.dateStr;
            if (isExist) {
              existIndex = i;
            }
            return isExist;
          })
        ) {
          result.splice(existIndex, 1, {
            ...result[existIndex],
            ...item,
            data: result[existIndex].data.concat(item.data)
          });
        } else {
          result.push(item);
        }
      });
      return result;
    }
  }
};
</script>
