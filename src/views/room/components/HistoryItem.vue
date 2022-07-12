<template>
  <div class="history-item" @click="historyClick">
    <!-- 通知 -->
    <div v-if="message.msgType == 1" class="inline-box">
      <span class="notice-label">{{ $t('notice') }}:</span>
      <span>{{ message.data.content }}</span>
    </div>

    <!-- 进场消息 -->
    <div v-if="message.msgType == 1115" class="inline-box join-item">
      <span class="join-name" data-action="nickname">
        {{ message.data.nickName || message.data.nickname }}
      </span>
      <span>{{ $t('join_room') }}</span>
    </div>

    <!-- 系统消息 -->
    <div
      v-else-if="systemTypes.includes(message.msgType)"
      class="inline-box system-item"
    >
      <span class="system-label">{{ $t('system_message') }}:</span>
      <!-- 房管消息 -->
      <span
        v-if="message.msgType == 506"
        class="room-manage content"
        v-html="roomManageContent(message.data)"
      ></span>
      <!-- 主播被关注 -->
      <span
        v-else-if="message.msgType == 1304"
        class="anchor-follow content"
        v-html="followContent(message.data)"
      ></span>
    </div>

    <!-- 打赏消息 -->
    <div v-else-if="message.msgType == 1116" class="inline-box reward-item">
      <!-- <VipIcon v-if="message.data.vipId" :vipId="message.data.vipId"></VipIcon> -->

      <span class="reward-name" data-action="nickname">
        {{ message.data.fromMemberNickname }}:
      </span>
      <span>{{ $t('rewarded') }}</span>
      <img
        class="reward-gift"
        :src="getGift(message.data.giftId, 'effectsNoBgImage')"
        alt=""
      />
      <span>×{{ message.data.giftCount }}</span>
    </div>

    <!-- 公告 -->
    <div
      v-else-if="noticeTypes.includes(message.msgType)"
      class="inline-box notice-item"
    >
      <span class="notice-label">
        <i class="yellow-horn-icon"></i>
        {{ $t('notice') }}:
      </span>
      <!-- 跑马灯 -->
      <span
        v-if="message.msgType == 1302"
        class="content"
        v-html="removeScript(message.data.content)"
      ></span>
    </div>

    <!-- 普通消息 -->
    <div
      v-else-if="
        message.msgType == 100 ||
        message.msgType == 101 ||
        message.msgType == 103
      "
      class="inline-box chat-item"
    >
      <!-- <VipIcon v-if="message.vipId" :vipId="message.vipId"></VipIcon> -->
      <span class="chat-name" data-action="nickname">
        {{ message.fromNick }}:
      </span>
      <div
        ref="content"
        class="chat-content content"
        v-html="chatContent(message)"
      ></div>
    </div>
  </div>
</template>
<script>
import { removeScript } from '@/utils/common';
import VipIcon from './VipIcon';

export default {
  components: {
    VipIcon
  },
  props: {
    message: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      systemTypes: [506, 1304],
      noticeTypes: [1302]
    };
  },
  computed: {
    giftList() {
      return this.$store.state.resource.giftList;
    }
  },
  methods: {
    removeScript(content) {
      return removeScript(content);
    },
    historyClick(e) {
      e.preventDefault();
      const target = e.target;
      const parent = e.currentTarget;
      const action = target.getAttribute('data-action');
      const isContent =
        this.$refs.content && this.$refs.content.contains(target);
      const getAtag = (tag) => {
        let atag = null;
        if (!tag || tag === parent) {
          atag = null;
        } else if (tag.nodeName === 'A') {
          atag = tag;
        } else {
          atag = getAtag(tag.parentNode);
        }
        return atag;
      };
      const atag = getAtag(target);
      if (atag) {
        return window.open(atag.href, '_blank');
      }
      if (isContent) return;

      switch (action) {
        case 'nickname':
          this.showManagePanel(e);
          break;
        default:
          break;
      }
    },
    showManagePanel(event) {
      const msgType = +this.message.msgType;
      const detail = {
        msgType,
        anchorId: this.message.anchorId
      };
      const data = this.message.data;
      switch (msgType) {
        case 100:
        case 101:
        case 103:
          detail.memberId = this.message.fromId;
          detail.nickname = this.message.fromNick;
          detail.avatar = this.message.fromAvatar;
          break;
        case 506:
          detail.memberId = data.memberId;
          detail.nickname = data.nickname;
          detail.avatar = data.avatar;
          break;
        case 1115:
          detail.memberId = data.memberId;
          detail.nickname = data.nickName || data.nickname;
          detail.avatar = data.avatar;
          break;
        case 1116:
          detail.memberId = data.fromMemberId;
          detail.nickname = data.fromMemberNickname;
          detail.avatar = data.fromMemberAvatar;
          break;
        case 1304:
          detail.memberId = data.memberId;
          detail.nickname = data.nickname;
          break;

        default:
          break;
      }

      // this.$emit('managePanel', {event, detail})
    },
    chatContent(message) {
      let content = this.removeScript(message.data);
      if (message.msgType == 101 || message.msgType == 103) {
        const toMemberContent = (message.toMember || [])
          .map((item) => '@' + item.toNick + ' ')
          .join('');
        content = toMemberContent + content;
      }
      return content;
    },
    roomManageContent(data) {
      const color = '#4992ff';
      const name = ` <font data-action="nickname" color="${color}">${data.nickname}</font> `;
      const content =
        data.status == 1
          ? this.$t('set_room_manage', { name })
          : this.$t('cancel_room_manage', { name });

      return content;
    },
    followContent(data) {
      const color = '#4992ff';
      const name = ` <font data-action="nickname" color="${color}">${data.nickname}</font> `;
      const content = this.$t('follow_anchor_tip', { name });
      return content;
    },
    getGift(id, key) {
      for (let i = 0; i < this.giftList.length; i++) {
        const gifts = this.giftList[i].gifts;
        for (let j = 0; j < gifts.length; j++) {
          const item = gifts[j];
          if (id == item.id) {
            return key ? item[key] : item;
          }
        }
      }
    }
  }
};
</script>
