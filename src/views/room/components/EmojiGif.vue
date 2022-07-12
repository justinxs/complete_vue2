<template>
  <div class="emoji-gif-container">
    <div ref="emojiGifSwiper" class="swiper emoji-gif-swiper">
      <div class="swiper-wrapper">
        <div class="swiper-slide">
          <div ref="emojiSwiper" class="swiper emoji-swiper">
            <div class="swiper-wrapper">
              <div
                v-for="(eList, i) in renderEmoji"
                :key="i"
                class="swiper-slide emoji-slide"
              >
                <span v-for="(code, j) in eList" :key="j" class="emoji-item">{{
                  code
                }}</span>
                <span class="backspace-btn backspace-icon"></span>
              </div>
            </div>
            <div class="swiper-pagination"></div>
          </div>
        </div>
        <div class="swiper-slide">
          <div ref="gifSwiper" class="swiper gif-swiper">
            <div class="swiper-wrapper">
              <div
                v-for="(eList, i) in renderEmoji"
                :key="i"
                class="swiper-slide emoji-slide"
              >
                <span v-for="(code, j) in eList" :key="j" class="emoji-item">{{
                  code
                }}</span>
                <span class="backspace-btn backspace-icon"></span>
              </div>
            </div>
            <div class="swiper-pagination"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="emoji-gif-tab">
      <div class="emoji-gif-tab-item">
        <img
          class="tab-icon"
          src="~@images/room/icon_lts_expression@2x.png"
          alt=""
        />
      </div>
      <div class="emoji-gif-tab-item">
        <img
          class="tab-icon"
          src="~@images/room/icon_gif_expression@2x.png"
          alt=""
        />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isShow: false,
      emojiList: [
        '😀',
        '😁',
        '😂',
        '😃',
        '😄',
        '😅',
        '😆',
        '😉',
        '😊',
        '😋',
        '😎',
        '😍',
        '😘',
        '😗',
        '😙',
        '😚',
        '😇',
        '😐',
        '😑',
        '😶',
        '😏',
        '😣',
        '😥',
        '😮',
        '😯',
        '😪',
        '😫',
        '😴',
        '😌',
        '😛',
        '😜',
        '😝',
        '😒',
        '😓',
        '😔',
        '😕',
        '😲',
        '😷',
        '😖',
        '😞',
        '😟',
        '😤',
        '😢',
        '😭',
        '😦',
        '😧',
        '😨',
        '😬',
        '😰',
        '😱',
        '😳',
        '😵',
        '😡',
        '😠',
        '😈',
        '👿',
        '👹',
        '👺',
        '👻',
        '💀'
      ]
    };
  },
  computed: {
    renderEmoji() {
      const len = this.emojiList.length;
      return Array.from({ length: Math.ceil(len / 31) }, (v, i) => {
        return this.emojiList.slice(31 * i, 31 * i + 31);
      });
    }
  },
  mounted() {
    window.addEventListener('click', this.globalClick);
  },
  beforeDestroy() {
    window.removeEventListener('click', this.globalClick);
  },
  methods: {
    initSwipers() {
      const emojiGifEl = this.$refs.emojiGifSwiper;
      const emojiEl = this.$refs.emojiSwiper;
      const gifEl = this.$refs.gifSwiper;
      // eslint-disable-next-line
      const emojiGifSwiper = new Swiper(emojiGifEl, {});
      // eslint-disable-next-line
      const emojiSwiper = new Swiper(emojiEl, {});
      // eslint-disable-next-line
      const gifSwiper = new Swiper(gifEl, {});
      this.emojiGifSwiper = emojiGifSwiper;
      this.emojiSwiper = emojiSwiper;
      this.gifSwiper = gifSwiper;
    },
    toggole() {
      this.isShow = !this.isShow;
    },
    close() {
      this.isShow = false;
    },
    select(code) {
      this.$emit('select', code);
    },
    globalClick(e) {
      // const main = this.$refs.main;
      // const target = e.target;
      // if (this.isShow && main !== target && !main.contains(target)) {
      //   this.close();
      // }
    }
  }
};
</script>
