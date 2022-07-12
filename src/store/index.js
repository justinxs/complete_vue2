import Vue from 'vue';
import Vuex from 'vuex';
import member from './modules/member';
import sports from './modules/sports';

Vue.use(Vuex);

export default function createStore(options) {
  return new Vuex.Store({
    state: {
      langCode: 'zh-TW',
      serviceId: '',
      category: 'video',
      linkMap: {},
      curSeo: {},
      loading: false,
      statusBarHeight: 0,
      transitionName: '',
      backAction: '',
      nextGo: 0,
      CDN: '',
      firstLoadPath: ''
    },
    actions: {
      back({ commit }) {
        return commit('changeRouteAnimation', 'slide-right');
      },
      foraward({ commit }) {
        return commit('changeRouteAnimation', 'slide-left');
      }
    },
    mutations: {
      loading(state, val) {
        state.loading = val;
      },
      setCurSeo(state, data) {
        state.curSeo = data;
      },
      setLangCode(state, langCode) {
        state.langCode = langCode;
      },
      setLinkMap(state, data) {
        state.linkMap = data;
      },
      setServiceId(state, serviceId) {
        state.serviceId = serviceId;
      },
      setStatusBarHeight(state, val) {
        state.statusBarHeight = val || 0;
      },
      setCDN(state, CDN) {
        state.CDN = CDN;
      },
      setCategory(state, category) {
        state.category = category;
      },
      changeRouteAnimation(state, name) {
        state.transitionName = name;
      },
      changeBackAction(state, backAction) {
        state.backAction = backAction;
      },
      setFirstLoadPath(state, val) {
        state.firstLoadPath = val;
      },
      // 1 => forward -1 => back 0 => auto
      setNextGo(state, num) {
        state.nextGo = num;
      }
    },
    modules: {
      member,
      sports
    }
  });
}
