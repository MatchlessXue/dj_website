import { costTypeInput } from '@/api/settlement/customer'
const base = {
  data () {
    return {
      objectType: 3, // 结算对象类型 1:客户，2:承运商 3:司机 4:服务商
      tabItems: [
        { key: '1', title: '费用盘点', pathName: 'driverCostCheckList' },
        { key: '2', title: '结算单管理', pathName: 'driverSettleList' },
        { key: '3', title: '出纳确认', pathName: 'driverPaymentList' }
      ]
    }
  },
  computed: {
    // 结算的流程类型: 300:结算单管理，301:开票管理,302:出纳确认管理
    settleType () {
      const { path } = this.$route
      return path.includes('paymentList') ? 302 : (path.includes('invoiceList') ? 301 : 300)
    }
  },
  methods: {
    // 费用类型
    costTypeList () {
      return costTypeInput({ 'objectId': this.objectType })
    }
  }

}
export default base
