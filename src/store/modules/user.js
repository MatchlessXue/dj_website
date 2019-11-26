import Vue from 'vue'
import { login, getInfo, logout } from '@/api/login'
import { ACCESS_TOKEN, TENANT_ID } from '@/store/mutation-types'
import { welcome } from '@/utils/util'

const user = {
  state: {
    token: '',
    name: '',
    companyName: '', // 公司名称
    welcome: '',
    count: 0, // 控制登录的次数
    avatar: '/avatar2.jpg', // 后端没有返回任何图像, 本地图像代替
    authRequired: false, // 是否需要授权， 用于判断是否为新用户， 新用户需要授权认证
    permissions: [], // 权限列表 也是用户拥有的组件列表
    tenantId: '', // 租户id
    info: {},
    // 控制账户登录，手机登录的错误提示
    accountAlertShow: false,
    accountAlertMsg: '',
    phoneAlertShow: false,
    phoneAlertMsg: ''
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_COMPANY_NAME: (state, name) => {
      state.companyName = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_COUNT: (state) => {
      state.count++
    },
    SET_AUTH_REQUIRED: (state, auth) => {
      state.authRequired = auth
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    },
    SET_TENANT_ID: (state, tenantId) => {
      console.log('mutation', tenantId)
      state.tenantId = tenantId
    },
    SET_ACCOUNT_ALERT_SHOW: (state, isShow) => {
      state.accountAlertShow = isShow
    },
    SET_ACCOUNT_ALERT_MSG: (state, msg) => {
      state.accountAlertMsg = msg
    },
    SET_PHONE_ALERT_SHOW: (state, isShow) => {
      state.phoneAlertShow = isShow
    },
    SET_PHONE_ALERT_MSG: (state, msg) => {
      state.phoneAlertMsg = msg
    },
    SET_INFO: (state, info) => {
      state.info = info
    }
  },

  actions: {
    // 登录
    Login ({ commit }, params) {
      return new Promise((resolve, reject) => {
        login(params).then(response => {
          const data = response.data
          // 存储token 及 token有效期 7小时 到缓存
          Vue.ls.set(ACCESS_TOKEN, data.token, 7 * 24 * 60 * 60 * 1000)
          commit('SET_TOKEN', data.token)
          commit('SET_AUTH_REQUIRED', data.authRequired)
          // // 设置刷新token值
          // commit('SET_REFRESH_TOKEN', data.refresh_token)
          // // 设置页面过期时间
          // commit('SET_EXPIRES_IN', data.expires_in)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          const data = response.data
          if (data.menuList && data.menuList.length > 0) { // 判断权限是否为空
            // 保存用户权限信息
            Vue.ls.set(TENANT_ID, data.tenantId, 7 * 24 * 60 * 60 * 1000)
            commit('SET_PERMISSIONS', data.menuList)
            console.log('1111', data.tenantId)
            commit('SET_TENANT_ID', data.tenantId)
            commit('SET_COMPANY_NAME', data.companyName)
            // 保存整个用户的信息
            commit('SET_INFO', data)
            // commGenerateRoutesit('SET_INFO', data)
          } else {
            reject(new Error('getInfo: permissions must be a non-null array !'))
          }
          // 保存用户名
          commit('SET_NAME', { name: data.loginName, welcome: welcome() })
          // commit('SET_AVATAR', data.avatar)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    Logout ({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_PERMISSIONS', [])
          Vue.ls.remove(ACCESS_TOKEN)
          resolve()
        }).catch(error => {
          // resolve()
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut ({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        Vue.ls.remove(ACCESS_TOKEN)
        resolve()
      })
    }

  }
}

export default user
