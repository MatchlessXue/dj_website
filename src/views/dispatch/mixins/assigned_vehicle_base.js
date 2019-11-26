import { TENANT_ID } from '@/store/mutation-types'
import { getFeeList } from '@/api/libraries.js'
const assignedVehicleBase = {
  data () {
    return {
      // 动态要显示的费用值
      allValues: []
    }
  },
  methods: {
    loadFeeList (params) {
      const fParams = Object.assign({
        tenantId: this.$ls.get(TENANT_ID),
        notToList: [4, 5, 6],
        isClear: false
      }, params)
      if (fParams.typePartId) {
        getFeeList(fParams).then(res => {
          console.log('查看费用515', res)
          if (res.data && res.data.length) {
            this.computeTotalArr = []
            res.data.forEach(item => {
              item.subDictId = item.tanantNumberId
              item.subDictName = item.expenseSelfName
              let modelKey = 'key_' + item.subDictId // 用于动态绑定交互的字段
              this.computeTotalArr.push(modelKey)
              item.value = '' // 用于交互值
              item.modelKey = modelKey
            })
          }
          this.allValues = res.data
          // this.createSelectedRows()
          return this.allValues
        }).then(res => {
          this.createSelectedRows()
          if (this.dispatchId) {
            this.editSelectedRows(this.currentDispatch.waybills, params.isClear)
          }
        })
      }
    }
  }
}

export default assignedVehicleBase
