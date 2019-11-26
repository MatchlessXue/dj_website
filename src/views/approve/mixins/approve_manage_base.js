import {
  getApproveSetupItemList,
  toggleBizStatus,
  setOperator
} from '@/api/approve/manage'
import {
  approveBase
} from './approve_base'
import listData from '@views/approve/mockData/approveManage'
export const approveManageBase = {
  mixins: [approveBase],
  data () {
    return {
      resData: this.deepClone2(listData)
    }
  },
  methods: {
    setOperator (params, isIndependent) {
      console.log('setOperator (params515', params)
      if (isIndependent) {
        this.resData.data.records.forEach(r => {
          if (r.modelId === params.modelId) {
            this.processOperatorObj(r, params)
            console.log('setOperator (params515', r)
          }
        })
        return new Promise((resolve, reject) => {
          resolve(this.resData)
        }).then(res => {
          return res
        })
      } else {
        return setOperator(params).then(res => {
          console.log('setOperator>res515,params', res, params)
          return res
        })
      }
    },
    processOperatorObj (operator, params) {
      if (params.relateType === 1) {
        operator.approveUserId = params.userId
        operator.approveUserName = params.userName
      } else {
        operator.ccUserId = params.userId
        operator.ccUserName = params.userName
      }
    },
    toggleBizStatus (params, isIndependent) {
      console.log('toggleBizStatus (params515', params)
      if (isIndependent) {
        this.resData.data.records.forEach(r => {
          if (r.modelId === params.modelId) {
            r.bizStatus = r.bizStatus === 100 ? 101 : 100
          }
        })
        return new Promise((resolve, reject) => {
          resolve(this.resData)
        }).then(res => {
          return res
        })
      } else {
        return toggleBizStatus(params).then(res => {
          console.log('toggleBizStatus>res515', res)
          return res
        })
      }
    },
    getApproveSetupItemList (params, isIndependent) {
      console.log('getApproveSetupItemList (params515', params)
      if (isIndependent) {
        this.resData = this.deepClone2(listData)
        return new Promise((resolve, reject) => {
          resolve(this.resData)
        }).then(res => {
          console.log('listData515', this.resData)
          params.approveTypeId &&
            (res.data.records = res.data.records.filter(
              r => r.approveTypeId === params.approveTypeId
            ))
          return res.data
        })
      } else {
        return getApproveSetupItemList(params).then(res => {
          console.log('getApproveSetupItemList>res515', res)
          return res.data
        })
      }
    },
    deepClone2 (obj) {
      return JSON.parse(JSON.stringify(obj))
    }
  }
}
