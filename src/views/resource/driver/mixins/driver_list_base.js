/**
 * 用于车辆下拉选择的数据与行为的混入
 */
import { queryAllTrucks } from '@/api/resource/truck'

const driverListBase = {
  data () {
    return {
      allTrucks: [],
      selectedDriver: {}
    }
  },
  watch: {
    // selectedDriver: {
    //   deep: true,
    //   handler: function (val) {
    //     console.log('watch-val', val)
    //     this.$nextTick(() => {
    //       this.form.setFieldsValue(val)
    //     })
    //   }
    // }
  },
  beforeMount () {
    this.fetchData(this, {}, function (context, res) { context.allTrucks = res.data })
  },
  methods: {
    fetchData (context, params, callback) {
      queryAllTrucks(params).then(res => {
        console.log('res', res)
        callback(context, res)
      })
    },
    handleDriverNameSearch (driver, value, option) {
      // console.log('handleMobileSearch (driver, value, option) ', driver, value, option)
      this.$set(driver, 'plateNumber', value)
    },
    handleDriverNameChange (driver, value, option) {
      console.log('handleDriverNameChange (driver, value, option) ', driver, value, option)
      try {
        this.selectedDriver = JSON.parse(value)
        // console.log('this.selectedDriver515', this.selectedDriver)
        this.selectedDriver.plateNumber && this.updateDriver(driver, this.selectedDriver)
      } catch (err) {
        console.log(err)
        this.updateDriver(driver, {
          truckId: undefined,
          driverId: undefined,
          ascriptionName: undefined,
          truckLengthName: undefined,
          truckTypeName: undefined,
          plateNumber: value
        })
      }
      // console.log('this.driverList515', this.driverList)
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    updateDriver (driver, selectedDriver) {
      const { truckId, driverId, plateNumber, ascriptionName, truckLengthName, truckTypeName } = selectedDriver
      this.$set(driver, 'truckId', truckId)
      this.$set(driver, 'driverId', driverId)
      this.$set(driver, 'plateNumber', plateNumber)
      this.$set(driver, 'ascriptionName', ascriptionName)
      this.$set(driver, 'truckLengthName', truckLengthName)
      this.$set(driver, 'truckTypeName', truckTypeName)
    }
  }
}

export default driverListBase
