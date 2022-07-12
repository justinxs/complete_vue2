<template>
  <div class="room-header">
    <div class="room-anchor" :style="showStyle">
      <div class="anchor-avatar">
        <img class="avatar" :src="roomInfo.avatar" alt="" />
        <img
          class="tag"
          src="~@images/room/icon_live_voice_attest@2x.png"
          alt=""
        />
      </div>
      <div class="name-hot">
        <span class="name">{{ roomInfo.nickname }}</span>
        <span class="hot">
          <i class="hot-icon"></i>
          <span class="hot-num">{{ roomInfo.heat }}</span>
        </span>
      </div>
      <span class="follow-btn" @click="$emit('action', 'followAnchor')">
        <i class="plus-icon"></i>
      </span>
    </div>
    <div class="room-msg">
      <van-icon
        v-show="closeVisible"
        class="room-close-icon"
        name="cross"
        @click="$emit('action', 'close')"
      />
    </div>
  </div>
</template>
<script>
import UAParser from 'ua-parser-js';

export default {
  props: {
    roomInfo: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      closeVisible: false
    };
  },
  computed: {
    showStyle() {
      const anchorId = this.roomInfo.anchorId;
      if (anchorId) {
        return { opacity: 1 };
      }
      return { opacity: 0 };
    }
  },
  mounted() {
    const uaEnv = UAParser();
    // 由window.open(url, '_blank')打开的可自行关闭，微信上不行
    this.closeVisible = !!window.opener && !/WeChat/gi.test(uaEnv.browser.name);
  }
};
</script>
