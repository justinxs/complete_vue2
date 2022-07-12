<template>
  <div class="room-chat">
    <RoomHeader :room-info="roomInfo" @action="roomAction"></RoomHeader>

    <div class="room-bottom">
      <div class="room-content" :style="showStyle">
        <div class="scroll-history">
          <vue-scroll ref="vs" :ops="scrollOps" @handle-scroll="handleScroll">
            <div ref="content" class="history-content">
              <history-item
                v-for="message in renderHistoryList"
                :key="message.msgUuid"
                :message="message"
              ></history-item>
            </div>
          </vue-scroll>
        </div>
        <div v-show="newsCount" class="new-button" @click="goBottom">
          <van-icon name="arrow-down" style="margin-right: 2px" />
          {{ $t('new_message_x', { count: newsCount }) }}
        </div>
      </div>

      <BottomPanel @action="roomAction"></BottomPanel>

      <!-- <div v-show="editorVisible" class="editor-panel">
        <ChatEditor :visible="editorVisible"></ChatEditor>
      </div> -->
    </div>
  </div>
</template>
<script>
import imChat from '../imChat';
import VueScroll from 'vuescroll/dist/vuescroll-native';
import HistoryItem from './HistoryItem';
import RoomHeader from './RoomHeader';
import BottomPanel from './BottomPanel';
// import ChatEditor from './ChatEditor';
import UAParser from 'ua-parser-js';
import { getSession } from '@/utils/element';
import {
  closeWindow,
  addGlobalAtMembers,
  kickoutRoom,
  disabledRoomSay,
  setRoomManager,
  followMember
} from '../action';

export default {
  components: {
    RoomHeader,
    BottomPanel,
    HistoryItem,
    VueScroll
    // ChatEditor,
  },
  data() {
    return {
      scrollTop: 0,
      newsCount: 0,
      isEnd: true,
      visible: false,
      editorVisible: false
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.member.info;
    },
    showStyle() {
      const anchorId = this.roomInfo.anchorId;
      if (anchorId) {
        return { opacity: 1 };
      }
      return { opacity: 0 };
    },
    scrollOps() {
      return {
        vuescroll: {
          mode: 'native',
          sizeStrategy: 'number',
          detectResize: false
        },
        scrollPanel: {
          initialScrollY: false,
          initialScrollX: false,
          scrollingX: false,
          scrollingY: true,
          speed: 300,
          easing: undefined,
          verticalNativeBarPos: 'right',
          maxHeight: undefined,
          maxWidth: undefined
        },
        rail: {
          background: '#666666',
          opacity: 1,
          size: '4px',
          specifyBorderRadius: false,
          gutterOfEnds: null,
          gutterOfSide: '2px',
          keepShow: false
        },
        bar: {
          showDelay: 500,
          onlyShowBarOnScroll: true,
          keepShow: true,
          background: '#cccccc',
          opacity: 1,
          hoverStyle: false,
          specifyBorderRadius: false,
          minSize: false,
          size: '4px',
          disable: true
        }
      };
    },
    renderHistoryList() {
      const imInfo = this.$store.state.live.imInfo;
      const historyList = this.$store.state.live.historyList;
      if (imInfo && imInfo.systemMsg) {
        return [
          {
            msgUuid: 1,
            msgType: 1,
            data: {
              content: imInfo.systemMsg
            }
          }
        ].concat(historyList);
      }
      return historyList;
    },
    liveStatus() {
      return this.$store.state.live.liveStatus;
    },
    roomInfo() {
      return this.$store.state.live.roomInfo;
    },
    serviceId() {
      return this.$store.state.serviceId;
    },
    downloadUrl() {
      const downloadUrl = this.$store.state.linkMap.downloadUrl;
      return (downloadUrl && downloadUrl[this.serviceId]) || {};
    }
  },
  activated() {
    this.visible = true;
    this.$nextTick(() => {
      this.$refs.vs && this.$refs.vs.refresh();
      this.goBottom(0);
    });
  },
  deactivated() {
    this.visible = false;
  },
  mounted() {
    this.visible = true;
    this.$nextTick(() => {
      this.$refs.vs && this.$refs.vs.refresh();
      this.goBottom(0);
    });
    imChat.on('newChat', this.newChatHandler);
    window.addEventListener('resize', this.winResize);
  },
  beforeDestroy() {
    imChat.off('newChat', this.newChatHandler);
    window.removeEventListener('resize', this.winResize);
    this.resizeTimer && clearTimeout(this.resizeTimer);
  },
  methods: {
    winResize(e) {
      this.resizeTimer && clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(() => {
        if (this.visible) {
          this.$refs.vs && this.$refs.vs.refresh();
          this.goBottom(0);
          console.log('resize', 'isENd = ' + this.isEnd);
        }
      }, 300);
    },
    scrollTo() {
      const scroller = this.$refs.vs;
      scroller && scroller.scrollTo(...arguments);
    },
    newChatHandler(msg) {
      if (msg) {
        const isMineWord =
          msg.msgType == 100 && this.userInfo && this.userInfo.id == msg.fromId;
        if ((this.isEnd || isMineWord) && this.visible) {
          this.goBottom(0);
        } else if (msg.msgType != 1115) {
          this.newsCount += 1;
        }
      } else {
        this.goBottom(0);
      }
    },
    handleScroll(vertical, horizontal, nativeEvent) {
      this.scrollTop = vertical.scrollTop;
      this.isEnd = vertical.process >= 0.98;
      if (this.isEnd) {
        this.newsCount = 0;
      }
      // console.log(
      //   'scroll',
      //   'isENd=' + this.isEnd,
      //   ',process=' + vertical.process
      // );
    },
    goBottom(duration = 300) {
      this.$nextTick(() => {
        this.newsCount = 0;
        this.scrollTo({ y: '100%' }, duration);
        this.isEnd = true;
      });
    },
    showEditor() {
      this.showDownload();
      // if (this.userInfo && this.userInfo.id) {
      //   this.editorVisible = true;
      // } else {
      //   this.showDownload();
      // }
    },
    roomAction(action, detail) {
      switch (action) {
        case 'close':
          closeWindow();
          break;
        case 'showDownload':
        case 'showGame':
        case 'showMenu':
        case 'showGift':
        case 'followAnchor':
          this.showDownload();
          break;
        case 'showEditor':
          this.showEditor();
          break;
        case 'at':
          addGlobalAtMembers({
            store: this.$store,
            member: detail
          });
          break;
        case 'follow':
          followMember({
            store: this.$store,
            params: {
              memberId: detail.memberId,
              anchorId: this.anchorId,
              follow: detail.status ? 0 : 1
            },
            exInfo: {
              refresh: true
            }
          }).then((data) => {
            if (data.code == 200) {
              this.$toast(
                this.$t(detail.status ? 'unfollow_success' : 'follow_success')
              );
            } else {
              this.$toast(data.msg);
            }
          });
          break;
        case 'kitout':
          if (detail.status) {
            kickoutRoom({
              store: this.$store,
              params: {
                memberId: detail.memberId,
                anchorId: this.anchorId,
                forbidTimeSpan: 0,
                reason: ''
              },
              exInfo: {
                refresh: true
              }
            });
          } else {
            console.log('open kitout dialog');
          }
          break;
        case 'roomMute':
          if (detail.status) {
            disabledRoomSay({
              store: this.$store,
              params: {
                memberId: detail.memberId,
                anchorId: this.anchorId,
                forbidTimeSpan: 0,
                reason: ''
              },
              exInfo: {
                refresh: true
              }
            });
          } else {
            console.log('open roomMute dialog');
          }
          break;
        case 'roomManage':
          if (detail.status) {
            setRoomManager({
              store: this.$store,
              params: {
                memberId: detail.memberId,
                anchorId: this.anchorId,
                avatar: detail.avatar,
                nickname: detail.nickname,
                type: 0
              },
              exInfo: {
                refresh: true
              }
            });
          } else {
            console.log('open roomManage dialog');
          }
          break;
        default:
          break;
      }
    },
    showDownload() {
      this.$dialog
        .confirm({
          className: 'easy-van-dialog',
          confirmButtonText: this.$t('download'),
          cancelButtonText: this.$t('cancel'),
          message: this.$t('app_download_tip')
        })
        .then((_) => {
          const uaEnv = UAParser(),
            q_downloadUrl = getSession('q_downloadUrl');
          console.log('confirm', this.downloadUrl);
          window.open(
            q_downloadUrl ||
              this.downloadUrl[/iOS/gi.test(uaEnv.os.name) ? 'iOS' : 'android'],
            '_blank'
          );
        })
        .catch((msg) => {
          console.log(msg);
        });
    }
  }
};
</script>
