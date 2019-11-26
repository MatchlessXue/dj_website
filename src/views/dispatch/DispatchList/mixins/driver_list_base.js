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
    selectedDriver: {
      deep: true,
      handler: function (val) {
        console.log('watch-val', val)
        this.$nextTick(() => {
          this.form.setFieldsValue(val)
        })
      }
    }
  },
  beforeMount () {
    this.fetchData(this, {}, (context, res) => context.allDrivers = res.data)
  },
  methods: {
    fetchData (context, params, callback) {
      getAllDrivers(params).then(res => {
        console.log('res', res)
        callback(context, res)
      })
    },
    handleDriverNameSearch (value, option) {
      console.log('handleSearch (value, option) ', value, option)
      try {
        this.selectedDriver = JSON.parse(value)
      } catch (err) {
        // console.log('handleDriverNameSearch->err', err)
        this.form.setFieldsValue({
          driverName: value,
          driverId: ''
        })
      }
    },
    handleMobileSearch (value, option) {
      console.log('handleSearch (value, option) ', value, option)
      try {
        this.selectedDriver = JSON.parse(value)
      } catch (err) {
        this.form.setFieldsValue({
          mobile: value,
          driverId: ''
        })
      }
    },
    handleDriverNameChange (value, option) {
      console.log('handleDriverNameChange (value, option) ', value, option)
      try {
        this.selectedDriver = JSON.parse(value)
      } catch (err) {
        this.selectedDriver = {
          driverName: value
        }
        console.log('handleDriverNameChange->selectedDriver', this.selectedDriver)
      }
      this.form.setFieldsValue(this.selectedDriver)
    },
    handleMobileChange (value, option) {
      console.log('handleMobileChange (value, option) ', value, option)
      try {
        this.selectedDriver = JSON.parse(value)
      } catch (err) {
        this.selectedDriver = {
          mobile: value
        }
        console.log('handleMobileChange->selectedDriver', this.selectedDriver)
      }
      this.form.setFieldsValue(this.selectedDriver)
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    }
  }
}

export default driverListBase
