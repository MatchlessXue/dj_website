import { getApproveTypeList } from '@/api/libraries'
import { updateNumberToApprove } from '@/api/common'
export const approveBase = {
  data () {
    return {
      isIndependent: false,
      approveTypeList: []
    }
  },
  methods: {
    queryApproveTypeList () {
      getApproveTypeList().then(res => {
        // console.log('getApproveTypeList>res515', res)
        res.data &&
          res.data.forEach(type => {
            this.approveTypeList.push({
              approveTypeId: type.dictId,
              approveTypeName: type.dictName
            })
          })
      })
    },
    notifyNumberToApproveUpdate (val) {
      updateNumberToApprove(val)
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },
    // 查看详情
    canUse (record) {
      let flag = true
      if (record.relationType === 1 && record.dispatchId) flag = false
      if (record.relationType === 2 && record.waybillId) flag = false
      if (!flag) this.$message.error('错误数据,无法使用')
      return flag
    },
    handleDetail (record) {
      if (!this.canUse(record)) return
      if (record.relationType === 1) {
        const { href } = this.$router.resolve({
          name: 'WaybillDetail',
          params: { id: record.waybillId }
        })
        window.open(href, '_blank')
      } else if (record.relationType === 2) {
        let toRoute = { name: 'dispatchDetail' }
        if (record.carrierName) toRoute.name = 'shopDetail'
        if (record.dispatchId) { toRoute.params = { dispatchId: record.dispatchId } }
        const { href } = this.$router.resolve(toRoute)
        window.open(href, '_blank')
      }
    }
  }
}
