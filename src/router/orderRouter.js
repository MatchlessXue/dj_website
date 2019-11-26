import {
  RouteView
} from '@/components/layouts'
import { dingdangl } from '@/core/icons'

const orderChildRouter = [{
  path: '/order/OrderManage',
  name: 'OrderManage',
  hidden: false,
  component: () => import('@/views/order/OrderManage'),
  meta: {
    title: '订单管理',
    permission: ['order:manage']
  }
},
{
  path: '/order/orderNew',
  name: 'orderNew',
  hidden: true,
  component: () => import('@/views/order/orderNew'),
  meta: {
    title: '新增订单',
    permission: ['order:addorder']
  }
},
{
  path: '/order/OrderEdit/:id',
  name: 'OrderEdit',
  hidden: true,
  component: () => import('@/views/order/orderNew'),
  meta: {
    title: '修改订单',
    permission: ['order:changeorder']
  }
},
{
  path: '/order/orderDetail/:id',
  name: 'orderDetail',
  hidden: true,
  component: () => import('@/views/order/orderDetail'),
  meta: {
    title: '订单详情',
    permission: ['order:orderdetail']
  }
}
]

const orderRouter = [{
  path: '/order',
  redirect: '/order/OrderManage',
  component: RouteView,
  meta: {
    title: '订单管理',
    icon: dingdangl,
    permission: ['order']
  },
  children: [
    // 订单信息
    ...orderChildRouter
  ]
}]

export default orderRouter
