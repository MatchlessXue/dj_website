import config from '../config'
import { settlementStatus } from '@/api/settlement/carrier'
import { costTypeInput } from '@/api/settlement/customer'

const base = {
  data () {
    return {
      // 结算类型
      settlementStatusMap: []
    }
  },
  computed: {
    // 页面类型 1:客户，2:承运商 3:司机 4:服务商
    pageType () {
      const { path } = this.$route
      let type = 1
      path.includes('settlement/customer') && (type = 1)
      path.includes('settlement/carrier') && (type = 2)
      path.includes('settlement/driver') && (type = 3)
      return type
    },
    tabItems () {
      let that = this
      if (this.pageType === 1) {
        return [
          { key: '1', title: '结算单明细', pathName: 'settlementOddDetail', show: that.pageSettleType >= 300 },
          { key: '2', title: '开票明细', pathName: 'ticketDetail', show: that.pageSettleType >= 301 },
          { key: '3', title: '结算明细', pathName: 'settlementDetail', show: that.pageSettleType > 301 },
          { key: '4', title: '附件明细', pathName: 'enclosureDetail', show: that.pageSettleType >= 302 }
        ]
      } else if (this.pageType === 2) {
        return [
          { key: '1', title: '运单明细', pathName: 'settlementOddDetail', show: that.pageSettleType >= 300 },
          { key: '2', title: '开票明细', pathName: 'ticketDetail', show: that.pageSettleType >= 301 },
          { key: '3', title: '结算明细', pathName: 'settlementDetail', show: that.pageSettleType > 301 },
          { key: '4', title: '附件明细', pathName: 'enclosureDetail', show: that.pageSettleType >= 302 }
        ]
      } else {
        return [
          { key: '1', title: '派车单详情', pathName: 'settlementOddDetail', show: that.pageSettleType >= 300 },
          { key: '2', title: '结算明细', pathName: 'settlementDetail', show: that.pageSettleType >= 301 },
          { key: '3', title: '附件明细', pathName: 'enclosureDetail', show: that.pageSettleType >= 302 }
        ]
      }
    },
    // 获取页面配置信息
    pageConfig () {
      return config[this.pageType]
    },
    // 结算的流程类型: 300:结算单管理，301:开票管理,302:出纳确认管理
    pageSettleType () {
      const { path } = this.$route
      return path.includes('paymentList') ? 302 : (path.includes('invoiceList') ? 301 : 300)
    },
    // 客户，承运商，司机运单的Id名称
    waybillIdName () {
      return {
        1: 'waybillId',
        2: 'dispatchedWaybillId',
        3: 'dispatchId'
      }[this.pageType]
    }
  },
  methods: {
    getSettlementStatusMap () {
      settlementStatus({ objectId: this.pageType }).then(res => {
        this.settlementStatusMap = res.data
      })
    },
    // 费用类型
    costTypeList () {
      return costTypeInput({ 'objectId': this.pageType })
    }
  }
}
export default base
