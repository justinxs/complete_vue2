export default {
  namespaced: true,
  state: () => ({
    isFree: false,
    isNewAnchorOrder: false,
    isShowSelectMode: false,
    gameTrying: false,
    hasNewMic: false
  }),
  actions: {
    setNewAnchorOrder({ state, rootState }, isNew) {
      if (isNew) {
        state.isNewAnchorOrder = true;
      } else {
        state.isNewAnchorOrder = false;
      }
    }
  },
  mutations: {
    updateGameTrying(state, val) {
      state.gameTrying = val;
    },
    updateFree(state, isFree) {
      state.isFree = isFree;
    },
    updateIsShowSelectMode(state, val) {
      state.isShowSelectMode = val;
    },
    setNewMic(state, isNew) {
      state.hasNewMic = isNew;
    }
  }
};
