<template>
  <div>
    <a-form v-for="(truck, driverIndex) in driverList" :key="truck.truckId" class="form">
      <a-input v-model="truck.driverId" v-show="false"></a-input>
      <a-input v-model="truck.truckId" v-show="false"></a-input>
      <a-row :gutter="16">
        <a-col :xs="24" :sm="24" :md="5" :lg="5" :xl="5">
          <a-form-item
            label="车牌号" >
            <a-auto-complete
              @search="handleDriverNameSearch(truck, $event)"
              @change="handleDriverNameChange(truck, $event)"
              placeholder="请输入车牌号"
              v-model="truck.plateNumber"
              :filterOption="true">
              <template slot="dataSource">
                <a-select-option v-for="d in allTrucks"  :key="JSON.stringify(d)">
                  <!--{{d.driverName}}-{{d.mobile}}-->
                  <a-row>
                    <a-col :xs="12" :md="12" :lg="12" :xl="12">{{d.plateNumber}}</a-col>
                    <!-- <a-col :xs="12" :md="12" :lg="12" :xl="12">{{d.mobile}}</a-col> -->
                  </a-row>
                </a-select-option>
              </template>
            </a-auto-complete>
          </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="24" :md="5" :lg="5" :xl="5">
          <a-form-item label="车辆归属">
            <a-auto-complete placeholder="" v-model="truck.ascriptionName" :disabled="true" :filterOption="true"></a-auto-complete>
          </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="24" :md="5" :lg="5" :xl="5">
          <a-form-item label="车长">
            <a-auto-complete placeholder="" v-model="truck.truckLengthName" :disabled="true" :filterOption="true"></a-auto-complete>
          </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="24" :md="5" :lg="5" :xl="5">
          <a-form-item label="车辆类型">
            <a-auto-complete placeholder="" v-model="truck.truckTypeName" :disabled="true" :filterOption="true"></a-auto-complete>
          </a-form-item>
        </a-col>
        <a-col :xs="24" :sm="24" :md="4" :lg="4" :xl="4">
          <a-form-item style="margin-top: 43px">
            <span class="driverInfoDelete" v-show="driverIndex !== 0"
                  @click="handleDriverInfoDelete(truck, driverIndex)"><a-icon type="minus-circle" :style="{ fontSize: '26px' }"/></span>
            <span class="driverInfoAdd"
                  @click="handleDriverInfoAdd(truck, driverIndex)" ><a-icon type="plus-circle" :style="{ fontSize: '26px' }"/></span>
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
          ascriptionName: undefined,
          truckLengthName: undefined,
          truckTypeName: undefined,
          plateNumber: undefined
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
            val.forEach(truck => {
              const { truckId, driverId, plateNumber, ascriptionName, truckLengthName, truckTypeName } = truck
              this.driverList.push({ truckId, driverId, plateNumber, ascriptionName, truckLengthName, truckTypeName })
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
    handleDriverInfoDelete (truck, driverIndex) {
      this.driverList.splice(driverIndex, 1)
    },
    handleDriverInfoAdd (truck, driverIndex) {
      if (!truck.truckId) {
        this.$message.warning('请先选择车辆！')
        return
      }
      this.driverList.push({
        truckId: undefined,
        driverId: undefined,
        ascriptionName: undefined,
        truckLengthName: undefined,
        truckTypeName: undefined,
        plateNumber: undefined
      })
    },
    getCurrentDriverList () {
      return this.driverList.filter(truck => truck.truckId !== undefined)
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
