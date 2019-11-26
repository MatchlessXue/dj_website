<template>
  <div class="form-layout-body">
    <a-modal :visible="visible"
             :title="heading"
             @cancel="$emit('onCancel',visible)"
             :maskClosable="false">
      <template slot="footer">
        <a-button key="back"
                  @click="$emit('onCancel',visible)">返回</a-button>
        <a-button key="rejectSubmit"
                  type="primary"
                  :loading="loading"
                  @click="onOkForReject()">驳回</a-button>
        <a-button key="passSubmit"
                  type="primary"
                  :loading="loading"
                  @click="onOkForPass()">通过</a-button>
      </template>
      <a-spin :spinning="confirmLoading">
        <a-form :form="form">
          <a-form-item>
            <a-input type="hidden"
                     v-decorator="['companyId']" />
          </a-form-item>

          <a-form-item :labelCol="formItemLayout.labelSingleCol"
                       :wrapperCol="formItemLayout.wrapperSingleCol"
                       label="营业执照扫描件:">
            <viewer>
              <img :src="certUrl"
                   key="src"
                   width="300">
              <a href="javascript:;"
                 @click="handleGetLicenseInfo">识别营业执照</a>
            </viewer>
          </a-form-item>
          <a-form-item :labelCol="formItemLayout.labelSingleCol"
                       :wrapperCol="formItemLayout.wrapperSingleCol"
                       label="公司名称：">
            <a-input placeholder="请输入公司名称"
                     v-decorator="[ 'companyName', {rules: [{ required: true, message: '公司名称不能为空'},{required: false,
          validator: validateNickName , message: '请输入正确的公司名称'}]} ]" />
          </a-form-item>
          <a-form-item :labelCol="formItemLayout.labelSingleCol"
                       :wrapperCol="formItemLayout.wrapperSingleCol"
                       label="统一社会信用代码：">
            <a-input placeholder="请输入统一社会信用代码"
                     v-decorator="['creditCode',
      {rules: [{ required: true, message: '统一社会信用代码不能为空'},{required: false,
          validator: validateCreditCode}]} ]" />
          </a-form-item>
          <a-form-item :labelCol="formItemLayout.labelSingleCol"
                       :wrapperCol="formItemLayout.wrapperSingleCol"
                       label='有效期'>
            <a-range-picker v-decorator="['ValDate',
          {rules: [{ required: true, message: '有效期不能为空' }]}]" />
          </a-form-item>
          <a-form-item :labelCol="formItemLayout.labelSingleCol"
                       :wrapperCol="formItemLayout.wrapperSingleCol"
                       label="法人姓名：">
            <a-input placeholder="请输入法人姓名"
                     v-decorator="['legalPerson']" />
          </a-form-item>
          <a-form-item :labelCol="formItemLayout.labelSingleCol"
                       :wrapperCol="formItemLayout.wrapperSingleCol"
                       label="证件编号：">
            <a-input placeholder="请输入证件编号"
                     v-decorator="['taxIdentification']" />
          </a-form-item>
          <a-form-item :labelCol="formItemLayout.labelSingleCol"
                       :wrapperCol="formItemLayout.wrapperSingleCol"
                       label="公司类型：">
            <!-- <a-input placeholder="请输入公司类型"
                   v-decorator="['companyType']" /> -->
            <a-select placeholder="请选择公司类型"
                      v-decorator="['companyType']">
              <a-select-option v-for="item in CompanyType"
                               :key="item.dictId"
                               :value="item.dictId">{{item.dictName}}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item :labelCol="formItemLayout.labelSingleCol"
                       :wrapperCol="formItemLayout.wrapperSingleCol"
                       label="公司地址：">
            <a-input placeholder="请输入公司地址"
                     v-decorator="['address']" />
          </a-form-item>
          <a-form-item :labelCol="formItemLayout.labelSingleCol"
                       :wrapperCol="formItemLayout.wrapperSingleCol"
                       label="所属行业：">
            <!-- <a-input placeholder="请输入业务类型"
                   v-decorator="['industry']" /> -->
            <a-select placeholder="请选择所属行业"
                      v-decorator="['industry']">
              <a-select-option v-for="item in IndustryType"
                               :key="item.dictId"
                               :value="item.dictId">{{item.dictName}}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item :labelCol="formItemLayout.labelSingleCol"
                       :wrapperCol="formItemLayout.wrapperSingleCol"
                       label="注册资本：">
            <a-input placeholder="请输入注册资本"
                     v-decorator="['registerCapital']" />
          </a-form-item>
          <a-form-item :labelCol="formItemLayout.labelSingleCol"
                       :wrapperCol="formItemLayout.wrapperSingleCol"
                       label="成立日期：">
            <a-date-picker placeholder="请输入成立日期"
                           v-decorator="['registerTimeval']" />
          </a-form-item>
          <a-form-item :labelCol="formItemLayout.labelSingleCol"
                       :wrapperCol="formItemLayout.wrapperSingleCol"
                       label="营业期止：">
            <a-date-picker placeholder="请输入营业期止"
                           v-decorator="['businessEndDateval']" />
          </a-form-item>
          <a-form-item :labelCol="formItemLayout.labelSingleCol"
                       :wrapperCol="formItemLayout.wrapperSingleCol"
                       label="经营状态：">
            <!-- <a-input placeholder="请输入经营状态"
                   v-decorator="['businessStatus']" /> -->
            <a-select placeholder="请选择经营状态"
                      v-decorator="['businessStatus']">
              <a-select-option v-for="item in BusinessStatusType"
                               :key="item.dictId"
                               :value="item.dictId">{{item.dictName}}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item :labelCol="formItemLayout.labelSingleCol"
                       :wrapperCol="formItemLayout.wrapperSingleCol"
                       label="经营范围：">
            <a-input placeholder="请输入经营范围"
                     v-decorator="['businessScope']" />
          </a-form-item>
          <hr>
          <a-form-item :labelCol="formItemLayout.labelSingleCol"
                       :wrapperCol="formItemLayout.wrapperSingleCol"
                       label="审批备注：">
            <a-input placeholder="请输入审批备注"
                     v-decorator="['approvalNote']" />
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>
  </div>

  <!-- <a-row class="form-row">
          <a-col :lg="12" :md="12" :sm="24"></a-col>

          <a-col :lg="12" :md="12" :sm="24"></a-col>
  </a-row>-->
</template>
<script>
import { validateNickName, validateCreditCode } from '@/utils/validate'
import { getCompanyType, getIndustryType, getBusinessStatusType } from '@/api/libraries'
import { getBusinessLicenseInfoWithJson } from '@/api/common'
import moment from 'moment'
import { getCompanyDetail } from '@/api/account.js'
const formItemLayout = {
  labelSingleCol: { span: 8 },
  wrapperSingleCol: { span: 13 }
}
export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    visible: {
      type: Boolean,
      default: false
    },
    heading: {
      type: String,
      default: ''
    },
    approveRecord: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      myVisible: this.visible,
      formItemLayout,
      validateNickName,
      validateCreditCode,
      confirmLoading: false,
      companyInfo: {},
      form: this.$form.createForm(this),
      CompanyType: [],
      BusinessStatusType: [],
      IndustryType: [],
      queryParam: {} // 查询参数
    }
  },
  mounted () {
    this.init()
  },
  computed: {
    certUrl () {
      return this.approveRecord.companyCertifications && this.approveRecord.companyCertifications[0] && this.approveRecord.companyCertifications[0].certUrl
    }
  },
  watch: {
    approveRecord: {
      deep: true,
      handler: function (val) {
        console.log('watch-val', val)
        let that = this
        this.$nextTick(() => {
          // this.form.setFieldsValue(val)
          if (val && val.companyId) {
            let queryParam = {}
            queryParam.companyId = val.companyId
            getCompanyDetail(queryParam).then(res => {
              that.companyInfo = res.data
              var myDate = new Date()
              // res.data.ValDate = [moment(res.data.startDate, 'YYYY-MM-DD'), moment(res.data.endDate, 'YYYY-MM-DD')]
              // let myDate = new Date(res.data.recTime)
              let dayTime = 1 * 24 * 60 * 60 * 1000 * 365 // 参数天数的时间戳
              let nowTime = myDate.getTime() // 当天的时间戳
              let t = new Date(nowTime + dayTime) // 把两个时间戳转换成普通时间
              res.data.approveTimeval = moment(t).format('YYYY-MM-DD HH:mm')
              res.data.ValDate = [moment(myDate, 'YYYY-MM-DD'), moment(t, 'YYYY-MM-DD')]
              if (res.data.businessEndDate) { res.data.businessEndDateval = moment(res.data.businessEndDate, 'YYYY-MM-DD') }
              if (res.data.registerTime) { res.data.registerTimeval = moment(res.data.registerTime, 'YYYY-MM-DD') }
              if (res.data.recTime) { res.data.recTimeval = moment(res.data.recTime).format('YYYY-MM-DD HH:mm') }
              if (res.data.approveTime) { res.data.approveTimeval = moment(res.data.approveTime).format('YYYY-MM-DD HH:mm') }
              if (res.data.endDate) { res.data.endDateval = moment(res.data.endDate).format('YYYY-MM-DD HH:mm') }
              if (res.data.startDate) { res.data.startDateval = moment(res.data.startDate).format('YYYY-MM-DD HH:mm') }
              // if (this.CompanyType && this.companyInfo.companyType) {
              //   this.companyInfo.CompanyTypeName = this.CompanyType.find(list => list.dictId === this.companyInfo.companyType).dictName
              // }
              // if (this.IndustryType && this.companyInfo.industry) {
              //   this.companyInfo.IndustryTypeName = this.IndustryType.find(list => list.dictId === this.companyInfo.industry).dictName
              // }
              // if (this.BusinessStatusType && this.companyInfo.businessStatus) {
              //   this.companyInfo.IndustryTypeName = this.BusinessStatusType.find(list => list.dictId === this.companyInfo.businessStatus).dictName
              // }
              console.log('res', res)
              this.form.setFieldsValue(res.data)
              // return res.data
            })
          }
        })
      }
    }
  },
  methods: {
    init () {
      getCompanyType().then((res) => {
        this.CompanyType = res.data
      })
      getIndustryType().then((res) => {
        this.IndustryType = res.data
      })
      getBusinessStatusType().then((res) => {
        this.BusinessStatusType = res.data
      })
      // this.getCustomBizTypesMap()
    },
    handleGetLicenseInfo () {
      // console.log('handleGetLicenseInfo')
      // console.log(this.companyInfo.businessLicenseUrl)
      // console.log(this.approveRecord)
      let url = this.approveRecord.companyCertifications && this.approveRecord.companyCertifications[0] && this.approveRecord.companyCertifications[0].certUrl
      // console.log(url)

      if (url) {
        this.confirmLoading = true
        getBusinessLicenseInfoWithJson({ url: url }).then(res => {
          console.log(res)
          if (res.code === 0) {
            let datainfo = {
              creditCode: res.data.reg_num,
              companyName: res.data.name,
              legalPerson: res.data.person,
              registerTimeval: res.data.establish_date,
              businessEndDateval: res.data.valid_period,
              address: res.data.address,
              registerCapital: res.data.captial,
              businessScope: res.data.business
            }
            this.form.setFieldsValue(datainfo)
          }
          this.confirmLoading = false
        }).catch(() => {
          this.confirmLoading = false
        })
      }
    },
    // 窗口关闭
    handleclose (e) {
      this.form.resetFields()
    },
    onOkForReject () {
      let values = this.form.getFieldsValue()
      // let pm = {}
      // pm.approvalNote = this.form.getFieldValue('approvalNote')
      values.companyId = this.approveRecord.companyId
      this.$emit('onOkForReject', values)
    },
    onOkForPass () {
      this.form.validateFields((err, values) => {
        // console.log(this.approveRecord)
        // console.log(values)
        if (!err) {
          if (values.ValDate) { values.startDate = moment(values.ValDate[0]).format('YYYY-MM-DD') }
          if (values.ValDate) { values.endDate = moment(values.ValDate[1]).format('YYYY-MM-DD') }
          if (values.registerTimeval) { values.registerTime = moment(values.registerTimeval).format('YYYY-MM-DD') }
          if (values.businessEndDateval) { values.businessEndDate = moment(values.businessEndDateval).format('YYYY-MM-DD') }
          values.ValDate = null
          values.registerTimeval = null
          values.businessEndDateval = null
          values.companyId = this.approveRecord.companyId
          // console.log(values)
          this.$emit('onOkForPass', values)
        }
      })
    },
    onChange (value) {
      console.log('changed', value)
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    }
  }
}
</script>
<style>
.ant-calendar-picker {
  width: 100%;
}
</style>
