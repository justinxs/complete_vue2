import { setFollow, followList } from '@/api/member';
import {
  roomMuteList,
  roomManageList,
  kickOutList,
  kickOut,
  roomMute,
  setRoomManage
} from '@/api/live';
import imChat from './imChat';

/**
 * 添加@用户，当前在chat会自动在输入框@
 * @param {Object} store vuex 实例
 * @param {Object} member 用户信息
 */
export function addGlobalAtMembers({ store, member }) {
  store.commit('live/addGlobalAtMembers', member);
}

/**
 * 清空@用户
 * @param {Object} store vuex 实例
 */
export function clearGlobalAtMembers({ store }) {
  store.commit('live/clearGlobalAtMembers');
}

/**
 * 我的关注
 * @param {Object} store vuex 实例
 */
export function getFollowList({ store }) {
  return followList({
    page: 1,
    limit: 10000
  }).then((data) => {
    if (data.code == 200) {
      store.commit('member/setFollowList', data.data.items);
    }
    return data;
  });
}

/**
 * 房间禁言列表
 * @param {Object} store vuex 实例
 * @param {Number} anchorId 房间主播id
 */
export function getRoomMuteList({ store, anchorId }) {
  return roomMuteList({
    anchorId,
    page: 1,
    limit: 10000
  }).then((data) => {
    if (data.code == 200) {
      store.commit('live/setRoomMuteList', data.data.items);
    }
    return data;
  });
}

/**
 * 房管列表
 * @param {Object} store vuex 实例
 * @param {Number} anchorId 房间主播id
 */
export function getRoomManageList({ store, anchorId }) {
  return roomManageList({
    anchorId,
    page: 1,
    limit: 10000
  }).then((data) => {
    if (data.code == 200) {
      store.commit('live/setRoomManageList', data.data.items);
    }
    return data;
  });
}

/**
 * 踢出房间列表
 * @param {Object} store vuex 实例
 * @param {Number} anchorId 房间主播id
 */
export function getKickOutList({ store, anchorId }) {
  return kickOutList({
    anchorId,
    page: 1,
    limit: 10000
  }).then((data) => {
    if (data.code == 200) {
      store.commit('live/setKickOutList', data.data.items);
    }
    return data;
  });
}

/**
 * 关注用户
 * @param {Object} store vuex 实例
 * @param {Object} params 接口参数
 * @param {Number} params.memberId 被关注人id
 * @param {Number} params.anchorId 房间主播id
 * @param {Number} params.follow 1=关注， 0=取消关注
 * @param {Object} exInfo 额外信息
 * @param {Number} exInfo.id 关注人id
 * @param {String} exInfo.nickname 关注人昵称
 * @param {Boolean} exInfo.refresh 是否刷新列表
 *
 * exInfo 存在则在关注主播后自动推送一条 im 并更新当前关注列表
 */
export function followMember({ store, params, exInfo = {} }) {
  return setFollow({
    memberId: params.memberId,
    follow: params.follow
  }).then((data) => {
    if (data.code == 200) {
      // 推送关注主播im
      if (
        exInfo &&
        exInfo.id &&
        params.memberId == params.anchorId &&
        params.follow == 1
      ) {
        sendFollowAnchorMessage({
          data: {
            memberId: exInfo.id,
            nickname: exInfo.nickname,
            anchorId: params.anchorId
          },
          anchorId: params.anchorId
        });
      }
      // 更新关注列表
      exInfo.refresh && getFollowList({ store });
    }
    return data;
  });
}

/**
 * 踢出房间
 * @param {Object} store vuex 实例
 *
 * @param {Object} params 接口参数
 * @param {Number} params.memberId 被踢出人id
 * @param {Number} params.anchorId 房间主播id
 * @param {Number} params.forbidTimeSpan 踢出时长
 * @param {String} params.reason 踢出原因
 *
 * @param {Object} exInfo 额外信息
 * @param {Boolean} exInfo.refresh 是否刷新列表
 */
export function kickoutRoom({ store, params, exInfo = {} }) {
  return kickOut({
    memberId: params.memberId,
    anchorId: params.anchorId,
    forbidTimeSpan: params.forbidTimeSpan,
    reason: params.reason
  }).then((data) => {
    if (data.code == 200) {
      // 推送踢出im
      sendKitoutMesasge({
        data: {
          memberId: params.memberId,
          status: params.forbidTimeSpan == 0 ? 1 : 0,
          expireTime:
            params.forbidTimeSpan > 0
              ? params.forbidTimeSpan + Math.ceil(Date.now() / 1000)
              : params.forbidTimeSpan,
          reason: params.reason
        },
        anchorId: params.anchorId
      });

      // 更新踢出列表
      exInfo.refresh && getKickOutList({ store, anchorId: params.anchorId });
    }
    return data;
  });
}

/**
 * 房间禁言
 * @param {Object} store vuex 实例
 *
 * @param {Object} params 接口参数
 * @param {Number} params.memberId 被禁言人id
 * @param {Number} params.anchorId 房间主播id
 * @param {Number} params.forbidTimeSpan 禁言时长
 * @param {String} params.reason 禁言原因
 *
 * @param {Object} exInfo 额外信息
 * @param {Boolean} exInfo.refresh 是否刷新列表
 */
export function disabledRoomSay({ store, params, exInfo = {} }) {
  return roomMute({
    memberId: params.memberId,
    anchorId: params.anchorId,
    forbidTimeSpan: params.forbidTimeSpan,
    reason: params.reason
  }).then((data) => {
    if (data.code == 200) {
      // 推送房间禁言im
      sendMuteMesasge({
        data: {
          memberId: params.memberId,
          status: params.forbidTimeSpan == 0 ? 1 : 0,
          expireTime:
            params.forbidTimeSpan > 0
              ? params.forbidTimeSpan + Math.ceil(Date.now() / 1000)
              : params.forbidTimeSpan,
          reason: params.reason
        },
        anchorId: params.anchorId
      });

      // 更新禁言列表
      exInfo.refresh && getRoomMuteList({ store, anchorId: params.anchorId });
    }
    return data;
  });
}

/**
 * 设置房管
 * @param {Object} store vuex 实例
 *
 * @param {Object} params 接口参数
 * @param {Number} params.memberId 房管用户ID
 * @param {String} params.avatar 房管用户头像
 * @param {String} params.nickname 房管用户昵称
 * @param {Number} params.anchorId 房间主播id
 * @param {Number} params.type 0 取消 1添加
 *
 * @param {Object} exInfo 额外信息
 * @param {Boolean} exInfo.refresh 是否刷新列表
 */
export function setRoomManager({ store, params, exInfo = {} }) {
  return setRoomManage({
    memberId: params.memberId,
    anchorId: params.anchorId,
    type: params.type
  }).then((data) => {
    if (data.code == 200) {
      // 推送房管设置im
      sendRoomManageMesasge({
        data: {
          memberId: params.memberId,
          avatar: params.avatar,
          nickname: params.nickname,
          status: params.type
        },
        anchorId: params.anchorId
      });

      // 更新房管列表
      exInfo.refresh && getRoomManageList({ store, anchorId: params.anchorId });
    }
    return data;
  });
}

/**
 * 生成推送 im 消息必要字段
 *
 * @param {Number} msgType im 消息类型 < 500需要登录用户信息
 * @param {Number} anchorId 主播ID
 *
 * @param {Object} userInfo 发言用户信息
 * @param {Number} userInfo.id 登录用户ID
 * @param {String} userInfo.nickname 登录用户昵称
 * @param {String} userInfo.avatar 登录用户头像
 * @param {Array} userInfo.roles 登录用户角色
 * @param {Object} userInfo.vipInfo 登录用户vip信息
 * @param {Number} userInfo.vipInfo.id 登录用户vip id
 * @param {Number} userInfo.level 登录用户等级
 */
export function getDefaultMessage({ msgType, anchorId, userInfo = {} }) {
  let defaultMsg = null;
  if (msgType >= 500) {
    defaultMsg = {
      msgType,
      anchorId,
      sendTime: Date.now()
    };
  } else {
    defaultMsg = {
      msgType,
      anchorId,
      fromId: userInfo.id,
      fromNick: userInfo.nickname,
      fromAvatar: userInfo.avatar,
      terminal: 'web',
      roleId: Math.max(...(userInfo.roles || [0])),
      level: userInfo.level,
      vipId: userInfo.vipInfo ? userInfo.vipInfo.id : 0,
      sendTime: Date.now()
    };
  }
  return defaultMsg;
}

/**
 * 发言 im
 * @param {String} content 发言内容
 * @param {Number} anchorId 主播ID
 * @param {Object} userInfo 发言用户信息
 *
 * imChat 必须已经初始化并连接上im
 */
export function sendMessage({ content, anchorId, userInfo }) {
  const defaultMsg = getDefaultMessage({ msgType: 100, anchorId, userInfo });
  const sayMsg = {
    data: content
  };
  return imChat.sendCustomMsg(Object.assign({}, defaultMsg, sayMsg));
}

/**
 * @发言推送 im
 * @param {String} content 发言内容
 * @param {Number} anchorId 主播ID
 * @param {Object} userInfo 发言用户信息
 * @param {Array} toMember @用户集合
 *
 * imChat 必须已经初始化并连接上im
 */
export function sendAtMessage({ content, anchorId, toMember = [], userInfo }) {
  const defaultMsg = getDefaultMessage({ msgType: 101, anchorId, userInfo });
  let atMsg = Object.assign({}, defaultMsg, {
    data: content,
    toMember: toMember
  });
  return imChat.sendCustomMsg(atMsg);
}

/**
 * 关注主播推送im通知
 * @param {Object} data 推送数据
 * @param {Number} anchorId 主播ID
 *
 * imChat 必须已经初始化并连接上im
 */
export function sendFollowAnchorMessage({ data, anchorId }) {
  const defaultMsg = getDefaultMessage({ msgType: 1304, anchorId });
  imChat.sendCustomMsg(Object.assign({}, defaultMsg, { data }));
}

/**
 * 推送踢出im
 * @param {Object} data 推送数据
 * @param {Number} anchorId 主播ID
 *
 * imChat 必须已经初始化并连接上im
 */
export function sendKitoutMesasge({ data, anchorId }) {
  const defaultMsg = getDefaultMessage({ msgType: 503, anchorId });
  imChat.sendCustomMsg(Object.assign({}, defaultMsg, { data }));
}

/**
 * 推送房间禁言im
 * @param {Object} data 推送数据
 * @param {Number} anchorId 主播ID
 *
 * imChat 必须已经初始化并连接上im
 */
export function sendMuteMesasge({ data, anchorId }) {
  const defaultMsg = getDefaultMessage({ msgType: 502, anchorId });
  imChat.sendCustomMsg(Object.assign({}, defaultMsg, { data }));
}

/**
 * 推送房管设置im
 * @param {Object} data 推送数据
 * @param {Number} anchorId 主播ID
 *
 * imChat 必须已经初始化并连接上im
 */
export function sendRoomManageMesasge({ data, anchorId }) {
  const defaultMsg = getDefaultMessage({ msgType: 506, anchorId });
  imChat.sendCustomMsg(Object.assign({}, defaultMsg, { data }));
}

/**
 * 关闭当前页面
 * 由window.open(url, '_blank')打开的可自行关闭，微信上不行
 */
export function closeWindow() {
  if (window.opener) {
    window.opener = null;
    window.close();
  } else {
    history.back();
  }
}

// 清除房间相关缓存，恢复到初始状态，以便再次进入房间重新请求并缓存
export function clearRoom({ store }) {
  imChat.destroy();
  if (store) {
    store.commit('live/setImInfo', {});
    store.commit('live/setRoomInfo', {});
    store.commit('live/setStreamInfo', {});
    store.commit('live/setScheduleInfo', {});
    store.commit('live/setTipMsg', '');
    store.commit('live/setHistory', []);
    store.commit('live/clearGlobalAtMembers');
    store.commit('live/setRoomMuteList', []);
    store.commit('live/setRoomManageList', []);
    store.commit('live/setKickOutList', []);
    store.commit('live/setMemberLiveInfo', {});
    store.commit('live/updateFollowAnchor', []);
  }
}
