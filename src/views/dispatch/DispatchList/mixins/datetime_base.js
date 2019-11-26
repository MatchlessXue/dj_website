/**
 * 用于开始时间与结束时间套件的数据与行为的混入
 */
// import moment from 'moment'
const datetimeBase = {
  data () {
    return {
      startValue: null,
      endValue: null,
      dispatchValue: null,
      consignValue: null
    }
  },
  watch: {
    startValue (val) {
      // console.log('startValue', val)
      this.startValue = val
    },
    endValue (val) {
      // console.log('endValue', val)
      this.endValue = val
    },
    dispatchValue (val) {
      this.dispatchValue = val
    },
    consignValue (val) {
      this.consignValue = val
    }
  },
  methods: {
    onDepartDateChange (value, dateString) {
      // console.log('Selected Time: ', value)
      // console.log('Formatted Selected Time: ', dateString)
      this.startValue = value
    },
    onDuDateChange (value, dateString) {
      this.dispatchValue = value
    },
    onArrivalDateChange (value, dateString) {
      // console.log('Selected Time: ', value)
      // console.log('Formatted Selected Time: ', dateString)
      this.endValue = value
    },
    handleDateTimeConditions () {
      if (this.startValue && this.startValue.length) {
        this.queryParam.pickupTime = this.startValue[0].format('YYYY-MM-DD') + ' 00:00:00'
        this.queryParam.pickupTime2 = this.startValue[1].format('YYYY-MM-DD') + ' 23:59:59'
      } else {
        this.queryParam.pickupTime = ''
        this.queryParam.pickupTime2 = ''
      }
      if (this.endValue && this.endValue.length) {
        this.queryParam.arrivalTime = this.endValue[0].format('YYYY-MM-DD') + ' 00:00:00'
        this.queryParam.arrivalTime2 = this.endValue[1].format('YYYY-MM-DD') + ' 23:59:59'
      } else {
        this.queryParam.arrivalTime = ''
        this.queryParam.arrivalTime2 = ''
      }
      if (this.dispatchValue && this.dispatchValue.length) {
        this.queryParam.createDate = this.dispatchValue[0].format('YYYY-MM-DD') + ' 00:00:00'
        this.queryParam.createDate2 = this.dispatchValue[1].format('YYYY-MM-DD') + ' 23:59:59'
      } else {
        this.queryParam.createDate = ''
        this.queryParam.createDate2 = ''
      }
      if (this.consignValue && this.consignValue.length) {
        this.queryParam.consignDate = this.consignValue[0].format('YYYY-MM-DD') + ' 00:00:00'
        this.queryParam.consignDate2 = this.consignValue[1].format('YYYY-MM-DD') + ' 23:59:59'
      } else {
        this.queryParam.consignDate = ''
        this.queryParam.consignDate2 = ''
      }
    }
  }
}

export default datetimeBase
