// 结算管理
import {
  RouteView
} from '@/components/layouts'
import { jiesuangl } from '@/core/icons'

const settlementChildRouter = [
  // 客户结算
  {
    path: '/settlement/customer/costsList',
    name: 'customerCostCheckList',
    hidden: false,
    component: () => import('@/views/settlement/customer/CostsList'),
    meta: {
      title: '客户结算',
      permission: ['settlement:customer_costsList']
    }
  },
  {
    path: '/settlement/customer/settleList',
    name: 'customerSettleList',
    hidden: true,
    component: () => import('@/views/settlement/customer/SettleList'),
    meta: {
      title: '客户结算单管理',
      permission: ['settlement:customer_settleList']
    }
  },
  {
    path: '/settlement/customer/invoiceList',
    name: 'customerInvoiceList',
    hidden: true,
    component: () => import('@/views/settlement/customer/SettleList'),
    meta: {
      title: '客户开票管理',
      permission: ['settlement:customer_invoiceList']
    }
  },
  {
    path: '/settlement/customer/paymentList',
    name: 'customerPaymentList',
    hidden: true,
    component: () => import('@/views/settlement/customer/SettleList'),
    meta: {
      title: '客户出纳确认',
      permission: ['settlement:customer_paymentList']
    }
  },

  // 司机结算
  {
    path: '/settlement/driver/costsList',
    name: 'driverCostCheckList',
    hidden: false,
    component: () => import('@/views/settlement/driver/CostsList'),
    meta: {
      title: '司机结算',
      permission: ['settlement:driver_costsList']
    }
  },
  {
    path: '/settlement/driver/settleList',
    name: 'driverSettleList',
    hidden: true,
    component: () => import('@/views/settlement/driver/SettleList'),
    meta: {
      title: '司机结算单管理',
      permission: ['settlement:driver_settleList']
    }
  },
  {
    path: '/settlement/driver/paymentList',
    name: 'driverPaymentList',
    hidden: true,
    component: () => import('@/views/settlement/driver/SettleList'),
    meta: {
      title: '司机出纳确认',
      permission: ['settlement:driver_paymentList']
    }
  },

  // 承运商结算
  {
    path: '/settlement/carrier/costsList',
    name: 'carrierCostCheckList',
    hidden: false,
    component: () => import('@/views/settlement/carrier/CostsList'),
    meta: {
      title: '承运商结算',
      permission: ['settlement:carrier_costsList']
    }
  },
  // {
  //   path: '/settlement/carrier/settleList/:type',
  //   name: 'carrierSettle',
  //   hidden: true,
  //   component: (a, b) => {
  //     // console.log('######', this, arguments)
  //     // if (this.type === 1) {
  //     //   return import('@/views/settlement/carrier/CostsList')
  //     // }
  //     return import('@/views/settlement/carrier/SettleList')
  //   },
  //   meta: {
  //     title: '承运商结算',
  //     permission: ['settlement:carrier_settle']
  //   }
  // },
  {
    path: '/settlement/carrier/settleList',
    // redirect: { name: 'carrierSettle', params: { type: 1 } },
    name: 'carrierSettleList',
    hidden: true,
    component: () => import('@/views/settlement/carrier/SettleList'),
    meta: {
      title: '承运商结算单管理',
      permission: ['settlement:carrier_settleList']
    }
  },
  {
    path: '/settlement/carrier/invoiceList',
    name: 'carrierInvoiceList',
    hidden: true,
    component: () => import('@/views/settlement/carrier/SettleList'),
    meta: {
      title: '承运商开票管理',
      permission: ['settlement:carrier_invoiceList']
    }
  },
  {
    path: '/settlement/carrier/paymentList',
    name: 'carrierPaymentList',
    hidden: true,
    component: () => import('@/views/settlement/carrier/SettleList'),
    meta: {
      title: '承运商出纳确认',
      permission: ['settlement:carrier_paymentList']
    }
  }
]

const settlementRouter = [{
  path: '/settlement',
  redirect: { name: 'carrierSettle', type: 1 },
  component: RouteView,
  meta: {
    title: '结算管理',
    icon: jiesuangl,
    permission: ['settlement']
  },
  children: [
    // 结算管理
    ...settlementChildRouter
  ]
}]

export default settlementRouter
