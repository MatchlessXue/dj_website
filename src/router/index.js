import Vue from 'vue'
import Router from 'vue-router'
import {
  UserLayout,
  BasicLayout,
  RouteView,
  BlankLayout,
  BasicManualLayout
} from '@/components/layouts'
import {
  yibiaopan,
  yonghuzhongxin,
  xitonggl,
  yundangl
} from '@/core/icons'

import ResourceRouter from './resourceRouter'
import waybillRouter from './waybillRouter'
import DispatchRouter from './dispatchRouter'
import TrackRouter from './trackRouter'
import SettlementRouter from './settlementRouter'
import ManualChildRouter from './manualRouter'
import ReportRouter from './reportRouter'
import ApproveRouter from './approveRouter'

Vue.use(Router)

export let asyncRouterMap = [

  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: {
      title: '首页'
    },
    redirect: '/dashboard',
    children: [{
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/dashboard/Workplace'),
      meta: {
        title: '首页',
        icon: yibiaopan
      }
    },
    // 审批管理
    ...ApproveRouter,
    // 订单管理
    // ...OrderRouter,
    // 运单管理
    ...waybillRouter,
    // 调度管理
    ...DispatchRouter,
    // 跟踪管理
    ...TrackRouter,

    {
      path: '/waybill/receipt/ReceiptList/:externalType?',
      name: 'receiptList',
      hidden: false,
      component: () => import('@/views/waybill/receipt/ReceiptList'),
      meta: {
        title: '回单管理',
        icon: yundangl,
        permission: ['receiptList']
      }
    },
    {
      path: '/waybill/receipt/ReceiptDetail/:id',
      name: 'receiptDetail',
      hidden: true,
      component: () => import('@/views/waybill/receipt/ReceiptDetail'),
      meta: {
        title: '回单详情',
        permission: ['receiptList:receiptDetail']
      }
    },

    // 结算管理
    ...SettlementRouter,
    // 报表管理
    ...ReportRouter,
    // 资源管理
    ...ResourceRouter,
    {
      path: '/system',
      name: 'system',
      redirect: '/system/AccountManage',
      component: RouteView,
      meta: {
        title: '系统管理',
        icon: xitonggl,
        permission: ['system']
      },
      children: [{
        path: '/system/UserManage',
        name: 'UserManage',
        hidden: false,
        component: () => import('@/views/system/UserManage'),
        meta: {
          title: '用户管理',
          permission: ['system:user']
        }
      },
      {
        path: '/system/FeeManage',
        name: 'FeeManage',
        hidden: false,
        component: () => import('@/views/system/FeeManage'),
        meta: {
          title: '费用管理'
          // permission: ['system:user']
        }
      },
      {
        path: '/system/AccountManage',
        name: 'AccoutManage',
        hidden: false,
        component: () => import('@/views/system/AccountManage'),
        meta: {
          title: '账号管理',
          permission: ['system:account']
        }
      },
      {
        path: '/system/RoleManage',
        name: 'RoleManage',
        hidden: false,
        component: () => import('@/views/system/RoleManage'),
        meta: {
          title: '角色管理',
          permission: ['system:role']
        }
      },
      {
        path: '/system/MenuManage',
        name: 'MenuManage',
        hidden: false,
        component: () => import('@/views/system/MenuManage'),
        meta: {
          title: '菜单管理',
          permission: ['system:menu']
        }
      },
      {
        path: '/system/DepartManage',
        name: 'DepartManage',
        hidden: false,
        component: () => import('@/views/system/DepartManage'),
        meta: {
          title: '部门管理',
          permission: ['system:depart']
        }
      },
      {
        path: '/system/DataDictionary',
        name: 'DataDictionary',
        hidden: false,
        component: () => import('@/views/system/DataDictionary'),
        meta: {
          title: '数据字典',
          permission: ['system:dict']
        }
      },
      {
        path: '/system/OptionLog',
        name: 'OptionLog',
        hidden: false,
        component: () => import('@/views/system/OptionLog'),
        meta: {
          title: '操作日志',
          permission: ['system:optionlog']
        }
      },
      {
        path: '/system/LoginLog',
        name: 'LoginLog',
        hidden: false,
        component: () => import('@/views/system/LoginLog'),
        meta: {
          title: '登录日志',
          permission: ['system:loginlog']
        }
      }
      ]
    },
    // account
    {
      path: '/account',
      component: RouteView,
      name: 'account',
      meta: {
        title: '用户中心',
        icon: yonghuzhongxin,
        keepAlive: true,
        permission: ['enterprise']
      },
      children: [{
        path: '/account/center',
        // path: '/resource/gps/List',
        name: 'center',
        component: () => import('@/views/account/center/Index'),
        // component: () => import('@/views/resource/gps/List'),
        meta: {
          title: '企业认证',
          keepAlive: true,
          permission: ['enterprise:auth']
        }
      },
      {
        path: '/account/settings',
        // path: '/resource/gps/List',
        name: 'settings',
        component: () => import('@/views/account/settings/Index'),
        // component: () => import('@/views/resource/gps/List'),
        meta: {
          title: '企业信息',
          // hideHeader: true,
          keepAlive: true,
          permission: ['enterprise:info']
        }
        // redirect: '/account/settings/base',
        // alwaysShow: true
      }
      ]
    },
    // 后台管理
    {
      path: '/admin',
      component: RouteView,
      name: 'admin',
      meta: {
        title: '后台管理',
        icon: 'setting',
        keepAlive: true,
        permission: ['admin']
      },
      children: [{
        path: '/admin/feeManagement',
        name: 'feeManagement',
        component: () => import('@/views/admin/feeManagement/FeeList'),
        meta: {
          title: '费用管理',
          keepAlive: true
          // permission: ['admin:feeManagement']
        }
      },
      {
        path: '/admin/tenantManagement',
        name: 'tenantManagement',
        component: () => import('@/views/admin/tenantManagement/TenantList'),
        meta: {
          title: '租户管理',
          keepAlive: true
          // permission: ['admin:tenantManagement']
        }
      },
      {
        path: '/admin/tenantManagement/FeeSet/:id',
        name: 'FeeSet',
        hidden: true,
        component: () => import('@/views/admin/tenantManagement/FeeSet'),
        meta: {
          title: '费用设置',
          keepAlive: false
          // permission: ['admin:FeeSet']
        }
      },
      {
        path: '/admin/tenantManagement/TenantEdit/:id',
        name: 'TenantEdit',
        hidden: true,
        component: () => import('@/views/admin/tenantManagement/TenantEdit'),
        meta: {
          title: '企业信息',
          keepAlive: false
          // permission: ['admin:TenantEdit']
        }
      },
      {
        path: '/admin/tenantManagement/TenantViews/:id',
        name: 'TenantViews',
        hidden: true,
        component: () => import('@/views/admin/tenantManagement/TenantViews'),
        meta: {
          title: '企业信息查看',
          keepAlive: false
          // permission: ['admin:TenantViews']
        }
      },
      {
        path: '/account/employerapprove',
        // path: '/resource/gps/List',
        name: 'employerapprove',
        component: () => import('@/views/account/employerapprove/Index'),
        // component: () => import('@/views/resource/gps/List'),
        meta: {
          title: '企业审核',
          keepAlive: true,
          permission: ['admin:audit']
        }
      },
      {
        path: '/admin/print',
        name: 'Print',
        component: () => import('@/views/admin/print/PrintIndex'),
        meta: {
          title: '打印模板'
        }
      }
      ]
    }
    ]
  },
  {
    path: '*',
    redirect: '/dashboard',
    hidden: true
  }
]
/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [{
  path: '/user',
  component: UserLayout,
  redirect: '/user/login',
  hidden: true,
  children: [{
    path: 'login',
    name: 'login',
    component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
  }]
},
{
  path: '/agreement',
  name: 'agreement',
  component: () => import('@/views/user/Agreement')
}, {
  path: '/test',
  component: BlankLayout,
  redirect: '/test/home',
  children: [{
    path: 'home',
    name: 'TestHome',
    component: () => import('@/views/Home')
  }, {
    path: 'useremployerauth',
    name: 'TestUserEmployerAuth',
    component: () => import('@/views/UserEmployerAuth')
  }]
},
{
  path: '/printDetail/:printtemplateId?',
  name: 'PrintDetail',
  hidden: true,
  component: () => import('@/views/admin/print/PrintDetail'),
  meta: {
    title: '编辑打印模板'
  }
},
{
  path: '/manual',
  component: BasicManualLayout,
  redirect: '/manual/workbench',
  children: [
    ...ManualChildRouter
  ]
}, {
  path: '/404',
  component: () => import('@/views/exception/404')
}
]
asyncRouterMap = asyncRouterMap.concat(constantRouterMap)
export default new Router({
  routes: asyncRouterMap
})
