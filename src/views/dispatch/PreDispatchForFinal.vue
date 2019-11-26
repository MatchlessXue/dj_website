<template>
  <div class="page-container">
    <back-btn title="返回上一级" />
    <a-card class="card-container" :bordered="false" style="margin-top:10px;">
      <h3>基本信息</h3>
      <a-row class="dispatch-base-info">
        <a-col :lg="8" :md="12" :xs="24"
          >运输方式：{{ finalData.transporter.transportType.label }}</a-col
        >
        <a-col :lg="8" :md="12" :xs="24"> </a-col>
        <a-col :lg="8" :md="12" :xs="24"> </a-col>
        <a-col :lg="8" :md="12" :xs="24"
          >提货时间：{{ finalData.transporter.takeTime }}</a-col
        >
        <a-col :lg="8" :md="12" :xs="24"
          >送达时间：{{ finalData.transporter.deliveryTime }}</a-col
        >
      </a-row>
      <a-divider />
      <h3>{{ finalData.transporter.company ? '承运商信息' : '车辆信息' }}</h3>
      <a-row class="dispatch-base-info">
        <a-col :lg="8" :md="12" :xs="24" v-if="finalData.transporter.company"
          >承运商名称：{{ finalData.transporter.company.label }}</a-col
        >
        <a-col :lg="8" :md="12" :xs="24" v-else
          >车牌号：{{ finalData.transporter.truckNo }}</a-col
        >
        <a-col :lg="8" :md="12" :xs="24"
          >司机姓名：{{ finalData.transporter.driverName }}</a-col
        >
        <a-col :lg="8" :md="12" :xs="24"
          >司机手机号：{{ finalData.transporter.mobile }}</a-col
        >
      </a-row>
      <a-divider />
      <!-- TABLE -->
      <h3>运单信息</h3>
      <a-table
        :loading="tableLoading"
        :columns="preDispatchColumns"
        :pagination="false"
        :dataSource="finalData.preDispatchDataFinal"
        :rowKey="record => record.waybill"
      >
        <template
          v-for="(col, i) in preDispatchColumns"
          :slot="col.dataIndex"
          slot-scope="text, record, index"
        >
          <div :key="i" v-if="col.isInput">
            <!--运费等其他信息-->
            <a-input-number
              :min="0"
              placeholder="请输入"
              style="width:80px;"
              :defaultValue="text"
              @change="v => chargeChange(v, col, record, index)"
            />
          </div>
        </template>
        <!-- 合同匹配 -->
        <span slot="contractName" slot-scope="ctext" >
          {{ ctext }}
        </span>
        <!-- type=line 线路 -->
        <span
          v-if="type === 'linefinal'"
          slot="lineRoad"
          slot-scope="text, record"
        >
          {{ `${record.sdAddressName}-${record.rvAddressName}` }}
        </span>

        <div slot="summaryCharge" slot-scope="numText">
          {{ numText }}
        </div>
        <!-- 子表 -->
        <expanded-table
          slot="expandedRowRender"
          slot-scope="expandedRecord"
          :isFinal="true"
          :waybillId="expandedRecord.waybillId"
          :innerData="finalData.selectedGoodsArray"
        ></expanded-table>
      </a-table>
      <!-- TABLE OPTIONS -->

      <a-row class="dispatch-base-info">
        <a-col :lg="8" :md="12" :xs="24"
          >总件数：{{ finalData.countObj.amount }}</a-col
        >
        <a-col :lg="8" :md="12" :xs="24"
          >总载重（kg）：{{ finalData.countObj.weight }}</a-col
        >
        <a-col :lg="8" :md="12" :xs="24"
          >总载方（m³）：{{ finalData.countObj.volume }}</a-col
        >
      </a-row>
      <a-divider />
      <a-row class="dispatch-base-info">
        <a-col :lg="6" :md="12" :xs="24"
          >现付金额：<a-input style="width:80px" v-model="settlementCurrent" />
          （元）</a-col
        >
        <a-col :lg="6" :md="12" :xs="24"
          >到付金额：<a-input
            style="width:80px"
            v-model="settlementArrival"
          />（元）</a-col
        >
        <a-col :lg="6" :md="12" :xs="24"
          >月结金额：<a-input
            style="width:80px"
            v-model="settlementMonth"
          />（元）</a-col
        >
        <a-col :lg="6" :md="12" :xs="24">总费用：{{ getCountCharge }}</a-col>
      </a-row>
    </a-card>

    <!-- fixed footer toolbar -->
    <footer-tool-bar
      align="center"
      :style="{
        width:
          isSideMenu() && isDesktop()
            ? `calc(100% - ${sidebarOpened ? 256 : 80}px)`
            : '100%'
      }"
    >
      <a-button @click="cancel">取消</a-button> &nbsp;&nbsp;
      <a-button
        type="primary"
        @click="createDispatchWaybill"
        :loading="loading"
      >
        生成调度单
      </a-button>
    </footer-tool-bar>
  </div>
</template>

<script>
import { pick, cloneDeep } from 'lodash'
import ExpandedTable from './components/ExpandedTable'
import FooterToolBar from '@/components/FooterToolbar'
import BackBtn from '@/components/BackBtn'

import { createDispatchWaybill } from '@/api/dispatch/dispatch'

import { mapGetters } from 'vuex'
import { mixin, mixinDevice } from '@/utils/mixin'
import { getColumns } from './variable'

export default {
  name: 'PreDispatchForFinal',
  mixins: [mixin, mixinDevice],
  components: {
    ExpandedTable,
    FooterToolBar,
    BackBtn
  },
  data () {
    return {
      loading: false,
      tableLoading: false,
      type: this.$route.params.type,

      finalData: {},
      preDispatchColumns: [], // 表列

      settlementCurrent: 0,
      settlementArrival: 0,
      settlementMonth: 0
    }
  },
  created () {
    this.preDispatchColumns = getColumns(this.type)
    this.finalData = cloneDeep(this.getPreDispatchFinalData)
  },
  computed: {
    ...mapGetters(['getPreDispatchFinalData']),
    getCountCharge () {
      let result = 0
      this.finalData.preDispatchDataFinal.map(item => {
        let ru = item.summaryCharge ? item.summaryCharge : 0
        result += ru
      })
      return result
    }
  },
  methods: {
    // 输入费用
    chargeChange (val, column, record, index) {
      if (Number.isNaN(Number(val))) return false
      record[column.dataIndex] = Number(val)
      let obj = Object.assign(pick(record, 'yf', 'shf', 'thf', 'xhf', 'fjf'))
      let result = Object.values(obj).reduce((a, b) => {
        return a + b
      })
      this.$set(record, 'summaryCharge', result)
      console.log(this.finalData.preDispatchDataFinal)
      // 行数据合计
    },
    // 取消
    cancel () {
      this.$router.back()
    },
    // 验证
    validate () {
      let result =
        Number(this.settlementCurrent) +
        Number(this.settlementArrival) +
        Number(this.settlementMonth)
      let msg = ''
      if (result !== this.getCountCharge) {
        msg = '现付+到付+月结金额≠总费用，请重新确认！'
      }
      if (msg !== '') this.$message.error(msg)
      return msg === ''
    },
    // 遍历获取运单列表关键数据
    getWaybillArray () {
      let waybillArray = []
      this.finalData.preDispatchDataFinal.map(fd => {
        let consignmentList = []
        let surplusConsignmentList = []
        let businessList = []
        // 遍历货物
        this.finalData.selectedGoodsArray.map(gd => {
          if (gd.waybillId === fd.waybillId) {
            consignmentList.push({
              consignmentId: gd.consignmentId,
              amount: gd.storedAmount,
              volume: gd.storedAmount * gd.singleStoredVolume,
              weight: gd.storedAmount * gd.singleStoredWeight
            })
          }
        })
        // 遍历剩余货物
        this.finalData.surplusConsignment.map(sgd => {
          if (sgd.waybillId === fd.waybillId) {
            surplusConsignmentList.push({
              consignmentId: sgd.consignmentId,
              amount: sgd.storedAmount,
              volume: sgd.storedVolume,
              weight: sgd.storedWeight
            })
          }
        })
        // 费用列表
        let charges = Object.assign(pick(fd, 'yf', 'shf', 'thf', 'xhf', 'fjf'))
        Object.keys(charges).forEach(c => {
          charges[c] = charges[c] ? charges[c].toString() : null
        }) // number转string
        businessList.push(charges)
        // 最终单个运单数据对象
        let Obj = {
          departSiteId: fd.siteId,
          arrivalSiteId: fd.rvSite,
          isDirectDelivery: Number(fd.destination),
          priceUnit: fd.charging.key,
          waybillId: fd.waybillId,
          waybillCode: fd.waybillCode,
          consignmentList,
          surplusConsignmentList,
          businessList
        }
        waybillArray.push(Obj)
      })
      return waybillArray
    },
    // 生成调度单
    async createDispatchWaybill () {
      this.loading = true
      if (!this.validate()) {
        this.loading = false
        return false
      }
      let waybillArray = this.getWaybillArray()
      // 整理提交数据
      let aTime = this.finalData.transporter.deliveryTime
      let dTime = this.finalData.transporter.takeTime
      let dispatchType =
        this.type === 'goodsfinal' ? 1 : this.type === 'linefinal' ? 2 : 3
      let params = {
        dispatchType, // 类型
        settlementCurrent: this.settlementCurrent, // 先付
        settlementArrival: this.settlementArrival, // 到付
        settlementMonth: this.settlementMonth, // 月结
        remark: this.finalData.remark, // 备注
        lineList: this.finalData.lineList, // 线路
        transportType: Number(this.finalData.transporter.transportType.key), // 整车零担
        arrivalTime: aTime, // 送达时间
        departTime: dTime,
        driverName: this.finalData.transporter.driverName,
        mobile: this.finalData.transporter.mobile,
        waybillList: waybillArray
      }
      // 公司 or 司机
      if (this.finalData.transporter.company) {
        params.carrierId = this.finalData.transporter.company.key
        params.carrierName = this.finalData.transporter.company.label
      } else {
        params.plateNumber = this.finalData.transporter.truckNo
        params.truckType = this.finalData.transporter.truckType
        params.volumeLoad = Number(this.finalData.transporter.volumeLoad)
        params.weightLoad = Number(this.finalData.transporter.weightLoad)
        params.truckLength = Number(this.finalData.transporter.truckLength)
      }
      let res = await createDispatchWaybill(params)
      this.loading = false
      if (res.code === 0) {
        this.$message.success('操作成功')
        this.$router.push({ name: 'DispatchList' })
      } else {
        this.$message.error('操作失败')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.dispatch-base-info {
  line-height: 4;
}
.table-page-option-wrapper.dispatch {
  text-align: right;
  margin-top: 10px;
  .ant-btn {
    margin: 0 8px;
  }
  .ant-divider {
    margin: 10px;
  }
}
</style>
