import { RouteView } from '@/components/layouts'
// import { diaodugl } from '@/core/icons'

const reportChildRouter = [
  {
    path: '/report/profitReportList',
    name: 'profitReport',
    component: () => import('@/views/report/ProfitReportList/Index'),
    meta: {
      title: '利润分析表',
      permission: ['report:profitReportList']
    }
  },
  {
    path: '/report/chartAnalysis',
    name: 'chartAnalysis',
    component: () => import('@/views/report/ChartAnalysis/Index'),
    meta: {
      title: '图表分析'// ,
      // permission: ['report:chartAnalysis']
    }
  },
  {
    path: '/report/operationStatisticsReportList',
    name: 'operationStatisticsReport',
    component: () => import('@/views/report/OperationStatisticsReportList/Index'),
    meta: {
      title: '运营统计表',
      permission: ['report:operationStatisticsReport']
    }
  }
]

const reportRouter = [{
  path: '/report',
  redirect: '/report/profitReport',
  component: RouteView,
  meta: {
    title: '报表管理',
    icon: 'bar-chart',
    permission: ['report']
  },
  children: [
    // 报表
    ...reportChildRouter
  ]
}]

export default reportRouter
