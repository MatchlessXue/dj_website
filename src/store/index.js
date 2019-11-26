import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import user from './modules/user'
import permission from './modules/permission'
import settlement from './modules/settlement'
import track from './modules/track'
import waybill from './modules/waybill'
import dispatch from './modules/dispatch'
import price from './modules/price'
import { PrintStore } from 'dj_print'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  // namespaced: true,
  modules: {
    app,
    user,
    permission,
    settlement,
    track,
    dispatch,
    price,
    waybill,
    PrintStore
  },
  mutations: {

  },
  actions: {

  },
  getters
})
