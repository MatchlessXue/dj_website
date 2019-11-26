import Vue from 'vue'
import router from './router'
import store from './store'

import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style

NProgress.configure({ showSpinner: false }) // NProgress Configuration

// let isReady = false // 判断新用户的router是否生成OK

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  console.log(router)
  // alert(to.path);
  if (to.path === '/user/login') {
    next({ path: '/dashboard/workplace' })
    NProgress.done()
  } else {
    // 动态添加可访问路由表
    // router.addRoutes(store.getters.addRouters)
    // const redirect = decodeURIComponent(from.query.redirect || to.path)
    // if (to.path === redirect) {
    //   next({ ...to, replace: true })
    // } else {
    //   next({ path: redirect })
    // }
    next()
  }
  NProgress.done()
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})

/**
 * Action 权限指令
 * 指令用法：
 *  - 在需要控制 action 级别权限的组件上使用 v-action:[method] , 如下：
 *    <a-button v-action:add >添加用户</a-button>
 *    <a-button v-action:delete>删除用户</a-button>
 *    <a v-action:edit @click="edit(record)">修改</a>
 *
 *  - 当前用户没有权限时，组件上使用了该指令则会被隐藏
 *  - 当后台权限跟 pro 提供的模式不同时，只需要针对这里的权限过滤进行修改即可
 *
 *  @see https://github.com/sendya/ant-design-pro-vue/pull/53
 */
const action = Vue.directive('action', {
  bind: function (el, binding, vnode) {
    const actionName = binding.arg
    const roles = store.getters.roles
    const permissionId = vnode.context.$route.meta.permission
    let actions = []
    roles.permissions.forEach(p => {
      if (p.permissionId !== permissionId) {
        return
      }
      actions = p.actionList
    })
    if (actions.indexOf(actionName) < 0) {
      setTimeout(() => {
        if (el.parentNode == null) {
          el.style.display = 'none'
        } else {
          el.parentNode.removeChild(el)
        }
      }, 10)
    }
  }
})

export {
  action
}
