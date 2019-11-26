<template>
  <a-locale-provider :locale="locale">
    <div id="app">
      <router-view/>
      <print-check :showError="false" :store="$store"></print-check>
    </div>
  </a-locale-provider>
</template>

<script>
import Vue from 'vue'
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import { deviceEnquire, DEVICE_TYPE } from '@/utils/device'
import { version } from 'ant-design-vue'
// 入口就初始化打印服务,缓存到vuex中
import { PrintCheck } from 'dj_print'
// 默认语言为 en-US，如果你需要设置其他语言，推荐在入口文件全局设置 locale
import moment from 'moment'
import 'moment/locale/zh-cn'
import { TENANT_ID } from '@/store/mutation-types'
import { mapActions } from 'vuex'
moment.locale('zh-cn')
export default {
  components: { PrintCheck },
  data () {
    return {
      locale: zhCN,
      version,
      storageName: window.storageName || 'pro',
      sessionStorage: window.sessionStorage
    }
  },

  methods: {
    ...mapActions(['GetInfo']),
    getSessionStorage () {
      let ss = this.sessionStorage.getItem(this.storageName)
      if (ss) {
        return JSON.parse(decodeURIComponent(ss))
      }
    },
    getSessionStorageProperty (propertyName) {
      let sessionStorage = this.getSessionStorage()
      if (sessionStorage) {
        return sessionStorage[propertyName]
      }
    },
    mediaQuery () {
      const { $store } = this
      deviceEnquire(deviceType => {
        switch (deviceType) {
          case DEVICE_TYPE.DESKTOP:
            $store.commit('TOGGLE_DEVICE', 'desktop')
            $store.dispatch('setSidebar', true)
            break
          case DEVICE_TYPE.TABLET:
            console.log('tablet')
            $store.dispatch('ToggleDevice', 'tablet')
            $store.dispatch('setSidebar', false)
            break
          case DEVICE_TYPE.MOBILE:
          default:
            $store.commit('TOGGLE_DEVICE', 'mobile')
            $store.dispatch('setSidebar', false)
            break
        }
      })
    },
    getStoreFromParent (temp, func) {
      window.parent.postMessage({
        type: 'get',
        field: temp.field,
        value: temp.value
      }, window.parent.location.origin)
      if (window.addEventListener.message) {
        window.removeEventListener('message')
      }
      window.addEventListener('message', function (e) {
        func && func(e.data)
      })
    }
  },
  created () {
    // 获取userinfo
    this.getStoreFromParent({ field: 'GET_USER_INFO' }, (res) => {
      if (res.value) {
        let data = res.value
        Vue.ls.set(TENANT_ID, data.tenantId, 7 * 24 * 60 * 60 * 1000)
        this.$store.commit('SET_PERMISSIONS', data.menuList)
        this.$store.commit('SET_TENANT_ID', data.tenantId)
        this.$store.commit('SET_COMPANY_NAME', data.companyName)
        this.$store.commit('SET_INFO', data)
        this.$ls.set('TENANT_ID', data.tenantId)
        this.$store.commit('setPrintUserInfo', data)
      }
    })
  },
  mounted () {
    this.mediaQuery()
  }
}
</script>
<style lang="scss">
  @import "style/style";
  // 滚动条样式(仅支持chrome或基于chromium内核的浏览器)
  ::-webkit-scrollbar {width: 8px;height: 8px;}
  ::-webkit-scrollbar-thumb {min-height: 20px;background: rgba(0, 0, 0, 0.5);border-radius: 4px;}
  ::-webkit-scrollbar-track-piece{background: rgba(255, 255, 255, 0.5);}
  // antd 表头内容禁止换行
  .ant-table-thead > tr > th {
    white-space: nowrap;
  }
  #app {
    height: 100%;
  }
</style>
