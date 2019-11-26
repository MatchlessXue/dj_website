<template>
  <div>
     <a-form
        :form="form"
        layout="vertical"
        @submit="handleSubmit"
      >
      <a-row :gutter="24">
        <a-col :xs="6">
          <a-form-item
            label="结算单号">
            <a-input
            :disabled="true"
            placeholder=""
            v-decorator="['documentCode']"/>
            <a-input type="hidden" v-decorator="['documentId']"/>
          </a-form-item>
        </a-col>
        <a-col :xs="6">
          <a-form-item
            label="结算类型">
            <a-select
              :disabled="true"
              v-decorator="['settlementType']"
              @change="handleChange">
                <a-select-option v-for="item in settlementStatusMap" :key="item.code">{{item.name}}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>

        <a-col :xs="6" v-if="pageType != 3">
          <a-form-item class="hide-form-item"><a-input type="hidden" v-decorator="['partnerId']"/></a-form-item>
          <a-form-item label="结算对象">
            <a-input
            placeholder=""
            :disabled="true"
            v-decorator="['partnerName']"/>
          </a-form-item>
        </a-col>
        <a-col :xs="6" v-else>
          <a-form-item class="hide-form-item"><a-input type="hidden" v-decorator="['driverId']"/></a-form-item>
          <a-form-item label="结算对象">
            <a-input
            placeholder=""
            :disabled="true"
            v-decorator="['driverName']"/>
          </a-form-item>
        </a-col>
        <a-col :xs="6">
          <a-form-item
            label="结算单名称">
            <a-input
            placeholder="请输入结算单名称"
            v-decorator="['documentName',{rules: [{ required: true, message: '请输入结算单名称!' }]}]"/>
          </a-form-item>
        </a-col>

      </a-row>
      <a-row :gutter="12">
        <a-col :xs="6">
          <a-form-item
            label="结算账期"
            :label-col="labelCol"
            :wrapper-col="wrapperCol">
            <!-- v-decorator="['settlementPeriod',{initialValue:moment(this.getDefaultMonth(),'YYYY-MM')}]" -->
            <a-date-picker
              format="YYYY-MM"
              v-decorator="['settlementPeriodv',{
                'initialValue': moment(this.getDefaultMonth(), 'YYYY-MM')
              }]"
              @change="onChangPeriodDate"/>
            <a-input type="hidden" v-decorator="['settlementPeriod', { initialValue: moment(this.getDefaultMonth(), 'YYYY-MM').format('YYYY-MM')}]"/>
            <!-- <a-form-item class="hide-form-item"></a-form-item> -->
          </a-form-item>
        </a-col>
        <a-col :xs="6">
          <a-form-item
            label="要求开票时间"
            :label-col="labelCol"
            :wrapper-col="wrapperCol">
            <a-date-picker v-decorator="['reqInvoiceDatev']" format="YYYY-MM-DD" @change="onChangeReqInvoice" />
            <a-input type="hidden" v-decorator="['reqInvoiceDate']" placeholder="请选择开票时间"/>
          </a-form-item>

        </a-col>
        <a-col :xs="6">
          <a-form-item
            label="是否含税"
            :label-col="labelCol"
            :wrapper-col="wrapperCol">
            <a-select
              @change="taxChange"
              v-decorator="['taxInclude', { initialValue: 1}]">
              <a-select-option :value="1">已含税</a-select-option>
              <a-select-option :value="0">未含税</a-select-option>
            </a-select>
          </a-form-item>

        </a-col>
        <a-col :xs="6">
          <a-form-item
            label="税点"
            :label-col="labelCol"
            :wrapper-col="wrapperCol">
          <a-select
            v-decorator="['taxRate', { initialValue: 6 }]"
            @change="handleChange">
              <a-select-option v-for="item in taxPercentsMap" :key="item.dictId">{{item.dictName}}</a-select-option>
            </a-select>
          </a-form-item>

        </a-col>
      </a-row>
      <a-row :gutter="12">
        <a-col :xs="6">
          <a-form-item
            label="结算金额"
            :label-col="labelCol"
            :wrapper-col="wrapperCol">
            <a-input
            placeholder=""
            v-decorator="['totalMoney']"
            :disabled="true"/>
          </a-form-item>
        </a-col>
        <a-col :xs="6" v-show="!isImmediatePay">
          <a-form-item
            label="是否开票"
            :label-col="labelCol"
            :wrapper-col="wrapperCol">
          <a-select
          :disabled="isImmediatePay"
          v-decorator="['isInvoice', { initialValue: isImmediatePay ? 0 : 1 }]"
          @change="handleChange">
              <a-select-option :value="1">是</a-select-option>
              <a-select-option :value="0">否</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :xs="12">
          <a-form-item
            label="结算备注">
            <a-input
            v-decorator="['remark']"
            placeholder="请输入备注"/>
          </a-form-item>
        </a-col>
      </a-row>
  </a-form>
  </div>
</template>
<script>
import moment from 'moment'
import wmath from '@utils/wmath'
import { mapActions, mapGetters } from 'vuex'
import base from './mixins/base'
import { getTaxPercents } from '@/api/libraries'

export default {
  name: 'condition',
  mixins: [base],
  data () {
    return {
      form: this.$form.createForm(this),
      labelCol: {},
      wrapperCol: {},
      taxPercentsMap: [], // 税点列表
      formInfo: {
        documentCode: '',
        settlementType: '',
        partnerId: '',
        partnerName: '',
        settlementPeriod: '',
        reqInvoiceDate: '',
        taxInclude: '',
        totalMoney: 0,
        isInvoice: '',
        remark: ''

      },
      backInfo: {
        partnerId: '',
        partnerName: '',
        settlementType: '', // 结算类型的key
        documentId: ''
      }

    }
  },
  props: {
    type: {
      type: Number,
      default: 1
    },
    // 是否立即付款
    isImmediatePay: {
      type: Boolean,
      default: false
    }
  },

  watch: {
    getTotal: {
      handler: function (val) {
        console.log('getTotal...', val)
        this.$nextTick(() => {
          console.log(val)
          this.form.setFieldsValue({ totalMoney: Number(val.settlementFee) })
        })
      }
    }
  },
  computed: { ...mapGetters('settlement', ['getCostForm', 'getClientSelectCondiation', 'getTotal', 'getDocumentInfo']) },
  mounted () {
    console.log('conditionForm mounted....')
    console.log(this.getCostForm)
    this.getSettlementStatusMap()
    this.getTaxPercentsMap()
    // 设置时间默认
    console.log('getTotal', this.getTotal)
  },
  methods: {
    moment,
    ...mapActions('settlement', [
      'costForm'
    ]),
    // 获取当前月的下个月
    getDefaultMonth () {
      let begin = new Date()
      let yy = begin.getFullYear()
      let mm = begin.getMonth() + 2
      mm = (mm < 10 ? '0' + mm : mm)
      return yy + '-' + mm
    },
    init () {
      if (this.type === 1) {
        // 重置
        this.form.resetFields()
        const formData = this.getCostForm[0]
        console.log(formData)
        // 结算类型 1: 客户 110， 2：承运商 220， 3：司机 320
        const pgType = this.pageType
        let tempCode = `${formData.settlementObjectType}${formData.settlementType}${formData.settlementStyle}`
        this.form.setFieldsValue({ settlementType: tempCode * 1 })
        console.log('类型', pgType, 'settlementType', tempCode)
        // this.backInfo.partnerId = formData.partnerId
        if (this.pageType === 3) { // 司机
          this.form.setFieldsValue({
            driverId: formData.driverId,
            driverName: formData.driverName
          })
        } else if (this.pageType === 2) {
          this.form.setFieldsValue({
            partnerId: formData.carrierId,
            partnerName: formData.carrierName
          })
        } else {
          this.form.setFieldsValue({
            partnerId: formData.partnerId,
            partnerName: formData.partnerName
          })
        }
        this.formInfo.totalMoney = 0
        for (let i = 0; i < this.getCostForm.length; i++) {
          this.formInfo.totalMoney = wmath.add(this.formInfo.totalMoney, this.getCostForm[i].settlementFee || 0)
        }
        this.form.setFieldsValue({ totalMoney: this.formInfo.totalMoney })
        // 调整逻辑
      } else if (this.type === 2) {
        this.getDocDetail(this.getDocumentInfo.documentId)
      }
    },
    getDocDetail (docId) {
      docId && this.pageConfig.checkCoordinateDetail({ documentId: docId }).then(res => {
        console.log('添加结算单=>res', res)
        // 该状态为对账的表单数据填充
        this.$emit('sendForminfo', res.data)
        this.baseInfo = Object({}, this.baseInfo, res.data)
        this.backInfo.partnerId = res.data.partnerId
        this.backInfo.partnerName = res.data.partnerName
        this.backInfo.documentId = res.data.documentId
        this.backInfo.settlementType = res.data.settlementType
        this.form.setFieldsValue({
          documentId: res.data.documentId,
          documentCode: res.data.documentCode,
          settlementType: res.data.settlementType,
          documentName: res.data.documentName,
          settlementPeriodv: this.setDate(res.data.settlementPeriod),
          reqInvoiceDatev: this.setDate(res.data.reqInvoiceDate),
          settlementPeriod: res.data.settlementPeriod,
          reqInvoiceDate: res.data.reqInvoiceDate,
          taxInclude: res.data.taxInclude,
          isInvoice: res.data.isInvoice,
          remark: res.data.remark,
          totalMoney: res.data.totalMoney
        })
        if (this.pageType === 3) {
          this.form.setFieldsValue({
            driverId: res.data.partnerId,
            driverName: res.data.partnerName
          })
        } else {
          this.form.setFieldsValue({
            partnerId: res.data.partnerId,
            partnerName: res.data.partnerName
          })
        }
      })
    },
    setDate (date) {
      if (!date) {
        return undefined
      }
      if (date instanceof Array) {
        date = date.join('-')
        console.log(date)
      }
      return moment(date)
    },
    handleSubmit () {

    },
    // 结算单账期
    onChangPeriodDate (date, dateString) {
      console.log('111', dateString)
      this.form.setFieldsValue({ 'settlementPeriod': dateString })
    },
    // 开票时间
    onChangeReqInvoice (date, dateString) {
      console.log('222', dateString)
      this.form.setFieldsValue({ 'reqInvoiceDate': dateString })
    },
    // 含税问题改变
    taxChange () {

    },
    backMethods () {
      return this.backInfo
    },
    handleChange () {

    },
    // 税点列表
    getTaxPercentsMap () {
      getTaxPercents().then(res => {
        this.taxPercentsMap = res.data
      })
    }
  }

}
</script>
<style lang="less" scoped>

</style>
