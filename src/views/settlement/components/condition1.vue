<template>
  <div>
     <a-form :form="form" layout="vertical">
  <a-row :gutter="12">
    <a-col :xs="6">
      <a-form-item label="结算单号">
        <a-input v-model="detail.documentCode" :disabled="true"/>
      </a-form-item>
    </a-col>
    <a-col :xs="6">
      <a-form-item label="结算类型">
        <a-input v-model="detail.settlementTypeName" :disabled="true"/>
      </a-form-item>
    </a-col>
    <a-col :xs="6">
      <a-form-item label="结算对象">
        <a-input v-model="detail.partnerName" :disabled="true"/>
      </a-form-item>
    </a-col>
    <a-col :xs="6">
       <a-form-item label="结算单名称">
        <a-input v-model="detail.documentName" :disabled="true"/>
      </a-form-item>
    </a-col>
  </a-row>
  <a-row :gutter="12">
    <a-col :xs="6">
      <a-form-item label="结算单账期">
        <a-date-picker :placeholder="detail.settlementPeriod" :disabled="true"/>
      </a-form-item>
    </a-col>
    <a-col :xs="6">
      <a-form-item label="要求开票时间">
        <a-date-picker :placeholder="detail.reqInvoiceDate" :disabled="true"/>
      </a-form-item>
    </a-col>
    <a-col :xs="6">
       <a-form-item label="是否含税">
         <a-select v-model="detail.taxIncludeName" :defaultValue="detail.taxIncludeName" :disabled="true">
          <a-select-option value="1">含税</a-select-option>
          <a-select-option value="0">未含税</a-select-option>
        </a-select>
      </a-form-item>
    </a-col>
    <a-col :xs="6">
      <a-form-item label="税点">
       <a-select v-model="detail.taxRateName" :defaultValue="detail.taxRate" :disabled="true"></a-select>
      </a-form-item>
    </a-col>
  </a-row>
  <a-row v-if="isopenbank" :gutter="12">
    <a-col :xs="6">
      <a-form-item label="结算金额">
        <a-input v-model="detail.totalMoney" :disabled="true"/>
      </a-form-item>
    </a-col>
    <a-col :xs="6">
      <a-form-item label="是否开票">
       <a-select v-model="detail.isInvoiceName" :defaultValue="detail.isInvoiceName" :disabled="true">
          <a-select-option value="1">是</a-select-option>
          <a-select-option value="0">否</a-select-option>
        </a-select>
      </a-form-item>
    </a-col>
    <a-col :xs="12">
       <a-form-item label="结算备注">
        <a-input v-model="detail.remark" placeholder="备注" :disabled="true"/>
       </a-form-item>
    </a-col>
  </a-row>
  <a-row v-if="!isopenbank" :gutter="12">
    <a-col :xs="6">
      <a-form-item label="结算金额">
        <a-input v-model="detail.totalMoney" :disabled="true"/>
      </a-form-item>
    </a-col>
    <a-col :xs="6">
      <a-form-item label="已结金额">
        <a-input v-model="detail.paidMoney" :disabled="true"/>
      </a-form-item>
    </a-col>
    <a-col :xs="6">
      <a-form-item label="开票金额">
        <a-input v-model="detail.invoiceMoney" :disabled="true"/>
      </a-form-item>
    </a-col>
    <a-col :xs="6">
      <a-form-item label="是否开票">
       <a-select v-model="detail.isInvoiceName" :defaultValue="detail.isInvoiceName" :disabled="true">
          <a-select-option value="1">是</a-select-option>
          <a-select-option value="0">否</a-select-option>
        </a-select>
      </a-form-item>
    </a-col>
  </a-row>
  <a-row v-if="!isopenbank" :gutter="12">
    <a-col :xs="18">
       <a-form-item label="结算备注">
        <a-input v-model="detail.remark" placeholder="备注" :disabled="true"/>
       </a-form-item>
    </a-col>
  </a-row>
  </a-form>
  </div>
</template>
<script>
import moment from 'moment'
import base from './mixins/base'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'condition',
  mixins: [base],
  data () {
    return {
      documentId: this.getDocumentId,
      isopenbank: true,
      form: this.$form.createForm(this),
      detail: {}
    }
  },
  computed: {
    ...mapGetters('settlement',
      ['getDocumentId']
    )
  },
  mounted () {
    this.getDetailInfo()
    console.log(66666 + '---------')
  },
  methods: {
    moment,
    ...mapActions('settlement', [
      'setdocumentData'
    ]),
    getDetailInfo () {
      let url = this.$route.path
      this.documentId = this.getDocumentId
      if (url.indexOf('invoiceList') > 0) {
        this.pageConfig.openbankDetail({ documentId: this.documentId }).then(res => {
          // console.log(res)
          let item = res.data
          item.reqInvoiceDate = (item.reqInvoiceDate === null || item.reqInvoiceDate === '') ? '' : item.reqInvoiceDate[0] + '-' + item.reqInvoiceDate[1] + '-' + item.reqInvoiceDate[2]
          item.taxRate = item.taxRate * 100 + '%'
          // this.detail = item
          this.$nextTick(() => {
            this.detail = item
            this.setdocumentData(item.invoiceSimpleVoList)
          })
        })
      } else if (url.indexOf('paymentList') > 0) {
        this.isopenbank = false
        this.pageConfig.paymentDetail({ documentId: this.documentId }).then(res => {
          // console.log('结算单详情')
          // console.log(res)
          let item = res.data
          item.reqInvoiceDate = (item.reqInvoiceDate === null || item.reqInvoiceDate === '') ? '' : item.reqInvoiceDate[0] + '-' + item.reqInvoiceDate[1] + '-' + item.reqInvoiceDate[2]
          item.taxRate = item.taxRate * 100 + '%'
          // this.detail = item
          this.$nextTick(() => {
            this.detail = item
          })
        })
      }
    }
  }

}
</script>
<style lang="less" scoped>
  .ant-form-item{
    margin-bottom: 5px;
  }
</style>
