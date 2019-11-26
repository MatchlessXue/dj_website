/**
 * 用于调度单计算行为的混入
 */

const dispatchComputeBase = {
  data () {
    return {}
  },
  methods: {
    getVolumePercent (record) {
      if (record.plateNumber) {
        let consignmentVolumeSum = 0
        record.dispatchedConsignmentList.forEach(consignment => {
          consignmentVolumeSum += (consignment.orderVolume || 0)
        })
        let percentage = ((record.volumeLoad && (consignmentVolumeSum / record.volumeLoad)) || 0) * 100
        return percentage.toFixed(2) + '%'
      } else {
        return ''
      }
    },
    getWeightPercent (record) {
      if (record.plateNumber) {
        let consignmentWeightSum = 0
        record.dispatchedConsignmentList.forEach(consignment => {
          consignmentWeightSum += (consignment.orderWeight || 0)
        })
        let percentage = ((record.weightLoad && (consignmentWeightSum / record.weightLoad)) || 0) * 100
        return percentage.toFixed(2) + '%'
      } else {
        return ''
      }
    }
  }
}

export default dispatchComputeBase
