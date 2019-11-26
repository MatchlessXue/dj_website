<template>
  <div>
    <a-form v-for="(driver, driverIndex) in driverList" :key="driver.driverId" class="form">
      <a-input v-model="driver.driverId" v-show="false"></a-input>
      <a-input v-model="driver.truckId" v-show="false"></a-input>
      <a-row :gutter="16">
        <a-col :xs="24" :sm="24" :md="5" :lg="5" :xl="5">
          <a-form-item
            label="司机姓名" >
            <a-auto-complete
              @search="handleDriverNameSearch(driver, $event)"
              @change="handleDriverNameChange(driver, $event)"
              placeholder="请输入司机姓名"
              v-model="driver.driverName"
              :filterOption="true">
              <template slot="dataSource">
                <a-select-option v-for="d in allDrivers"  :key="JSON.stringify(d)">
                  <!--{{d.driverName}}-{{d.mobile}}-->
                  <a-row>
                    <a-col :xs="12" :md="12" :lg="12" :xl="12">{{d.driverName}}</a-col>
                    <a-col :xs="12" :md="12" :lg="12" :xl="12">{{d.mobile}}</a-col>
                  </a-row>
                </a-select-option>
              </template>
            </a-auto-complete>
          </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="24" :md="5" :lg="5" :xl="5">
          <a-form-item label="司机手机号">
            <a-auto-complete placeholder="" v-model="driver.mobile" :disabled="true" :filterOption="true"></a-auto-complete>
          </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="24" :md="5" :lg="5" :xl="5">
          <a-form-item label="驾驶证号">
            <a-auto-complete placeholder="" v-model="driver.driverLicense" :disabled="true" :filterOption="true"></a-auto-complete>
          </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="24" :md="5" :lg="5" :xl="5">
          <a-form-item label="准驾车型">
            <a-auto-complete placeholder="" v-model="driver.driverRankName" :disabled="true" :filterOption="true"></a-auto-complete>
          </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="24" :md="4" :lg="4" :xl="4">
          <a-form-item style="margin-top: 43px">
            <span class="driverInfoDelete" v-show="driverIndex !== 0"
                  @click="handleDriverInfoDelete(driver, driverIndex)"><a-icon type="minus-circle" :style="{ fontSize: '26px' }"/></span>
            <span class="driverInfoAdd"
                  @click="handleDriverInfoAdd(driver, driverIndex)" ><a-icon type="plus-circle" :style="{ fontSize: '26px' }"/></span>
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
          driverName: undefined,
          mobile: undefined,
          driverLicense: undefined,
          driverRankName: undefined
        }]
      }
    }
  },
  data () {
    return {
      driverList: this.driversFromParent
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
              const { truckId, driverId, driverName, mobile, driverLicense, driverRankName } = driver
              this.driverList.push({ truckId, driverId, driverName, mobile, driverLicense, driverRankName })
            })
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
        driverName: undefined,
        mobile: undefined,
        driverLicense: undefined,
        driverRankName: undefined
      })
    },
    getCurrentDriverList () {
      return this.driverList.filter(driver => driver.driverId !== undefined)
    }
  }
}
</script>

<style scoped>
  .driverInfoDelete,.driverInfoAdd {
    width: 23px;
    height: 23px;
    fontSize: 26px;
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
