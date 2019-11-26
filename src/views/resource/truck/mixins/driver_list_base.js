/**
 * 用于司机下拉选择的数据与行为的混入
 */
import { getAllDrivers } from '@/api/resource/driver'
const driverListBase = {
  data () {
    return {
      allDrivers: [],
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
    this.fetchData(this, {}, function (context, res) { context.allDrivers = res.data })
  },
  methods: {
    fetchData (context, params, callback) {
      getAllDrivers(params).then(res => {
        // console.log('res', res)
        callback(context, res)
      })
    },
    handleDriverNameSearch (driver, value, option) {
      // console.log('handleMobileSearch (driver, value, option) ', driver, value, option)
      this.$set(driver, 'driverName', value)
    },
    handleDriverNameChange (driver, value, option) {
      // console.log('handleDriverNameChange (driver, value, option) ', driver, value, option)
      try {
        this.selectedDriver = JSON.parse(value)
        this.updateDriver(driver, this.selectedDriver)
      } catch (err) {
        this.updateDriver(driver, {
          truckId: undefined,
          driverId: undefined,
          mobile: undefined,
          driverName: value
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
      const { truckId, driverId, driverName, mobile, driverLicense, driverRankName } = selectedDriver
      this.$set(driver, 'truckId', truckId)
      this.$set(driver, 'driverId', driverId)
      this.$set(driver, 'driverName', driverName)
      this.$set(driver, 'mobile', mobile)
      this.$set(driver, 'driverLicense', driverLicense)
      this.$set(driver, 'driverRankName', driverRankName)
    }
  }
}

export default driverListBase
