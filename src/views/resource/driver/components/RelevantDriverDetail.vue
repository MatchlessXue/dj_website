<template>
  <div>
    <a-form v-for="driver in driverList" :key="driver.driverId" class="form">
      <a-input v-model="driver.driverId" v-show="false"></a-input>
      <a-input v-model="driver.truckId" v-show="false"></a-input>
      <a-row :gutter="16">
        <a-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
          <a-form-item label="车牌号" :labelCol="labelCol" :wrapperCol="wrapperCol">
            {{ driver.plateNumber }}
          </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
          <a-form-item label="车辆归属" :labelCol="labelCol" :wrapperCol="wrapperCol">
            {{ driver.ascriptionName }}
          </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
          <a-form-item label="车长" :labelCol="labelCol" :wrapperCol="wrapperCol">
            {{ driver.truckLengthName }}
          </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="24" :md="6" :lg="6" :xl="6">
          <a-form-item label="车辆类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
            {{ driver.truckTypeName }}
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </div>
</template>

<script>
import driverListBase from '../mixins/driver_list_base'
export default {
  name: 'RelevantDriverForm',
  mixins: [driverListBase],
  props: {
    driversFromParent: {
      type: Array,
      default () {
        return [{
          truckId: undefined,
          driverId: undefined,
          plateNumber: undefined,
          ascriptionName: undefined,
          truckLengthName: undefined,
          truckTypeName: undefined
        }]
      }
    }
  },
  data () {
    return {
      driverList: this.driversFromParent,
      labelCol: { span: 8 },
      wrapperCol: { span: 12, offset: 1 }
    }
  },
  watch: {
    driversFromParent: {
      deep: true,
      handler: function (val) {
        // console.log('driversFromParent》watch-val', val)
        this.$nextTick(() => {
          if (val && val.length > 0) {
            this.driverList = []
            val.forEach(driver => {
              const { truckId, driverId, plateNumber, ascriptionName, truckLengthName, truckTypeName } = driver
              this.driverList.push({ truckId, driverId, plateNumber, ascriptionName, truckLengthName, truckTypeName })
            })
            // console.log(this.driverList)
          }
        })
      }
    }
  },
  created () {
    // console.log('this.driversFromParent', this.driversFromParent)
  },
  methods: {
    handleDriverInfoDelete (driver, driverIndex) {
      this.driverList.splice(driverIndex, 1)
    },
    handleDriverInfoAdd (driver, driverIndex) {
      if (!driver.driverId) {
        this.$message.warning('请先选择司机！')
        return
      }
      this.driverList.push({
        truckId: undefined,
        driverId: undefined,
        plateNumber: undefined,
        ascriptionName: undefined,
        truckLengthName: undefined,
        truckTypeName: undefined
      })
    },
    getCurrentDriverList () {
      return this.driverList.filter(driver => driver.truckId !== undefined)
    }
  }
}
</script>

<style lang="less" scoped>
  .driverInfoDelete,.driverInfoAdd {
    width: 23px;
    height: 23px;
    font-size: 26px;
    cursor: pointer;
  }

  .driverInfoDelete {
    color: #FF3535;
    margin-right: 5px;
  }

  .driverInfoAdd {
    color: #2797FF;
  }

</style>
