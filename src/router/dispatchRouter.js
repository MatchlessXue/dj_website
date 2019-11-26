import {
  RouteView
} from '@/components/layouts'
import { diaodugl } from '@/core/icons'
const dispatchChildRouter = [{
  path: '/dispatch/RoadLineList',
  name: 'RoadLineList',
  hidden: false,
  component: () => import('@/views/dispatch/RoadLineList'),
  // redirect: '/dispatch/roadLineList/GoodsTab',
  meta: {
    title: '待调度运单',
    // keepAlive: true,
    permission: ['dispatch:roadlinelist']
  }
},
{
  path: '/dispatch/roadLineList/GoodsTab',
  name: 'GoodsTab',
  hidden: true,
  component: () => import('@/views/dispatch/tabs/goodsTab'),
  meta: {
    title: '提货调度',
    keepAlive: true,
    permission: ['dispatch:goodstab']
  }
},
{
  path: '/dispatch/roadLineList/linetab',
  name: 'LineTab',
  hidden: true,
  component: () => import('@/views/dispatch/tabs/lineTab'),
  meta: {
    title: '干线调度',
    keepAlive: true,
    permission: ['dispatch:linetab']
  }
}, {
  path: '/dispatch/roadLineList/DeliveryTab',
  name: 'DeliveryTab',
  hidden: true,
  component: () => import('@/views/dispatch/tabs/deliveryTab'),
  meta: {
    title: '配送调度',
    keepAlive: true,
    permission: ['dispatch:deliverytab']
  }
}, {
  path: '/dispatch/roadLineList/PreDispatchForTab/:type',
  name: 'PreDispatchForTab',
  hidden: true,
  component: () => import('@/views/dispatch/PreDispatchForTab'),
  meta: {
    title: '预调度',
    permission: ['dispatch:predispatchfortab']
  }
}, {
  path: '/dispatch/roadLineList/PreDispatchForFinal/:type',
  name: 'PreDispatchForFinal',
  hidden: true,
  component: () => import('@/views/dispatch/PreDispatchForFinal'),
  meta: {
    title: '预调度',
    permission: ['dispatch:predispatchforfinal']
  }
},
{
  path: '/dispatch/dispatchList',
  name: 'DispatchList',
  hidden: false,
  component: () => import('@/views/dispatch/DispatchList'),
  meta: {
    title: '查看调度单',
    // keepAlive: true,
    permission: ['dispatch:dispatchlist']
  }
},
{
  path: '/dispatch/detail/:dispatchId?',
  name: 'dispatchDetail',
  hidden: true,
  component: () => import('@/views/dispatch/AssignedVehicleDetail'),
  // component: () => import('@/views/dispatch/DispatchList/DispatchDetail'),
  meta: {
    title: '车辆调度单详细信息',
    // keepAlive: true,
    permission: ['dispatch:dispatchdetail']
  }
},
{
  path: '/dispatch/shopDetail/:dispatchId?',
  name: 'shopDetail',
  hidden: true,
  component: () => import('@/views/dispatch/AssignedVehicleDetail'),
  // component: () => import('@/views/dispatch/DispatchList/DispatchDetail'),
  meta: {
    title: '承运商调度单详细信息',
    // keepAlive: true,
    permission: ['dispatch:dispatchdetail']
  }
},
{
  path: '/dispatch/assignedVehicle/:dispatchId?',
  name: 'assignedVehicle',
  hidden: true,
  component: () => import('@/views/dispatch/AssignedVehicle'),
  meta: {
    title: '指派车辆',
    // keepAlive: true
    permission: ['dispatch:assignedVehicle']
  }
},
{
  path: '/dispatch/assignedShop/:dispatchId?',
  name: 'assignedShop',
  hidden: true,
  component: () => import('@/views/dispatch/AssignedVehicle'),
  meta: {
    title: '指派承运商',
    // keepAlive: true
    permission: ['dispatch:assignedVehicle']
  }
}

]

const dispatchRouter = [{
  path: '/dispatch',
  redirect: '/dispatch/DispatchManage',
  component: RouteView,
  meta: {
    title: '调度管理',
    icon: diaodugl,
    permission: ['dispatch']
  },
  children: [
    // 订单信息
    ...dispatchChildRouter
  ]
}]

export default dispatchRouter
