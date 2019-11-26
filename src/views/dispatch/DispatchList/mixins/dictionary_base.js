/**
 * 用于根据字典code或id获取名称行为的混入
 */

const dictionaryBase = {
  data () {
    return {
    }
  },
  methods: {
    getTransportTypeDesc (code) { // 获取运输类型名称
      switch (code) {
        case 1:
          return '零担'
        case 2:
          return '整车'
        default:
          return ''
      }
    },

    getDispatchStatusDesc (code) {
      switch (code) {
        case 1:
          return '待提货'
        case 2:
          return '运输中'
        case 3:
          return '已送达'
        default:
          return ''
      }
    },
    getBillingModeDesc (code) {
      switch (code) {
        case 3:
          return '体积（m³）'
        case 2:
          return '重量（kg）'
        case 1:
          return '件数'
        default:
          return ''
      }
    },
    getCostType (code) {
      switch (code) {
        case 1:
          return '按运单数'
        case 2:
          return '按件数'
        case 3:
          return '按重量'
        case 4:
          return '按体积'
        default:
          return ''
      }
    }
  }
}

export default dictionaryBase
