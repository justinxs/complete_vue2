<template>
  <span ref="tag" class="vip-tag">
    <img
      :src="curVip ? curVip.ico.list : ''"
      alt=""
      crossorigin="anonymous"
      @load="iconLoad"
    />
  </span>
</template>
<script>
export default {
  props: {
    vipId: {
      type: [Number, String],
      default: ''
    }
  },
  computed: {
    vipGradeList() {
      return this.$store.state.vip.vipGradeList;
    },
    curVip() {
      return this.vipGradeList.filter((item) => item.id == this.vipId)[0];
    },
    gradeName() {
      const gradeNames = this.curVip ? this.curVip.gradeName : [];
      let name = '';
      for (let i = 0; i < gradeNames.length; i++) {
        const item = gradeNames[i];
        if (item.key == window.LANG_CODE) {
          name = item.value;
          break;
        }
      }
      return name;
    }
  },
  methods: {
    iconLoad(e) {
      const target = e.target;
      const name = this.gradeName;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const canvasHeight = 20;
      const naturalLastWidth = 30;
      const naturalTextHeight = 70;
      const naturalLeft = target.naturalWidth - naturalLastWidth;
      const ratio = canvasHeight / target.naturalHeight;
      const textPaddingLeft = Math.ceil(-10 * ratio);
      const textPaddingright = Math.ceil(16 * ratio);
      const textY =
        (target.naturalHeight - naturalTextHeight + naturalTextHeight / 2) *
        ratio;
      const leftWidth = Math.ceil(naturalLeft * ratio);
      const lessWidth = Math.ceil(naturalLastWidth * ratio);
      ctx.font = 'italic 10px serif';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';
      const text = ctx.measureText(name);
      const textWidth = Math.ceil(text.width);
      const canvasWidth = Math.ceil(
        target.naturalWidth * ratio > leftWidth + textWidth + textPaddingright
          ? target.naturalWidth * ratio
          : leftWidth + textWidth + textPaddingright
      );

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      ctx.drawImage(
        target,
        0,
        0,
        target.naturalWidth,
        target.naturalHeight,
        0,
        0,
        canvasHeight * (target.naturalWidth / target.naturalHeight),
        canvasHeight
      );
      for (let w = leftWidth + 2; w <= canvasWidth - lessWidth; w += 2) {
        ctx.drawImage(
          target,
          naturalLeft,
          0,
          target.naturalWidth - naturalLeft,
          target.naturalHeight,
          w,
          0,
          lessWidth,
          canvasHeight
        );
      }
      ctx.font = 'italic 10px serif';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(name, leftWidth + textPaddingLeft, textY);
      this.$refs.tag.replaceChild(canvas, target);
    }
  }
};
</script>
