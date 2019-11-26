import { RouteView } from '@/components/layouts'
import { diaodugl } from '@/core/icons'
const approveChildRouter = [{
  path: '/approve/List',
  name: 'ApproveList',
  hidden: true,
  component: () => import('@/views/approve/List'),
  meta: {
    title: '审批列表'
  }
}, {
  path: '/approve/Manage',
  name: 'ApproveManage',
  hidden: true,
  component: () => import('@/views/approve/Manage'),
  meta: {
    title: '审批管理'
  }
}]

const approveRouter = [{
  path: '/approve',
  redirect: '/approve/Manage',
  component: RouteView,
  meta: {
    title: '审批',
    icon: diaodugl
    //   ,
    //   permission: ['approve']
  },
  children: [
    // 订单信息
    ...approveChildRouter
  ]
}]

export default approveRouter
