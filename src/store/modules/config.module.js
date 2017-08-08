import * as types from '../types'
export default {
  state: {
    'loadingNow': true,
    'enterHash': '',
    'isApp': false,
    'isWechat': false,
    'actionStatu': { // 操作状态
      'type': 'info', // 提示类型 : info , warning ,error ,success
      'message': ''
    },
    'showFollowFlag': false,
    'bannerList': [],
    'maskingNow': false
  },
  actions: {
    [types.SET_ENTER_HASH]: ({ commit }, hashUrl) => {
      commit(types.SET_ENTER_HASH, hashUrl)
    },
    [types.TOGGLE_LOAD_STATU]: ({ commit }, flag) => {
      commit(types.TOGGLE_LOAD_STATU, flag)
    },
    [types.SET_ACTION_STATU]: ({ commit }, data) => {
      commit(types.SET_ACTION_STATU, data)
    },
    [types.SET_IS_WECHAT]: ({ commit }, flag) => {
      commit(types.SET_IS_WECHAT, flag)
    },
    [types.SET_IS_APP]: ({ commit }, flag) => {
      commit(types.SET_IS_APP, flag)
    },
    [types.SHOW_FOLLOW_FLAG]: ({ commit }, flag) => {
      commit(types.SHOW_FOLLOW_FLAG, flag)
    },
    [types.SET_BANNER_LIST]: ({ commit }, data) => {
      commit(types.SET_BANNER_LIST, data)
    },
    [types.SET_MASK_FLAG]: ({ commit }, data) => {
      commit(types.SET_MASK_FLAG, data)
    }
  },
  mutations: {
    [types.SET_ENTER_HASH]: (state, hashUrl) => {
      state.enterHash = hashUrl
    },
    [types.TOGGLE_LOAD_STATU]: (state, flag) => {
      state.loadingNow = flag
    },
    [types.SET_ACTION_STATU]: (state, data) => {
      state.actionStatu = data
    },
    [types.SET_IS_WECHAT]: (state, flag) => {
      state.isWechat = flag
    },
    [types.SET_IS_APP]: (state, flag) => {
      state.isApp = flag
    },
    [types.SHOW_FOLLOW_FLAG]: (state, flag) => {
      state.showFollowFlag = flag
    },
    [types.SET_BANNER_LIST]: (state, data) => {
      state.bannerList = data
    },
    [types.SET_MASK_FLAG]: (state, data) => {
      state.maskingNow = data
    }
  },
  getters: {
    getEnterHash: state => {
      return state.enterHash
    },
    getBannerList: state => {
      return state.bannerList
    },
    getLoadingStatu: state => {
      return state.loadingNow
    },
    getActionStatu: state => {
      return state.actionStatu
    },
    getIsWechat: state => {
      return state.isWechat
    },
    getIsApp: state => {
      return state.isApp
    },
    getFollowShowFlag: state => {
      return state.showFollowFlag
    },
    getMask: state => {
      return state.maskingNow
    }
  }
}
