<template>
  <div class="form-layout-body">
    <back-btn title="返回上一级" :callbackFn="returnToDispatchListCallback"/>
    <a-form  class="form">
      <a-card class="card" title="基础信息" :bordered="false">
        <a-row class="form-row" :gutter="16">
          <a-col :xl="6" :lg="6" :md="12" :sm="24">
            <a-form-item
              label="调度单号"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >{{detail.dispatchCode}}</a-form-item>
          </a-col>
          <a-col :xl="6" :lg="6" :md="12" :sm="24">
            <a-form-item
              label="运输方式"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >{{getTransportTypeDesc(detail.transportType)}}</a-form-item>
          </a-col>
          <a-col :xl="6" :lg="6" :md="12" :sm="24">
            <a-form-item
              label="状态"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >{{getDispatchStatusDesc(detail.bizStatus)}}</a-form-item>
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="16">
          <a-col :xl="6" :lg="6" :md="12" :sm="24">
            <a-form-item
              label="提货时间"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >{{detail.pickupTime}}</a-form-item>
          </a-col>
          <a-col :xl="6" :lg="6" :md="12" :sm="24">
            <a-form-item
              label="送达时间"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >{{detail.arrivalTime}}</a-form-item>
          </a-col>
          <a-col :xl="6" :lg="6" :md="12" :sm="24">
            <a-form-item
              label="计费方式"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >{{getCostType(detail.equalizationMethod)}}</a-form-item>
          </a-col>
          <a-col :xl="{span: 5, offset: 1}" :lg="6" :md="12" :sm="24">
            <a-form-item
              label="单价"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >{{detail.unitPrice}}</a-form-item>
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="16">
          <a-col :xl="6" :lg="6" :md="12" :sm="24">
            <a-form-item
              label="现付金额"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >{{detail.settlementCurrent}}</a-form-item>
          </a-col>
          <a-col :xl="6" :lg="6" :md="12" :sm="24">
            <a-form-item
              label="到付金额"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >{{detail.settlementArrival}}</a-form-item>
          </a-col>
          <a-col :xl="6" :lg="6" :md="12" :sm="24">
            <a-form-item
              label="月结金额"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >{{detail.settlementMonth}}</a-form-item>
          </a-col>
        </a-row>
      </a-card>

      <a-card v-if="!!detail.carrierId" class="card" title="承运商信息" :bordered="false">
        <a-row class="form-row" :gutter="16">
          <a-col :xl="8" :lg="8" :md="12" :sm="24">
            <a-form-item
              label="承运商名称"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >{{detail.carrierName}}</a-form-item>
          </a-col>
          <a-col :xl="8" :lg="8" :md="12" :sm="24">
            <a-form-item
              label="司机姓名"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >{{detail.driverName}}</a-form-item>
          </a-col>

          <a-col :xl="8" :lg="8" :md="12" :sm="24">
            <a-form-item
              label="司机手机号"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >{{detail.mobile}}</a-form-item>
          </a-col>
        </a-row>
      </a-card>

      <a-card v-if="!!detail.plateNumber" class="card" title="车辆信息" :bordered="false">
        <a-row class="form-row" :gutter="16">
          <a-col :xl="4" :lg="4" :md="12" :sm="24">
            <a-form-item
              label="车牌号"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >{{detail.plateNumber}}</a-form-item>
          </a-col>
          <a-col :xl="4" :lg="4" :md="12" :sm="24">
            <a-form-item
              label="车辆类型"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >{{detail.truckType}}</a-form-item>
          </a-col>
          <a-col :xl="4" :lg="4" :md="12" :sm="24">
            <a-form-item
              label="司机姓名"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >{{detail.driverName}}</a-form-item>
          </a-col>
          <a-col :xl="4" :lg="4" :md="12" :sm="24">
            <a-form-item
              label="司机手机号"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >{{detail.mobile}}</a-form-item>
          </a-col>
          <a-col :xl="4" :lg="4" :md="12" :sm="24">
            <a-form-item
              label="重量配载率"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >重量配载率</a-form-item>
          </a-col>
          <a-col :xl="4" :lg="4" :md="12" :sm="24">
            <a-form-item
              label="体积配置率"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >体积配置率</a-form-item>
          </a-col>
        </a-row>
      </a-card>

      <a-card class="card" title="运单信息" :bordered="true">
        <a-table ref="table" size="default" :columns="columns" :dataSource="detail.waybills" bordered>
<!--          <span slot="arrivalAddress">{{getSiteName(order)}}</span>-->
        </a-table>
      </a-card>

      <a-card class="card" title="货物信息" :bordered="false">
        <a-row class="form-row" :gutter="16">
          <a-col :xl="8" :lg="8" :md="12" :sm="24">
            <a-form-item
              label="总件数"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >{{detail.totalAmount}}</a-form-item>
          </a-col>
          <a-col :xl="8" :lg="8" :md="12" :sm="24">
            <a-form-item
              label="总载重(kg)"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >{{detail.totalWeight}}</a-form-item>
          </a-col>
          <a-col :xl="8" :lg="8" :md="12" :sm="24">
            <a-form-item
              label="总载方(m³)"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >{{detail.totalVolume}}</a-form-item>
          </a-col>
        </a-row>
      </a-card>
    </a-form>
  </div>
</template>

<script>
import BackBtn from '@/components/BackBtn'
import dictionaryBase from '@/views/dispatch/DispatchList/mixins/dictionary_base'
import dispatchComputeBase from '@/views/dispatch/DispatchList/mixins/dispatch_compute'

export default {
  name: 'DispatchDetail',
  components: {
    BackBtn
  },
  mixins: [dictionaryBase, dispatchComputeBase],
  data () {
    const { dispatchDetail, queryParam } = this.$route.params
    return {
      // 调度单详情
      dispatchDetail,
      queryParam,
      detail: JSON.parse(dispatchDetail),
      loading: false,
      labelCol: { span: 8 },
      wrapperCol: { span: 12, offset: 1 },
      // 表头
      columns: [
        {
          title: '运单号',
          dataIndex: 'waybillCode'/*,
          scopedSlots: { customRender: 'waybillCode' } */
        },
        {
          title: '发货方地址',
          dataIndex: 'departAddress'
        },
        {
          title: '收货方地址',
          dataIndex: 'arrivalAddress',
          scopedSlots: { customRender: 'arrivalAddress' }
        },
        {
          title: '合计费用',
          dataIndex: 'sumfee',
          customRender: function (text, record, index) {
            console.log('record', record)
            return (record.yf || 0) + (record.thf || 0) + (record.shf || 0) + (record.xhf || 0) + (record.fjf || 0)
          }
        }
      ]
    }
  },
  created () {
  },
  watch: {
    dispatchDetail (val) {
      this.detail = JSON.parse(val)
    }
  },
  computed: {},
  methods: {
    returnToDispatchListCallback () {
      console.log('queryParm', this.queryParam)
      this.$router.push({ name: 'DispatchList', params: { queryParamFromDetail: this.queryParam } })
    },
    getSiteName (order) {
      let find = this.sites.find(item => item.siteId === order.station)
      if (find) return find.siteName
      return order.arrivalAddress
    }
  }
}
</script>

<style lang="less">
</style>
