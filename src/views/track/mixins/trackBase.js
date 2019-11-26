import { mapGetters } from 'vuex'
import { getFeeList } from '@/api/libraries.js'
import { getSpecialFeeOrClaimProcessStatus } from '@/api/track/track.js'
const trackBase = {
  data () {
    return {
      specialFeeOrClaimProcessStatusList: [],
      expenses: []
    }
  },
  computed: {
    ...mapGetters(['tenantId'])
  },
  methods: {
    loadSpecialFeeOrClaimProcessStatus () {
      return getSpecialFeeOrClaimProcessStatus().then(res => {
        console.log('getSpecialFeeOrClaimProcessStatus>res', res.data)
        res.data && res.data.length && res.data.forEach(item => {
          this.specialFeeOrClaimProcessStatusList.push({
            text: item.name,
            value: `${item.type}`
          })
        })
        console.log('getSpecialFeeOrClaimProcessStatus>specialFeeOrClaimProcessStatusList', this.specialFeeOrClaimProcessStatusList)
      })
    },
    getSettlementObjectDesc (settlementObj) {
      if (settlementObj.dispatchCode) {
        return `${settlementObj.settleName} | ${settlementObj.dispatchCode}`
      } else {
        return `${settlementObj.settleName}`
      }
    },
    getSettlementObjectId (settlementObj) {
      return JSON.stringify(settlementObj)
    },
    initFeeTypeList (getExpenseTypePartParams) {
      if (!getExpenseTypePartParams) {
        return
      }

      const expenseTypePartParam = getExpenseTypePartParams()

      if (expenseTypePartParam.expenseType) {
        return getFeeList({
          notToList: [1, 4, 5, 6],
          tenantId: this.tenantId,
          ...expenseTypePartParam
        }).then(res => {
          this.expenses = res.data.map(v => {
            return {
              name: v.expenseSelfName,
              id: v.tanantNumberId
            }
          })
        })
      }

      return new Promise((resolve, reject) => {
        return resolve(this.expenses)
      })
    }
  }
}

export default trackBase
