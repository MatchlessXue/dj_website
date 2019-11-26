<template>
  <div>
    <BackBtn />
    <div class="baseinfo_box">
      <a-card
        class="card"
        title="基础信息"
        :bordered="false"
      >
        <orderbaseinfo
          ref='baseinfo'
          @showpartnerid="showpartnerid"
          :info="backInfo"
        ></orderbaseinfo>
      </a-card>
    </div>

    <div class="card2">
      <a-row :gutter="16">
        <a-col
          :xs="12"
          style=""
        >
          <a-card
            title="发货方信息"
            :bordered=false
          >
            <sendgoodinfo
              ref="sendinfo"
              :clientid="currentSelectPartnerId"
              :info="backInfo"
            ></sendgoodinfo>
          </a-card>
        </a-col>
        <a-col
          :xs="12"
          class="card2_col"
        >
          <a-card
            title="收货方信息"
            :bordered="false"
          >
            <getgoodinfo
              ref="getinfo"
              :clientid="currentSelectPartnerId"
              :info="backInfo"
            ></getgoodinfo>
          </a-card>
        </a-col>
      </a-row>
    </div>
    <div class="card3">
      <GoodsListModal
        ref="goodsinfo"
        :type="type"
        :incomesdata="backInfo"
        :currentId="currentSelectPartnerId"
      ></GoodsListModal>
    </div>

    <div class="card4">
      <TimeModal
        ref="timeinfo"
        :type="type"
        :timedata="backInfo"
      ></TimeModal>
    </div>
    <div class="card5">
      <ReceiptModal
        ref="receiptinfo"
        :type='type'
        :receiptdata="backInfo"
      ></ReceiptModal>
    </div>

    <div class="card6">
      <a-card>
        <h2>备注</h2>
        <a-row>
          <a-col
            :xs='24'
            style="height:72px;"
          >
            <a-input
              placeholder="请输入备注信息"
              v-model="remark"
            ></a-input>
          </a-col>
        </a-row>
      </a-card>
    </div>
    <!-- <div class="feedback" v-if="id">
        <a-card>
          <a-timeline>
            <a-timeline-item v-for="item in carBackInfo" :key="item">
              <div>
                <h2>1111</h2>
              </div>
            </a-timeline-item>

          </a-timeline>
        </a-card>
      </div> -->
    <div class="submit">
      <a-card>
        <a-button
          @click="cancelSubmit"
          :offset='8'
          class="cancel"
        >取消</a-button>&nbsp;&nbsp;
        <a-button
          type="primary"
          :offset='2'
          class="submit"
          @click="handleSubmit"
        >{{ id ? '修改' : '提交' }}</a-button>
        <a-button
          type="primary"
          :offset='2'
          class="gosubmit"
          @click="submitAndContinue"
          v-if="!id"
        >提交并继续 </a-button>
      </a-card>
    </div>
  </div>
</template>

<script>
// import { mapActions, mapGetters } from 'vuex'
import { mapActions } from 'vuex'
import BackBtn from '@/components/BackBtn'
import orderbaseinfo from './components/baseInfo'
import getgoodinfo from './components/getGoodInfo'
import sendgoodinfo from './components/sendGoodInfo'
import GoodsListModal from './components/GoodsListModal'
import TimeModal from './components/TimeModal'
import ReceiptModal from './components/ReceiptModal'

import { addOrder, orderDetail } from '@/api/order/order'

import { submitForm } from './components/config'

export default {
  name: 'ordernew',
  data () {
    const { id } = this.$route.params
    return {
      id,
      backInfo: {},
      carBackInfo: {},
      remark: '',
      currentPartnerId: '',
      currentSelectPartnerId: '',
      currentSdId: '',
      currentRvId: '',
      pass: true
    }
  },
  components: {
    BackBtn,
    orderbaseinfo,
    sendgoodinfo,
    getgoodinfo,
    GoodsListModal,
    TimeModal,
    ReceiptModal
  },
  computed: {},
  created () {
    if (this.id) {
      orderDetail({ orderId: this.id }).then(res => {
        this.backInfo = res.data
        this.remark = res.data.remark
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
    cancelSubmit () {
      this.$router.back()
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
    async handleSubmit () {
      let queryParams = {}

      await this.$refs.baseinfo.form.validateFields((err, values) => {
        // console.log('err', err, 'baseinfo values', values)
        if (!err) {
          if (this.id) {
            values.waybillId = this.id
            values.partnerId = this.currentPartnerId
            console.log('当前客户id', values)
          }
          let backChange = this.$refs.baseinfo.backPartnerId()
          if (backChange !== '') {
            values.partnerId = backChange
            values.partnerName = this.$refs.baseinfo.backPartnerName()
          }
          console.log(values)
          queryParams = Object.assign(submitForm, values)
        } else {
          this.pass = false
        }
      })

      await this.$refs.sendinfo.form.validateFields((err, values) => {
        console.log('>>>>', values)
        console.log(values.sdAddressArea)
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
      // queryParams. = this.$refs.sendinfo.backName()

      await this.$refs.getinfo.form.validateFields((err, values) => {
        let rvArea = this.RegionInfo(values.rvAddressArea, 'rv')
        console.log('rv', rvArea)
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
      let goodData = this.$refs.goodsinfo.handleGetdata()
      console.log('11111', goodData)
      queryParams.consignments = goodData
      await this.$refs.goodsinfo.form.validateFields((err, values) => {
        console.log('>>>>>>>>货物', values)
        if (!err) {
          queryParams = Object.assign(queryParams, values)
        } else {
          this.pass = false
        }
      })
      // 时间数据
      // console.log(this.$refs.timeinfo)
      // console.log(this.$refs.timeinfo.handleGetdata())
      // let timeTempArr = this.$refs.timeinfo.handleGetdata()
      // console.log('>.....', timeTempArr)
      // console.log(timeTempArr)

      queryParams = Object.assign(
        queryParams,
        this.$refs.timeinfo.handleGetdata()
      )

      // await this.$refs.timeinfo.form.validateFields((err, values) => {
      //   if (!err) {
      //     queryParams = Object.assign(queryParams, values)
      //   } else {
      //     this.pass = false
      //   }
      // })
      // await this.$refs.receiptinfo.form.validateFields((err, values) => {
      //   if (!err) {
      //     queryParams = Object.assign(queryParams, values)
      //   } else {
      //     this.pass = false
      //   }
      // })
      queryParams = Object.assign(
        queryParams,
        this.$refs.receiptinfo.handleGetdata()
      )

      queryParams.remark = this.remark
      try {
        delete queryParams.sdAddressArea
      } catch (e) {}
      try {
        delete queryParams.rvAddressArea
      } catch (e) {}
      if (this.pass) {
        this.pass = false
        addOrder(Object.assign(queryParams)).then(res => {
          console.log(res.data)
          this.pass = true

          if (res.code === 0) {
            this.$router.back()
          }
        })
          .catch(res => {
            this.pass = true
          })
      } else {
        this.$Mesage.error('请填写必填项')
      }
    },

    // 页面继续提交
    async submitAndContinue () {
      this.handleSubmit()
      this.$router.push({
        name: 'orderNew'
      })
    }
  }
}
</script>

<style lang="less">
.baseinfo_box {
  .card {
    .ant-card-body {
      padding: 15px !important;
    }
  }
}
.card2 {
  margin-top: 10px;
}
.card3 {
  margin-top: 10px;
}
.card4 {
  margin-top: 10px;
}
.card5 {
  margin-top: 10px;
}
.card6 {
  margin-top: 10px;
}
.cancel {
  margin-left: 40%;
}
.submit {
  margin-right: 10px;
}
</style>
