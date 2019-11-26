import { getApproveList, getApproveFlowList, approvePassOrReject } from '@/api/approve/list'
import listData from '@views/approve/mockData/approveList'
import approveFlowList from '@views/approve/mockData/approveFlowList'
import {
  approveBase
} from './approve_base'
export const approveListBase = {
  mixins: [approveBase],
  data () {
    return {
      resData: this.deepClone2(listData),
      approveFlowList: this.deepClone2(approveFlowList)
    }
  },
  methods: {
    getPartMockResponseData (operaType) {
      if (operaType === 1) {
        return { approveStatus: 3, approveStatusName: '审批通过' }
      } else {
        return { approveStatus: 2, approveStatusName: '审批驳回' }
      }
    },
    approvePassOrReject (params, isIndependent) {
      console.log('approvePassOrReject (params515', params)
      if (isIndependent) {
        this.resData.data.records.forEach(r => {
          if (r.approveId === params.approveId) {
            r.approveSuggest = params.approveSuggest
            const newData = this.getPartMockResponseData(params.operaType)
            r.approveStatus = newData.approveStatus
            r.approveStatusName = newData.approveStatusName
            console.log('approvePassOrReject (params515', r)
          }
        })
        return new Promise((resolve, reject) => {
          resolve(this.resData)
        }).then(res => {
          return res
        })
      } else {
        return approvePassOrReject(params).then(res => {
          console.log('approvePassOrReject>res515,params', res, params)
          return res
        })
      }
    },
    getApproveFlowList (params, isIndependent) {
      console.log('getApproveFlowList (params515', params)
      if (isIndependent) {
        this.approveFlowList = this.deepClone2(approveFlowList)
        return new Promise((resolve, reject) => {
          resolve(this.approveFlowList)
        }).then(res => {
          console.log('listData515', res.data)
          return res.data
        })
      } else {
        return getApproveFlowList(params).then(res => {
          console.log('getApproveFlowList>res515', res)
          return res.data
        })
      }
    },
    getApproveList (params, isIndependent) {
      console.log('getApproveList (params515', params)
      if (isIndependent) {
        this.resData = this.deepClone2(listData)
        return new Promise((resolve, reject) => {
          resolve(this.resData)
        }).then(res => {
          params.approveTypeId &&
            (res.data.records = res.data.records.filter(
              r => r.approveTypeId === params.approveTypeId
            ))
          if (params.tabType === 1) {
            res.data.records = res.data.records.filter(
              r => r.approveStatus === 1
            )
          } else if (params.tabType === 3) {
            res.data.records = res.data.records.filter(
              r => r.approveStatus !== 1
            )
          }
          res.data.total = res.data.records.length

          console.log('listData515', res.data)
          return res.data
        })
      } else {
        return getApproveList(params).then(res => {
          console.log('getApproveList>res515', res)
          return res.data
        })
      }
    },
    deepClone2 (obj) {
      return JSON.parse(JSON.stringify(obj))
    }
  }
}
