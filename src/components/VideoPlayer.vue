<template>
  <div class="video-player" :class="showType == 1 ? 'vertical' : 'horizontal'">
    <video
      ref="h5Video"
      x-webkit-airplay="true"
      webkit-playsinline
      playsinline
      muted
      x5-video-player-type="h5"
      x5-video-player-fullscreen="true"
      x5-video-orientation="portraint"
      @play="playCb"
      @canplaythrough="canplaythrough"
      @waiting="waitingCb"
      @playing="playingCb"
    ></video>
    <van-loading
      v-show="loading"
      class="video-loading"
      color="rgba(0, 0, 0, .6)"
      size="50px"
    />
  </div>
</template>

<script>
import Vue from 'vue';
import { Loading } from 'vant';
import UAParser from 'ua-parser-js';
import { Zego, Agora } from '@/utils/live';
import { zegoToken } from '@/api';

let flvjs;

Vue.use(Loading);

export default {
  name: 'VideoPlayer',
  props: {
    options: {
      type: Object,
      default: () => ({})
    },
    showType: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      isInit: false,
      loading: true
    };
  },
  mounted() {
    flvjs = require('flv.js');
    flvjs.LoggingControl.enableDebug = false;
    flvjs.LoggingControl.enableVerbose = false;
    flvjs.LoggingControl.enableInfo = false;
    flvjs.LoggingControl.enableWarn = false;
    flvjs.LoggingControl.enableError = true;

    this.uaEnv = UAParser();
    this.videoPlayer = {
      context: this,
      get video() {
        return this.context.$refs.h5Video;
      },
      get player() {
        return this.context.flvPlayer || this.video;
      },
      get playing() {
        return this.video ? !this.video.paused : false;
      },
      set playing(state) {
        if (this.player) {
          state ? this.player.play() : this.player.pause();
        }
      },
      get muted() {
        return this.video ? this.video.muted : false;
      },
      set muted(val) {
        if (this.player) {
          this.player.muted = val;
        }
      }
    };
    this.freePlay();
  },
  beforeDestroy() {
    if (this.ag) {
      this.ag.leave();
      this.$refs.h5Video.srcObject = null;
      console.warn('agora leave');
    }
    if (this.zg) {
      this.zg.logoutRoom(this.options.zego.channel);
      this.$refs.h5Video.srcObject = null;
      console.warn('zego logoutRoom');
    }
    if (this.flvPlayer) {
      this.flvPlayer.unload();
      this.flvPlayer.destroy();
      this.flvPlayer = null;
    }
    this.videoPlayer = null;
  },
  methods: {
    waitingCb(e) {
      this.loading = true;
      console.log('waiting!!!!!!!!!!!!!!!!!!!!!!!');
    },
    playingCb(e) {
      this.loading = false;
      console.log(
        'playing!!!!!!!!!',
        ` muted: ${e.target.muted}`,
        ` paused: ${e.target.paused}`
      );
    },
    playCb(e) {
      this.loading = false;
      console.log(
        'play!!!!!!!!!',
        ` muted: ${e.target.muted}`,
        ` paused: ${e.target.paused}`
      );
      this.$emit('play');
    },
    canplaythrough(e) {
      if (!this.videoPlayer.playing || this.videoPlayer.muted) {
        console.log(
          'canplaythrough play force!!!!!!!!!!!!!!!!',
          ` muted: ${e.target.muted}`,
          ` paused: ${e.target.paused}`
        );
        this.videoPlayer.playing = true;
      }
      this.$emit('canplaythrough');
    },
    visibilityChange() {
      if (!document.hidden && this.flvPlayer) {
        setTimeout(() => {
          console.log('flv reload!');
          this.flvPlayer.unload();
          this.flvPlayer.load();
          this.flvPlayer.play();
        }, 200);
      }
    },
    freePlay() {
      const free = (e) => {
        if (this.isInit || /WeChat/gi.test(this.uaEnv.browser.name)) {
          let playing = this.videoPlayer.playing;
          let muted = this.videoPlayer.muted;

          this.videoPlayer.playing = true;
          this.videoPlayer.muted = false;
          console.log(
            'prev-muted: ' + muted,
            ' cur-muted: ',
            this.videoPlayer.muted
          );
          console.log(
            'prev-playing: ' + playing,
            ' cur-playing: ',
            this.videoPlayer.playing
          );
          if (!this.videoPlayer.muted && this.videoPlayer.playing) {
            window.removeEventListener('touchend', free);
            window.removeEventListener('click', free);
          }
        }
      };
      document.addEventListener('WeixinJSBridgeReady', free);
      window.addEventListener('touchend', free);
      window.addEventListener('click', free);
    },
    initAgora(agoraConfig) {
      let mediaStream = new MediaStream();
      return new Agora({
        appId: agoraConfig.appId || agoraConfig.appid,
        channel: agoraConfig.channel,
        token: agoraConfig.token,
        callbacks: {
          mediaSub: (user, mediaType) => {
            const video = this.$refs.h5Video;
            if (mediaType == 'video') {
              mediaStream.addTrack(user.videoTrack.getMediaStreamTrack());
            }
            if (mediaType === 'audio') {
              mediaStream.addTrack(user.audioTrack.getMediaStreamTrack());
            }
            video.srcObject = mediaStream;
          },
          'user-unpublished': (user, mediaType, ctx) => {
            if (!ctx.streamListCache.length) {
              const video = this.$refs.h5Video;
              video.srcObject = null;
            }
          }
        }
      });
    },
    initZego(zegoConfig) {
      return new Zego({
        resourceMode: zegoConfig.mode == 4 ? 2 : 0,
        appId: Number(zegoConfig.appId),
        roomId: zegoConfig.channel,
        server: zegoConfig.server,
        token: zegoConfig.token,
        user: {
          userID: zegoConfig.uid,
          userName: 'LiveChat' + Date.now()
        },
        callbacks: {
          streamAdd: (streamObj, stream) => {
            const video = this.$refs.h5Video;
            video.srcObject = stream;
          },
          roomStreamUpdate: (
            roomId,
            updateType,
            streamList,
            extendedData,
            ctx
          ) => {
            if (!ctx.streamListCache.length) {
              const video = this.$refs.h5Video;
              video.srcObject = null;
            }
          },
          streamDelete: (streamObj) => {},
          // token 过期时间少于30s时会触发
          tokenWillExpire: (roomId, ctx) => {
            zegoToken({
              appId: Number(zegoConfig.appId),
              appSign: zegoConfig.appSign,
              userID: zegoConfig.uid,
              minute: 6 * 60
            }).then((data) => {
              if (data.code == 200) {
                // 更新token
                if (ctx.zg.renewToken(data.data, roomId)) {
                  ctx.token = data.data;
                }
              } else {
                this.$toast(data.msg);
              }
            });
          }
        }
      });
    },
    initFlv(options) {
      // const isiOS = /iOS/gi.test(this.uaEnv.os.name);
      // const isOPPO = /OPPO/gi.test(this.uaEnv.device.vendor);
      const isSupportFlv = flvjs.isSupported();
      let mediaDataSource = {
        isLive: true,
        cors: true,
        withCredentials: false
      };
      let flvConfig = {
        enableStashBuffer: false
      };
      if (isSupportFlv) {
        this.flvPlayer = flvjs.createPlayer(
          Object.assign(mediaDataSource, {
            type: 'flv',
            url: options.hdl.originPullUrl
          }),
          flvConfig
        );
      } else {
        this.flvPlayer = flvjs.createPlayer(
          Object.assign(mediaDataSource, {
            type: 'mp4',
            url: options.hls.originPullUrl
          }),
          flvConfig
        );
      }
      this.flvPlayer.attachMediaElement(this.$refs.h5Video);

      this.flvPlayer.muted = true;
      this.flvPlayer.load();
      this.flvPlayer.play();
      this.flvPlayer.on(flvjs.Events.ERROR, (err) => {
        console.error(err);
        this.flvPlayer.unload();
        this.flvPlayer.destroy();
      });
    },
    initLive() {
      // liveMode 1 声网 2YY 3机构
      // liveModeDetails 1RTC 2旁路CDN 3直推CDN 4L3
      // rtmp hdl hls hds
      let isInit = false;
      this.$nextTick(async () => {
        const options = this.options;
        if (options.zego) {
          const zego = this.initZego(options.zego);
          let isSupport = await zego.checkOnlyPull();
          if (isSupport) {
            this.zg = zego.init();
            isInit = true;
          }
        } else if (options.agora) {
          const agora = this.initAgora(options.agora);
          if (agora.checkOnlyPull()) {
            this.ag = agora.init();
            isInit = true;
          }
        }

        if (!isInit && (options.hdl || options.hls)) {
          this.initFlv(options);
          isInit = true;
        }

        this.isInit = isInit;
        if (!isInit) {
          alert(this.$t('device_no_support'));
        }
      });
    }
  }
};
</script>
<style scoped lang="scss">
.video-player {
  position: relative;
  width: 100%;
  height: 100%;
  video {
    width: 100%;
    height: 100%;
    object-fit: fill;
    object-position: 50% 50%;
  }
  &.horizontal {
    video {
      object-fit: contain;
      object-position: 50% 15%;
    }
  }
  .video-loading {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
/* 横屏 */
@media (orientation: landscape) {
  .video-player {
    &.vertical {
      video {
        object-fit: contain;
        object-position: 50% 50%;
      }
    }
    &.horizontal {
      video {
        object-fit: fill;
        object-position: 50% 50%;
      }
    }
  }
}
/* 竖屏 */
@media (orientation: portrait) {
  .video-player {
    &.vertical {
      video {
        object-fit: fill;
        object-position: 50% 50%;
      }
    }
    &.horizontal {
      video {
        object-fit: contain;
        object-position: 50% 15%;
      }
    }
  }
}
</style>
