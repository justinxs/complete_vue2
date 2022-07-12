<template>
  <div class="bet-order">
    <div class="order-head c-bg heavy-fc">
      <nav class="order-nav">
        <div
          v-for="nav in renderNav"
          :key="nav.orderStatus"
          class="order-nav-item"
          :class="{ active: orderStatus == nav.orderStatus }"
          @click="changeNav(nav)"
        >
          <span>{{ nav.title }}</span>
          <i class="nav-b primary-bg"></i>
        </div>
      </nav>
    </div>
    <div class="bet-order-wrap base-bg">
      <div
        v-for="nav in navList"
        v-show="nav.isShow"
        :key="nav.orderStatus"
        class="order-content"
      >
        <OrderGroup
          v-if="nav.create"
          :order-status="nav.orderStatus"
        ></OrderGroup>
      </div>
    </div>
  </div>
</template>
<script>
import OrderGroup from './components/OrderGroup.vue';

export default {
  components: {
    OrderGroup
  },
  data() {
    return {
      orderStatus: 0,
      navList: [
        { orderStatus: 0, titleCode: 'un_settled', create: true, isShow: true },
        { orderStatus: 1, titleCode: 'settled', create: false, isShow: false }
      ]
    };
  },
  computed: {
    renderNav() {
      return this.navList.map((nav) => {
        return {
          ...nav,
          title: nav.title || this.$t(nav.titleCode)
        };
      });
    }
  },
  methods: {
    changeNav(nav) {
      this.orderStatus = nav.orderStatus;
      for (let i = 0; i < this.navList.length; i++) {
        const item = this.navList[i];
        if (nav.orderStatus == item.orderStatus) {
          item.isShow = true;
          item.create = true;
        } else {
          item.isShow = false;
        }
      }
    }
  }
};
</script>
