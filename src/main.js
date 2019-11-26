
import 'babel-polyfill' // 兼容IE
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'

import './core/use'
import bootstrap from './core/bootstrap'
import '@/permission' // permission control
import '@/utils/filter' // global filter
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
import '@/assets/iconfont/iconfont.css'
import '@/utils/businessConsts' // 系统全局常量

// // 加入富文本编辑器
// import VueQuillEditor from 'vue-quill-editor'
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'
//
// Vue.use(VueQuillEditor)

Vue.config.productionTip = false
console.log('vue版本', Vue.version)
console.log('vue版本', Vue.version)
Vue.use(router)

Vue.use(Viewer, {
  defaultOptions: {
    zIndex: 9999
  }
})

new Vue({
  router,
  store,
  created () {
    bootstrap()
  },
  render: h => h(App)
}).$mount('#app')
