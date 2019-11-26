<template>
  <div class="new_antd wa_waybill_edit">
    <BackBtn />
    <a-card class="card"
      title="基础信息"
      :bordered="false"
    >
      <orderbaseinfo
        ref='baseinfo'
        @showpartnerid="showpartnerid"
        @showprojectid="showprojectid"
        :info="backInfo"
      ></orderbaseinfo>
    </a-card>
    <a-row :gutter="10">
      <a-col :xs="12">
        <a-card title="发货方信息" :bordered="false" >
          <sendgoodinfo
            ref="sendinfo"
            :clientid="currentSelectPartnerId"
            :info="backInfo"
          ></sendgoodinfo>
        </a-card>
      </a-col>
      <a-col :xs="12" class="card2_col">
        <a-card
          title="收货方信息"
          :bordered="false">
          <getgoodinfo
            ref="getinfo"
            :clientid="currentSelectPartnerId"
            :info="backInfo"
          ></getgoodinfo>
        </a-card>
      </a-col>
    </a-row>
    <GoodsListModal
      ref="goodsinfo"
      :incomesdata="backInfo"
      :currentId="currentSelectPartnerId"
    ></GoodsListModal>
    <TimeModal
      ref="timeinfo"
      :timedata="backInfo"
    ></TimeModal>
    <ReceiptModal
      ref="receiptinfo"
      :receiptdata="backInfo"
    ></ReceiptModal>
    <cost-modal
      ref="costinfo"
      :costdata="backInfo"
      :currentId="currentSelectPartnerId"
      :projectId="currentSelectProjectId"
      @changepriceUnit="changepriceUnit"
    />
    <a-card class="wa_settlement_card" title="结算信息" :bordered="false">
      <a-row class="form-row"
              :gutter="10">
        <a-col :sm="6">
          <a-form-item label="月结">
            <a-input-number :max='max'
                            :min='min'
                            placeholder="请输入月结金额"
                            v-model="settlementMonth"
                            :formatter='chknum'
                            style="width: 100%"
                            :parser='chknum' />
          </a-form-item>
        </a-col>
        <a-col :sm="6">
          <a-form-item label="现付">
            <a-input-number :max='max'
                            :min='min'
                            placeholder="请输入现付金额"
                            v-model="settlementCurrent"
                            style="width: 100%"
                            :formatter='chknum'
                            :parser='chknum' />
          </a-form-item>
        </a-col>
        <a-col :sm="6">
          <a-form-item label="到付">
            <a-input-number :max='max'
                            :min='min'
                            placeholder="请输入到付金额"
                            v-model="settlementArrival"
                            style="width: 100%"
                            :formatter='chknum'
                            :parser='chknum' />
          </a-form-item>
        </a-col>
      </a-row>
    </a-card>
    <a-card title="备注" :bordered="false">
      <a-textarea v-model="remark" class="wa_remark" maxlength="50" :rows="3" placeholder="最多可输入50个汉字"/>
    </a-card>
    <div class="co_submit_layout">
      <div class="co_submit_fixed">
        <a-button
          @click="cancelSubmit"
          :offset='8'
          class="cancel"
        >取消</a-button>
        <a-button
          type="primary"
          :offset='2'
          class="submit"
          @click="handleSubmit"
          :loading="loading"
        >{{ id ? '修改' : '提交' }}</a-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import BackBtn from '@/components/BackBtn'
import orderbaseinfo from './../components/baseInfo'
import getgoodinfo from './../components/getGoodInfo'
import sendgoodinfo from './../components/sendGoodInfo'
import GoodsListModal from './../components/GoodsListModal'
import TimeModal from './../components/TimeModal'
import ReceiptModal from './../components/ReceiptModal'
import CostModal from './../components/CostModal'

import { waybillDetail, addwaybill } from '@/api/waybill/waybill'

export default {
  name: 'WaybillAdd',
  data () {
    const { id } = this.$route.params
    return {
      id,
      max: 999999.99,
      min: 0,
      loading: false,
      backInfo: {},
      carBackInfo: {},
      remark: '',
      settlementMonth: '',
      settlementCurrent: '',
      settlementArrival: '',
      currentPartnerId: '',
      currentSelectPartnerId: '',
      currentSelectProjectId: '',
      currentSdId: '',
      currentRvId: '',
      pass: true,
      waybilldata: {}
    }
  },
  components: {
    BackBtn,
    orderbaseinfo,
    sendgoodinfo,
    getgoodinfo,
    GoodsListModal,
    TimeModal,
    ReceiptModal,
    CostModal
  },
  computed: {},
  created () {
    if (this.id) {
      waybillDetail({ waybillId: this.id }).then(res => {
        this.backInfo = res.data
        this.remark = res.data.remark
        this.settlementMonth = res.data.settlementMonth
        this.settlementCurrent = res.data.settlementCurrent
        this.settlementArrival = res.data.settlementArrival
        this.currentSelectPartnerId = res.data.partnerId
        this.currentSelectProjectId = res.data.projectId
        this.currentPartnerId = res.data.partnerId
        this.setPartnerId(res.data.partnerId)
        this.currentSdId = res.data.sdId
        this.currentRvId = res.data.rvId
      })
    }
  },
  watch: {
    $route (to, from) {}
  },
  mounted () {},
  methods: {
    ...mapActions('waybill', ['setPartnerId']),
    showpartnerid (val) {
      console.log('new 接收', val)
      this.currentSelectPartnerId = val
    },
    showprojectid (val) {
      console.log('new 接收', val)
      this.currentSelectProjectId = val
    },
    cancelSubmit () {
      this.$router.back()
    },
    changepriceUnit (val) {
      this.waybilldata.priceUnit = val
    },
    chknum (value) {
      const reg = /^(-)*(\d+)\.(\d\d).*$/
      if (typeof value === 'string') {
        return !isNaN(Number(value)) ? value.replace(reg, '$1$2.$3') : ''
      } else if (typeof value === 'number') {
        return !isNaN(value) ? String(value).replace(reg, '$1$2.$3') : ''
      } else {
        if (value !== undefined && value != null && !isNaN(value)) { return (parseFloat(value)).toFixed(2) }
      }
    },
    // 省市区的数组转成对象
    RegionInfo (adcode = [], obj) {
      if (!adcode) return {}
      const region = {}
      for (let i = 0; i < adcode.length; i++) {
        const el = adcode[i]

        if (el) {
          if (obj === 'sd') {
            i === 0 && (region.sdProvinceRgcode = el) // 省
            i === 1 && (region.sdCityRgcode = el) // 市
            i === 2 && (region.sdDistrictRgcode = el) // 区
            i === 3 && (region.sdStreetRgcode = el) // 街道
          } else if (obj === 'rv') {
            i === 0 && (region.rvProvinceRgcode = el) // 省
            i === 1 && (region.rvCityRgcode = el) // 市
            i === 2 && (region.rvDistrictRgcode = el) // 区
            i === 3 && (region.rvStreetRgcode = el) // 街道
          }
        }
      }
      return region
    },

    // 页面提交
    handleSubmit () {
      let queryParams = {}
      this.pass = true
      this.$refs.baseinfo.form.validateFields((err, values) => {
        if (!err) {
          if (this.id) {
            values.waybillId = this.id
          }
          let backChange = this.$refs.baseinfo.backPartnerId()
          if (backChange !== '') {
            values.partnerId = backChange
            values.partnerName = this.$refs.baseinfo.backPartnerName()
          }
          let backProjectChange = this.$refs.baseinfo.backProjectId()
          if (backProjectChange !== '') {
            values.projectId = backProjectChange
            values.projectName = this.$refs.baseinfo.backProjectName()
          }
          queryParams = Object.assign(queryParams, values)
        } else {
          this.pass = false
        }
      })
      if (!this.pass) {
        this.$message.error('请填写基础信息必填项')
        return
      }
      this.$refs.sendinfo.form.validateFields((err, values) => {
        let sdArea = this.RegionInfo(values.sdAddressArea, 'sd')

        if (!err) {
          if (this.id) {
            values.sdId = this.currentSdId
          }
          let backChange = this.$refs.sendinfo.backSdid()
          if (backChange) {
            values.sdId = backChange
            values.sdName = this.$refs.sendinfo.backSdName()
          }
          queryParams = Object.assign(queryParams, values, sdArea)
        } else {
          this.pass = false
        }
      })
      if (!this.pass) {
        this.$message.error('请填写发货方信息必填项')
        return
      }
      this.$refs.getinfo.form.validateFields((err, values) => {
        let rvArea = this.RegionInfo(values.rvAddressArea, 'rv')
        if (!err) {
          if (this.id) {
            values.RvId = this.currentRvId
          }
          let backChange = this.$refs.getinfo.backRvid()
          if (backChange) {
            values.rvId = backChange
            values.rvName = this.$refs.getinfo.backRvName()
          }

          queryParams = Object.assign(queryParams, values, rvArea)
        } else {
          this.pass = false
        }
      })
      if (!this.pass) {
        this.$message.error('请填写收货方信息必填项')
        return
      }
      let goodData = this.$refs.goodsinfo.handleGetdata()
      console.log('goodData515', goodData)
      for (let i = 0; i < goodData.length; i++) {
        if (!goodData[i].consignmentName) {
          this.$message.error('请选择或输入货物名称')
          return
        }
        if (!goodData[i].orderAmount || goodData[i].orderAmount < 1) {
          this.$message.error('请输入货物件数')
          return
        }
      }
      queryParams.consignments = goodData
      queryParams = Object.assign(
        queryParams, this.$refs.timeinfo.handleGetdata()
      )
      queryParams = Object.assign(
        queryParams, this.$refs.receiptinfo.handleGetdata()
      )
      queryParams = Object.assign(
        queryParams, this.$refs.costinfo.handleGetdata()
      )
      queryParams.remark = this.remark
      if (queryParams.totalMoney) {
        var sMonth = this.settlementMonth ? Number(this.settlementMonth) : 0
        var sCurrent = this.settlementCurrent ? Number(this.settlementCurrent) : 0
        var sArrival = this.settlementArrival ? Number(this.settlementArrival) : 0
        var temp = sMonth + sCurrent + sArrival
        if (temp !== Number(queryParams.totalMoney)) {
          this.$message.error('费用结算方式之和与费用总计不相等，请重新确认')
          return
        }
      }
      queryParams.settlementMonth = this.settlementMonth
      queryParams.settlementCurrent = this.settlementCurrent
      queryParams.settlementArrival = this.settlementArrival
      console.log('commit data' + JSON.stringify(queryParams))
      try {
        delete queryParams.sdAddressArea
      } catch (e) {}
      try {
        delete queryParams.rvAddressArea
      } catch (e) {}
      if (this.pass) {
        this.pass = false
        this.loading = true
        addwaybill(Object.assign(queryParams)).then(res => {
          if (res.code === 0) {
            this.$router.back()
          }
        }).finally(() => {
          this.pass = true
          this.loading = false
        })
      } else {
        this.$message.error('请填写必填项')
      }
    }

    // 页面继续提交
    // async submitAndContinue () {
    //   this.handleSubmit()
    //   this.$router.push({
    //     name: 'WaybillAdd'
    //   })
    // }
  }
}
</script>
