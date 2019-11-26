// import { RouteView } from '@/components/layouts'
import { yundangl } from '@/core/icons'

const waybillChildRouter = [{
  path: '/waybill/WaybillList',
  name: 'WaybillList',
  hidden: false,
  component: () => import('@/views/waybill/waybill/WaybillList'),
  meta: {
    title: '运单管理',
    icon: yundangl,
    // permission: ['waybill:wayordermanage']
    permission: ['track']
  }
},
{
  path: '/waybill/WaybillAdd',
  name: 'WaybillAdd',
  hidden: true,
  component: () => import('@/views/waybill/waybill/WaybillAdd'),
  meta: {
    title: '新增运单',
    permission: ['waybill:wayaddorder']
  }
},
{
  path: '/waybill/WaybillEdit/:id',
  name: 'WaybillEdit',
  hidden: true,
  component: () => import('@/views/waybill/waybill/WaybillAdd'),
  meta: {
    title: '修改运单',
    permission: ['waybill:waychangeorder']
  }
},
{
  path: '/waybill/WaybillDetail/:id',
  name: 'WaybillDetail',
  hidden: true,
  component: () => import('@/views/waybill/waybill/WaybillDetail'),
  meta: {
    title: '运单详情',
    permission: ['waybill:wayorderdetail']
  }
}
]

// const waybillRouter = [{
//   path: '/waybill',
//   redirect: '/order/WaybillList',
//   component: RouteView,
//   meta: {
//     title: '运单管理',
//     icon: yundangl,
//     permission: ['waybill']
//   },
//   children: [
//     // 运单信息
//     ...waybillChildRouter
//   ]
// }]

export default waybillChildRouter
