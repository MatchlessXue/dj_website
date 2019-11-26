import {
  RouteView
} from '@/components/layouts'
import { genzonggl } from '@/core/icons'

const trackChildRouter = [
  {
    path: '/track/waybill/waybillList/:id?',
    name: 'AbnormalList',
    hidden: false,
    component: () => import('@/views/track/waybill/waybillList'),
    meta: {
      title: '运单跟踪'
      // permission: ['track:waybillList']
    }
  },
  {
    path: '/track/dispatch/dispatchList',
    name: 'dispatchList',
    hidden: false,
    component: () => import('@/views/track/dispatch/dispatchList'),
    meta: {
      title: '调度单跟踪'
      // permission: ['track:dispatchList']
    }
  },
  {
    path: '/track/different/differentList',
    name: 'differentList',
    hidden: false,
    component: () => import('@/views/track/different/differentList'),
    meta: {
      title: '异常处理'
    // permission: ['track:differentList']
    }
  },
  {
    path: '/track/claim/claimList',
    name: 'claimList',
    hidden: false,
    component: () => import('@/views/track/claim/claimList'),
    meta: {
      title: '索赔赔偿'
    // permission: ['track:claimList']
    }
  },
  {
    path: '/track/expend/expendList',
    name: 'expendList',
    hidden: false,
    component: () => import('@/views/track/expend/expendList'),
    meta: {
      title: '特殊费处理'
    // permission: ['track:expendList']
    }
  }
]

const trackRouter = [{
  path: '/track',
  redirect: '/track/Abnormal/AbnormalList',
  component: RouteView,
  meta: {
    title: '跟踪管理',
    icon: genzonggl,
    permission: ['track']
  },
  children: [
    // 运单信息
    ...trackChildRouter
  ]
}]

export default trackRouter
