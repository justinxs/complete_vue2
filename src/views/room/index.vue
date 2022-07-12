<template>
  <div class="room-main" :style="roomStyle">
    <VideoPlayer
      ref="videoPlayer"
      :options="videoOptions"
      :show-type="roomInfo.showType"
    ></VideoPlayer>
    <RoomChat></RoomChat>
  </div>
</template>
<script>
import imChat from './imChat';
import VideoPlayer from '@/components/VideoPlayer';
import RoomChat from './components/RoomChat';
import {
  getRoom,
  historyMessage,
  memberInfo,
  privsList,
  riskControlList,
  showTag,
  heartbeat
} from '@/api/live';
import { getGiftList } from '@/api/resource';
import { getVipGradeList } from '@/api/vip';
import { myinfo } from '@/api/member';
import { prinme } from '@/utils/common';
import { clearRoom } from './action';

let flvjs;

export default {
  name: 'Room',
  components: {
    VideoPlayer,
    RoomChat
  },
  data() {
    return {
      anchorId: this.$route.params.anchorId,
      videoOptions: {},
      roomStyle: {}
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.member.info;
    },
    memberLiveInfo() {
      return this.$store.state.live.memberLiveInfo;
    },
    roomInfo() {
      return this.$store.state.live.roomInfo;
    },
    historyList() {
      return this.$store.state.live.historyList;
    },
    followAnchorIds() {
      return this.$store.state.live.followAnchorIds;
    }
  },
  mounted() {
    flvjs = require('flv.js');

    this.getRoomConfig();
    this.getRoom().then((roomData) => {
      if (roomData.status == 1) {
        this.afterRoomInit();
      }
    });

    this.imEvent = this.addIMEvent();
  },
  beforeDestroy() {
    this.imEvent && this.imEvent.clear();
    this.clearHeartbeat();
    clearRoom({ store: this.$store });
  },
  methods: {
    loadBg(bg) {
      if (bg) {
        let img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = (e) => {
          this.roomStyle = {
            ...this.roomStyle,
            'background-image': `url(${bg})`
          };
        };
        img.onabort = (e) => {
          console.warn('[Image:abort] ' + e);
        };
        img.onerror = (e) => {
          console.error('[Image:error] ' + e);
        };
        img.src = bg;
      }
    },
    addIMEvent() {
      const eventlist = [
        // im连接成功
        { msgType: 'connect', handler: this.connectHandle },
        // im断开重连
        { msgType: 'onwillreconnect', handler: this.reconnectHandle },
        // im连接断开
        { msgType: 'ondisconnect', handler: this.disconnectHandle },

        // 聊天消息
        { msgType: '100', handler: this.chatMessage },
        // at聊天消息
        { msgType: '101', handler: this.atMessage },
        // 弹幕
        { msgType: '103', handler: this.bulletMessage },

        // 用户全局禁言状态
        { msgType: '501', handler: this.globalMuteMessage },
        // 用户房间禁言状态
        { msgType: '502', handler: this.roomMuteMessage },
        // 用户踢出房间状态
        { msgType: '503', handler: this.kitOutMessage },
        // 用户禁播状态
        { msgType: '504', handler: this.forbidonLiveMessage },
        // 用户账号禁用状态
        { msgType: '505', handler: this.forbidonAccountMessage },
        // 添加取消房管
        { msgType: '506', handler: this.managerMessage },
        // 直播状态
        { msgType: '541', handler: this.liveStatusMessage },
        // 主播离开回来
        { msgType: '552', handler: this.leaveMessage },

        // 推送房间人数统计
        { msgType: '1114', handler: this.onlineNumberMessage },
        // 进场消息
        { msgType: '1115', handler: this.joinMessage },
        // 打赏消息
        { msgType: '1116', handler: this.rewardMessage },

        // 跑马灯
        { msgType: '1302', handler: this.marqueeMessage },
        // 主播被关注
        { msgType: '1304', handler: this.followAnchorMessage }
      ];
      eventlist.forEach((item) => imChat.on(item.msgType, item.handler));

      return {
        clear: () => {
          eventlist.forEach((item) => imChat.off(item.msgType, item.handler));
        }
      };
    },
    decodeContent(content) {
      return window.XXTEA.decryptFromBase64(
        content,
        prinme(this.$store.state.live.pathdata)
      );
    },
    formatStream(streamInfo, pullProtocolType) {
      // liveMode 1 声网 2YY 3机构
      // liveModeDetails 1RTC 2旁路CDN 3直推CDN 4L3
      // appSign 加密
      // pullUrl 加密
      let zego, agora;
      let pullUrl = this.decodeContent(streamInfo.pullUrl);
      let appSign = this.decodeContent(streamInfo.appSign);
      pullUrl = pullUrl ? JSON.parse(pullUrl) : null;
      appSign = appSign ? JSON.parse(appSign) : null;

      if (streamInfo.liveMode == 1) {
        agora = {
          appId: streamInfo.appId,
          channel: streamInfo.channel,
          token: streamInfo.token,
          uid: streamInfo.uid
        };
      } else if (streamInfo.liveMode == 3) {
        zego = {
          mode: streamInfo.liveModeDetails,
          appId: streamInfo.appId,
          channel: streamInfo.channel,
          server: streamInfo.server,
          token: streamInfo.token,
          appSign: appSign ? appSign.sign : '',
          uid: appSign ? appSign.uid : streamInfo.uid
        };
      }

      return {
        ...streamInfo,
        agora,
        zego,
        rtmp: pullProtocolType == 0 ? pullUrl : null,
        hdl: pullProtocolType == 1 ? pullUrl : null,
        hls: pullProtocolType == 2 ? pullUrl : null,
        hds: pullProtocolType == 3 ? pullUrl : null
      };
    },
    async getRoom() {
      // 拉流协议 0、 RTMP，1、HDL，2、HLS，3、HDS
      const pullProtocolType = flvjs.isSupported() ? 1 : 2;
      // 房间初始化加载
      this.$store.commit('live/updateLiveStatus', -1);
      let {
        code,
        data: roomData,
        msg
      } = await getRoom({
        anchorId: this.anchorId,
        pullProtocolType
      });
      if (code == 200) {
        // 0未开播 1开播中 6赛事已经结束 8提示版本升级 9该游戏无直播 10游戏关闭无直播
        if (roomData.status == 0) {
          this.$toast(this.$t('anchor_no_live'));
          return roomData;
        }
        let imInfo = roomData.im;
        let roomInfo = roomData.room;
        let streamInfo = this.formatStream(roomData.stream, pullProtocolType);
        let scheduleInfo = roomData.schedule;
        let tipMsg = roomData.tipMsg;

        let NIMConfig = {
          appKey: imInfo.appKey,
          chatroomAddresses: imInfo.addr,
          chatroomId: imInfo.yxChatroomId,
          account: imInfo.token,
          token: imInfo.token,
          pathdata: this.$store.state.live.pathdata
        };

        this.$store.commit('live/setImInfo', imInfo);
        this.$store.commit('live/setRoomInfo', roomInfo);
        this.$store.commit('live/setStreamInfo', streamInfo);
        this.$store.commit('live/setScheduleInfo', scheduleInfo);
        this.$store.commit('live/setTipMsg', tipMsg);

        // 加载背景图
        this.loadBg(roomInfo.vImg);
        // 初始化直播流
        this.videoOptions = streamInfo;
        this.$refs.videoPlayer.initLive();
        // 初始化聊天室并连接im
        imChat.init(NIMConfig);
        // 正常直播
        this.$store.commit('live/updateLiveStatus', 0);
      } else {
        console.error('getRoom error!', msg);
        this.$toast(msg);
        // 直播异常
        this.$store.commit('live/updateLiveStatus', 3);
      }

      return roomData;
    },
    getRoomConfig() {
      // 我的资料
      myinfo().then((data) => {
        if (data.code == 200) {
          this.$store.commit('member/setInfo', data.data);
        } else {
          console.error('not login!');
        }
      });

      // 聊天历史
      this.getHistory();
      // 礼物列表
      this.getGiftList();
      // vip等级配置
      this.getVipGradeList();
      // 权限列表
      this.privsList();
      // 风控词库
      this.getRiskControlList();
    },
    afterRoomInit() {
      // 聊天室相关用户信息
      this.getMemberLiveInfo();
      // 聊天室相关显示标签
      // this.showTag()
      // 我的关注
      // this.getFollowList();
      // 房间禁言列表
      // this.getRoomMuteList(this.roomInfo.anchorId);
      // 房管列表
      // this.getRoomManageList(this.roomInfo.anchorId);
      // 踢出房间列表
      // this.getKickOutList(this.roomInfo.anchorId);
    },
    joinRoom() {
      const roomInfo = this.roomInfo;
      const userInfo = this.userInfo;
      if (
        !userInfo ||
        !userInfo.id ||
        !roomInfo.anchorId ||
        roomInfo.anchorId == userInfo.id
      ) {
        return Promise.resolve();
      }

      const msg = {
        msgType: 1115,
        anchorId: roomInfo.anchorId,
        data: {
          memberId: userInfo.id,
          avatar: userInfo.avatar,
          nickname: userInfo.nickname,
          roleId: Math.max(...(userInfo.roles || [0])),
          level: userInfo.level
        },
        sendTime: Date.now()
      };

      return imChat.sendCustomMsg(msg);
    },
    getHistory() {
      return historyMessage({ anchorId: this.anchorId }).then((data) => {
        if (data.code == 200) {
          this.$store.commit('live/unshiftHistory', data.data);
          // 提交新聊天消息事件
          imChat.emit('newChat');
        }
        return data;
      });
    },
    getMemberLiveInfo() {
      return memberInfo({ anchorId: this.anchorId }).then((data) => {
        if (data.code == 200) {
          this.$store.commit('live/setMemberLiveInfo', data.data);
        }
        return data;
      });
    },
    getGiftList() {
      return getGiftList({ anchorId: this.anchorId }).then((data) => {
        if (data.code == 200) {
          this.$store.commit('resource/setGiftList', data.data);
        }
        return data;
      });
    },
    getVipGradeList() {
      return getVipGradeList().then((data) => {
        if (data.code == 200) {
          this.$store.commit('vip/setVipGradeList', data.data.items);
        }
        return data;
      });
    },
    privsList() {
      return privsList().then((data) => {
        if (data.code == 200) {
          this.$store.commit('live/setPrivsData', data.data);
        }
        return data;
      });
    },
    getRiskControlList() {
      return riskControlList().then((data) => {
        if (data.code == 200) {
          this.$store.commit('live/setRiskControlList', data.data);
        }
        return data;
      });
    },
    showTag() {
      return showTag().then((data) => {
        if (data.code == 200) {
          this.$store.commit('live/setTagsConfig', data.data);
        }
        return data;
      });
    },
    addHistory(msg) {
      const endIndex = this.historyList.length - 1;
      if (
        this.historyList[endIndex] &&
        this.historyList[endIndex].msgType == 1115
      ) {
        this.$store.commit('live/spliceHistory', [endIndex, 1, msg]);
      } else {
        this.$store.commit('live/pushHistory', msg);
      }
      // 提交新聊天消息事件
      imChat.emit('newChat', msg);
    },
    heartbeat() {
      if (this.userInfo && this.anchorId != this.userInfo.id) {
        this.clearHeartbeat();
        // 每隔15s发送一次在线心跳
        this.heartbeatTimer = setTimeout(() => {
          heartbeat(this.anchorId);
          this.heartbeat();
        }, 15000);
      }
    },
    clearHeartbeat() {
      this.heartbeatTimer && clearTimeout(this.heartbeatTimer);
    },
    connectHandle() {
      this.joinRoom();
      this.heartbeat();
    },
    reconnectHandle() {
      this.clearHeartbeat();
    },
    disconnectHandle() {
      this.clearHeartbeat();
    },
    chatMessage(msg) {
      this.addHistory(msg);
    },
    atMessage(msg) {
      this.addHistory(msg);
    },
    marqueeMessage(msg) {
      this.addHistory(msg);
    },
    bulletMessage(msg) {
      this.addHistory(msg);
    },
    globalMuteMessage(msg) {
      // 全局禁言消息
      const data = msg.data;
      if (this.userInfo && data.memberId == this.userInfo.id) {
        this.$store.commit('live/setMemberLiveInfo', {
          ...this.memberLiveInfo,
          mute: {
            type: 0,
            status: data.status,
            expireTime: data.expireTime,
            reason: data.reason
          }
        });
      }
    },
    roomMuteMessage(msg) {
      // 房间禁言消息
      const data = msg.data;
      if (this.userInfo && data.memberId == this.userInfo.id) {
        this.$store.commit('live/setMemberLiveInfo', {
          ...this.memberLiveInfo,
          mute: {
            type: 1,
            status: data.status,
            expireTime: data.expireTime,
            reason: data.reason
          }
        });
      }
    },
    kitOutMessage(msg) {
      // TODO 踢出消息
    },
    forbidonLiveMessage(msg) {
      // TODO 禁播消息
    },
    forbidonAccountMessage(msg) {
      // TODO 禁用账号消息
    },
    managerMessage(msg) {
      // 506 添加取消房管 status 0取消 1 添加
      this.addHistory(msg);
    },
    joinMessage(msg) {
      // {"id":1,"name":"会员"}
      // {"id":2,"name":"主播"}
      // {"id":4,"name":"币商"}
      // {"id":5,"name":"管理"}
      // {"id":6,"name":"房管"}
      const data = msg.data;
      if (data.roleId != 5) {
        this.addHistory(msg);
      }
    },
    rewardMessage(msg) {
      this.addHistory(msg);
    },
    onlineNumberMessage(msg) {
      // 在线人数消息
      const { totalCount, existRobot } = msg.data;
      this.$store.commit('live/setRoomInfo', {
        ...this.roomInfo,
        onlineNumber: totalCount,
        existRobot
      });
    },
    liveStatusMessage(msg) {
      // 直播状态   0直播中 1 正常下播 2强制下播  3异常下播
      const data = msg.data;
      this.$store.commit('live/updateLiveStatus', data.liveStatus);
      if (data.liveStatus) {
        this.$toast(this.$t('anchor_off_live'));
      }
      console.log(data.reason, 'liveStatus', data.liveStatus);
    },
    leaveMessage(msg) {
      // status 1离开 2回来
      const data = msg.data;
      if (data.status == 2) {
        this.$store.commit('live/updateLiveStatus', 0);
      }
    },
    followAnchorMessage(msg) {
      const data = msg.data;
      if (
        !this.followAnchorIds.includes(data.memberId) &&
        this.anchorId == data.anchorId
      ) {
        // 主播被关注 显示在聊天历史
        this.addHistory(msg);
        this.$store.commit(
          'live/updateFollowAnchor',
          this.followAnchorIds.concat(data.memberId)
        );
      }
    }
  }
};
</script>
