export default {
  namespaced: true,
  state: () => ({
    info: null,
    memberId: '',
    anchorId: '',
    balanceData: {}
  }),
  actions: {},
  getters: {
    isAnchor(state, getters) {
      return !!state.memberId && state.memberId === state.anchorId;
    }
  },
  mutations: {
    setInfo(state, data) {
      state.info = data;
    },
    setBalance(state, data) {
      state.balanceData = data;
    },
    setMemberId(state, memberId) {
      state.memberId = memberId;
    },
    setAnchorId(state, anchorId) {
      state.anchorId = anchorId;
    }
  }
};
