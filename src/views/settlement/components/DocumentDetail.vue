<template>
  <div class="document-detail">
    <a-modal
      :visible="visible"
      :maskClosable="false"
      :centered="true"
      @cancel="hide"
      width='90%'
      title="结算单详情">
      <template slot="footer">
        <a-button key="back" @click="hide">取消</a-button>
      </template>
      <a-form id="form" v-if="docDetail !== null">
        <a-row class="form-row" :gutter="16">
          <a-col :xl="6" :lg="6" :md="12" :sm="24">
            <a-form-item
              label="结算单号"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol">{{docDetail.documentCode}}
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="6" :md="12" :sm="24">
            <a-form-item
              label="结算类型"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol">{{docDetail.settlementTypeName}}
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="6" :md="12" :sm="24">
            <a-form-item
              label="结算对象"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol">{{docDetail.partnerName}}
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="6" :md="12" :sm="24">
            <a-form-item
              label="结算单名称"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol">{{docDetail.documentName}}
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="16">
          <a-col :xl="6" :lg="6" :md="12" :sm="24">
            <a-form-item
              label="结算账期"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol">{{docDetail.settlementPeriod}}
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="6" :md="12" :sm="24">
            <a-form-item
              label="要求开票时间"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol">{{docDetail.reqInvoiceDate && docDetail.reqInvoiceDate.join('-')}}
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="6" :md="12" :sm="24">
            <a-form-item
              label="是否含税"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol">{{docDetail.taxIncludeName}}
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="6" :md="12" :sm="24">
            <a-form-item
              label="税点"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol">{{docDetail.taxRateName}}
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="16">
          <a-col :xl="6" :lg="6" :md="12" :sm="24">
            <a-form-item
              label="结算金额"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol">{{docDetail.totalMoney}}
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="6" :md="12" :sm="24">
            <a-form-item
              label="是否开票"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol">{{docDetail.isInvoiceName}}
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="6" :md="12" :sm="24">
            <a-form-item
              label="结算备注"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
            >{{docDetail.remark}}
            </a-form-item>
          </a-col>
        </a-row>
        <a-row
          :bordered="false"
          class="card-container tabbar-container">
          <detail-nav
            :items="tabItems"
            @tabActive="tabActive"
            :bizStatus="bizStatus"
            :routerChange="false"></detail-nav>
        </a-row>

        <a-row id="tab-wrap" style="height: 500px;overflow-y: scroll;">
          <a-col :xl="24" :lg="24" :md="24" :sm="24">
            <a-form-item>
              <component
                v-if="(tabActiveKey === 'settlementOddDetail' || tabActiveKey === 'enclosureDetail') && docDetail !== null"
                :is="tabActiveKey"
                :dataSource="currentBusinessDataList"
                @clickImg="clickImg"
                :queryParam="{'documentId': docDetail.documentId,'settlementStyle': docDetail.payPeriod}">
              </component>
              <a-table
                v-if="tabActiveKey != 'settlementOddDetail' && tabActiveKey !=  'enclosureDetail'"
                :columns="currentColumns"
                ref="tablist"
                :scroll="{ x: 1500}"
                :pagination="false"
                :dataSource="currentBusinessDataList"
                @change="handleTableChange">
                <template slot="invoiceUrl"
                   slot-scope="text, record"
                   @click="handleSettleDocDetail(record)">
                  <img width="90" height="90" @click="$refs.ImgModal.show(record.invoiceUrl)" class="table-img" :src="record.invoiceUrl" alt="">
                </template>
              </a-table>
              <!--<custom-table :columns="currentColumns" :currentSums="currentSums" :hasFooter="true"-->
                            <!--:dataSource="currentBusinessDataList"></custom-table>-->
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
    <img-modal ref="ImgModal"></img-modal>
  </div>
</template>
<script>
import base from './mixins/base'
import CustomTable from '@/components/CustomTable'
import AFormItem from 'ant-design-vue/es/form/FormItem'
import detailNav from './Tabs'
import { countCollumnsWidth } from '@/utils/util'
import { InvoiceHead, SettlementDetailsHead } from './column'
import ImgModal from './imgModal'

export default {
  mixins: [base],
  components: {
    AFormItem,
    CustomTable,
    detailNav,
    ImgModal,
    'settlementOddDetail': () => import('./settlementOddDetail'),
    'ticketDetail': () => import('./ticketDetail'),
    'settlementDetail': () => import('./settlementDetail'),
    'enclosureDetail': () => import('./enclosureDetail')
  },
  data () {
    return {
      labelCol: { span: 8 },
      wrapperCol: { span: 12, offset: 1 },
      visible: false,
      docDetail: null,
      form: this.$form.createForm(this),
      currentSums: {},
      currentBusinessDataList: [],
      currentColumns: [],
      tabActiveKey: '',
      bizStatus: 0
    }
  },
  computed: {
    customerColumns () {
      return [
        {
          span: 2,
          sum: (currentSums) => {
            return ''
          },
          title: '运单号',
          val: (record) => {
            return record.waybillCode
          }
        },
        {
          span: 2,
          sum: (currentSums) => {
            return ''
          },
          title: '客户单号',
          val: (record) => {
            return record.clientCode
          }
        },
        {
          span: 2,
          sum: (currentSums) => {
            return ''
          },
          title: '发货方名称',
          val: (record) => {
            return record.sdName
          }
        },
        {
          span: 2,
          sum: (currentSums) => {
            return ''
          },
          title: '发货区域',
          val: (record) => {
            return record.sdAddressArea
          }
        },
        {
          span: 3,
          sum: (currentSums) => {
            return ''
          },
          title: '收货方名称',
          val: (record) => {
            return record.rvName
          }
        },
        {
          span: 3,
          sum: (currentSums) => {
            return ''
          },
          title: '收货区域',
          val: (record) => {
            return record.rvAddressArea
          }
        },
        {
          span: 3,
          sum: (currentSums) => {
            return ''
          },
          title: '收货方地址',
          val: (record) => {
            return record.rvAddress
          }
        },
        {
          span: 1,
          sum: (currentSums) => {
            return currentSums.feeTransSum
          },
          title: '运费',
          val: (record) => {
            return record.feeTrans || 0
          }
        },
        {
          span: 1,
          sum: (currentSums) => {
            return currentSums.feeGetSum
          },
          title: '提货费',
          val: (record) => {
            return record.feeGet || 0
          }
        },
        {
          span: 1,
          sum: (currentSums) => {
            return currentSums.feeSendSum
          },
          title: '运货费',
          val: (record) => {
            return record.feeSend || 0
          }
        },
        {
          span: 1,
          sum: (currentSums) => {
            return currentSums.feeStevedoringSum
          },
          title: '装卸费',
          val: (record) => {
            return record.feeStevedoring || 0
          }
        },
        {
          span: 1,
          sum: (currentSums) => {
            return currentSums.settlementMonthSum
          },
          title: '月结',
          val: (record) => {
            return record.settlementMonth || 0
          }
        },
        {
          span: 1,
          sum: (currentSums) => {
            return currentSums.settlementCurrentSum
          },
          title: '现付',
          val: (record) => {
            return record.settlementCurrent || 0
          }
        }

      ]
    },
    carrierColumns () {
      return [
        {
          span: 2,
          sum: (currentSums) => {
            return ''
          },
          title: '运单号',
          val: (record) => {
            return record.waybillCode
          }
        },
        {
          span: 2,
          sum: (currentSums) => {
            return ''
          },
          title: '客户单号',
          val: (record) => {
            return record.clientCode
          }
        },
        {
          span: 2,
          sum: (currentSums) => {
            return ''
          },
          title: '发货方名称',
          val: (record) => {
            return record.sdName
          }
        },
        {
          span: 2,
          sum: (currentSums) => {
            return ''
          },
          title: '发货区域',
          val: (record) => {
            return record.sdAddressArea
          }
        },
        {
          span: 3,
          sum: (currentSums) => {
            return ''
          },
          title: '收货方名称',
          val: (record) => {
            return record.rvName
          }
        },
        {
          span: 3,
          sum: (currentSums) => {
            return ''
          },
          title: '收货区域',
          val: (record) => {
            return record.rvAddressArea
          }
        },
        {
          span: 3,
          sum: (currentSums) => {
            return ''
          },
          title: '收货方地址',
          val: (record) => {
            return record.rvAddress
          }
        },
        {
          span: 1,
          sum: (currentSums) => {
            return currentSums.totalAmountSum
          },
          title: '件数',
          val: (record) => {
            return record.totalAmount || 0
          }
        },
        {
          span: 1,
          sum: (currentSums) => {
            return currentSums.totalWeightSum
          },
          title: '重量',
          val: (record) => {
            return record.totalWeight || 0
          }
        },
        {
          span: 1,
          sum: (currentSums) => {
            return currentSums.feeTransSum
          },
          title: '运费',
          val: (record) => {
            return record.feeTrans || 0
          }
        },
        {
          span: 1,
          sum: (currentSums) => {
            return currentSums.feeGetSum
          },
          title: '提货费',
          val: (record) => {
            return record.feeGet || 0
          }
        },
        {
          span: 1,
          sum: (currentSums) => {
            return currentSums.feeSendSum
          },
          title: '运货费',
          val: (record) => {
            return record.feeSend || 0
          }
        },
        {
          span: 1,
          sum: (currentSums) => {
            return currentSums.feeStevedoringSum
          },
          title: '装卸费',
          val: (record) => {
            return record.feeStevedoring || 0
          }
        }

      ]
    },
    driverColumns () {
      return [
        {
          span: 2,
          sum: (currentSums) => {
            return ''
          },
          title: '调度单号',
          val: (record) => {
            return record.dispatchCode
          }
        },
        {
          span: 2,
          sum: (currentSums) => {
            return ''
          },
          title: '车牌号',
          val: (record) => {
            return record.plateNumber
          }
        },
        {
          span: 2,
          sum: (currentSums) => {
            return ''
          },
          title: '司机姓名',
          val: (record) => {
            return record.driverName
          }
        },
        {
          span: 3,
          sum: (currentSums) => {
            return ''
          },
          title: '司机手机号',
          val: (record) => {
            return record.mobile
          }
        },
        {
          span: 2,
          sum: (currentSums) => {
            return ''
          },
          title: '运输方式',
          val: (record) => {
            return record.transportTypeName
          }
        },
        {
          span: 2,
          sum: (currentSums) => {
            return currentSums.amountSum
          },
          title: '件数',
          val: (record) => {
            return record.amount || 0
          }
        },
        {
          span: 2,
          sum: (currentSums) => {
            return currentSums.weightSum
          },
          title: '重量(kg)',
          val: (record) => {
            return record.weight || 0
          }
        },
        {
          span: 2,
          sum: (currentSums) => {
            return currentSums.volumeSum
          },
          title: '体积',
          val: (record) => {
            return record.volume || 0
          }
        },
        {
          span: 2,
          sum: (currentSums) => {
            return currentSums.yfSum
          },
          title: '运费',
          val: (record) => {
            return record.yf || 0
          }
        },
        {
          span: 2,
          sum: (currentSums) => {
            return currentSums.thfSum
          },
          title: '提货费',
          val: (record) => {
            return record.thf || 0
          }
        },
        {
          span: 2,
          sum: (currentSums) => {
            return currentSums.shfSum
          },
          title: '送货费',
          val: (record) => {
            return record.shf || 0
          }
        }
      ]
    },
    scrollX () {
      return countCollumnsWidth(this.currentColumns)
    }

  },
  methods: {
    show () {
      this.visible = true
      this.tabActiveKey = 'settlementOddDetail'
    },
    hide () {
      this.visible = false
      this.currentBusinessDataList = []
      this.currentColumns = []
      this.currentSums = {}
      this.tabActiveKey = ''
      this.docDetail = null
      this.form.resetFields()
    },
    tabActive (item) {
      this.tabActiveKey = item.pathName
      if (item.pathName === 'ticketDetail') {
        this.currentColumns = InvoiceHead
        this.currentBusinessDataList = this.docDetail.invoiceSimpleVoList
      } else if (item.pathName === 'settlementDetail') {
        this.currentColumns = SettlementDetailsHead
        this.currentBusinessDataList = this.docDetail.paymentSimpleVoList
      } else if (item.pathName === 'enclosureDetail') {
        this.currentBusinessDataList = this.docDetail.sourceDocumentPicVos
      }
    },
    getDocDetail (docId) {
      this.show()
      docId && this.pageConfig.checkCoordinateDetail({ documentId: docId }).then(res => {
        console.log('getDocDetail=>res', res)
        this.docDetail = res.data || []
        this.tabActiveKey = 'settlementOddDetail'
        this.bizStatus = this.docDetail.bizStatus
      })
    },
    // 获取客户结算详情列表统计项
    getCustomerSum (records) {
      let feeTransSum = 0
      let feeGetSum = 0
      let feeSendSum = 0
      let feeStevedoringSum = 0
      let settlementMonthSum = 0
      let settlementCurrentSum = 0

      records && records.forEach(record => {
        feeTransSum += (record.feeTrans || 0)
        feeGetSum += (record.feeGet || 0)
        feeSendSum += (record.feeSend || 0)
        feeStevedoringSum += (record.feeStevedoring || 0)
        settlementMonthSum += (record.settlementMonth || 0)
        settlementCurrentSum += (record.settlementCurrent || 0)
      }
      )
      return {
        feeTransSum,
        feeGetSum,
        feeSendSum,
        feeStevedoringSum,
        settlementMonthSum,
        settlementCurrentSum
      }
    },
    // 获取承运商结算详情列表统计项
    getCarrierSum (records) {
      let feeTransSum = 0
      let feeGetSum = 0
      let feeSendSum = 0
      let feeStevedoringSum = 0
      let totalAmountSum = 0
      let totalWeightSum = 0

      records && records.forEach(record => {
        feeTransSum += (record.feeTrans || 0)
        feeGetSum += (record.feeGet || 0)
        feeSendSum += (record.feeSend || 0)
        feeStevedoringSum += (record.feeStevedoring || 0)
        totalAmountSum += (record.totalAmount || 0)
        totalWeightSum += (record.totalWeight || 0)
      }
      )
      return {
        feeTransSum,
        feeGetSum,
        feeSendSum,
        feeStevedoringSum,
        totalAmountSum,
        totalWeightSum
      }
    },
    // 获取司机结算详情列表统计项
    getDriverSum (records) {
      let amountSum = 0
      let weightSum = 0
      let volumeSum = 0
      let yfSum = 0
      let thfSum = 0
      let shfSum = 0

      records && records.forEach(record => {
        amountSum += (record.amount || 0)
        weightSum += (record.weight || 0)
        volumeSum += (record.volume || 0)
        yfSum += (Number(record.yf) || 0)
        thfSum += (Number(record.thf) || 0)
        shfSum += (Number(record.shf) || 0)
      }
      )
      return {
        amountSum,
        weightSum,
        volumeSum,
        yfSum,
        thfSum,
        shfSum
      }
    },
    clickImg (url) {
      this.$refs.ImgModal.show(url)
    },
    handleTableChange () {

    }
  }
}
</script>
<style lang="less" scoped>
.document-detail{
  .table-img{
    width: 120px;
    height: 120px;
  }
  #tab-wrap{
    height: 500px !important;
  }
}
</style>
