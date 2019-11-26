<template>
  <div class="form-layout-body">
    <a-modal :visible="visible"
             :title="heading"
             @cancel="$emit('onCancel',visible)"
             :maskClosable="false">
      <template slot="footer">
        <a-button key="back"
                  @click="$emit('onCancel',visible)">返回</a-button>
      </template>
      <a-form :form="form">
        <a-form-item>
          <a-input type="hidden"
                   v-decorator="['companyId']" />
        </a-form-item>

        <a-form-item :labelCol="formItemLayout.labelSingleCol"
                     :wrapperCol="formItemLayout.wrapperSingleCol"
                     label="营业执照扫描件:">
          <viewer>
            <img :src="companyInfo.businessLicenseUrl"
                 key="src"
                 width="300">
          </viewer>
        </a-form-item>
        <a-form-item :labelCol="formItemLayout.labelSingleCol"
                     :wrapperCol="formItemLayout.wrapperSingleCol"
                     label="公司名称：">
          {{companyInfo.companyName}}
        </a-form-item>
        <a-form-item :labelCol="formItemLayout.labelSingleCol"
                     :wrapperCol="formItemLayout.wrapperSingleCol"
                     label="统一社会信用代码：">
          {{companyInfo.creditCode}}
        </a-form-item>
        <a-form-item :labelCol="formItemLayout.labelSingleCol"
                     :wrapperCol="formItemLayout.wrapperSingleCol"
                     label='有效期'>
          {{companyInfo.startDateval}} 至 {{companyInfo.endDateval}}
        </a-form-item>
        <a-form-item :labelCol="formItemLayout.labelSingleCol"
                     :wrapperCol="formItemLayout.wrapperSingleCol"
                     label="法人姓名：">
          {{companyInfo.legalPerson}}
        </a-form-item>
        <a-form-item :labelCol="formItemLayout.labelSingleCol"
                     :wrapperCol="formItemLayout.wrapperSingleCol"
                     label="证件编号：">
          {{companyInfo.taxIdentification}}
        </a-form-item>
        <a-form-item :labelCol="formItemLayout.labelSingleCol"
                     :wrapperCol="formItemLayout.wrapperSingleCol"
                     label="公司类型：">
          {{companyInfo.CompanyTypeName}}
        </a-form-item>
        <a-form-item :labelCol="formItemLayout.labelSingleCol"
                     :wrapperCol="formItemLayout.wrapperSingleCol"
                     label="公司地址：">
          {{companyInfo.address}}
        </a-form-item>
        <a-form-item :labelCol="formItemLayout.labelSingleCol"
                     :wrapperCol="formItemLayout.wrapperSingleCol"
                     label="所属行业：">
          {{companyInfo.IndustryTypeName}}
        </a-form-item>
        <a-form-item :labelCol="formItemLayout.labelSingleCol"
                     :wrapperCol="formItemLayout.wrapperSingleCol"
                     label="注册资本：">
          {{companyInfo.registerCapital}}
        </a-form-item>
        <a-form-item :labelCol="formItemLayout.labelSingleCol"
                     :wrapperCol="formItemLayout.wrapperSingleCol"
                     label="成立日期：">
          {{companyInfo.registerTime}}
        </a-form-item>
        <a-form-item :labelCol="formItemLayout.labelSingleCol"
                     :wrapperCol="formItemLayout.wrapperSingleCol"
                     label="营业期止：">
          {{companyInfo.businessEndDate}}
        </a-form-item>
        <a-form-item :labelCol="formItemLayout.labelSingleCol"
                     :wrapperCol="formItemLayout.wrapperSingleCol"
                     label="经营状态：">
          {{companyInfo.BusinessStatusTypeName}}
        </a-form-item>
        <a-form-item :labelCol="formItemLayout.labelSingleCol"
                     :wrapperCol="formItemLayout.wrapperSingleCol"
                     label="经营范围：">
          {{companyInfo.businessScope}}
        </a-form-item>
        <hr>
        <a-form-item :labelCol="formItemLayout.labelSingleCol"
                     :wrapperCol="formItemLayout.wrapperSingleCol"
                     label="审批结果：">
          {{companyInfo.verifiedStatusval}}
        </a-form-item>
        <a-form-item :labelCol="formItemLayout.labelSingleCol"
                     :wrapperCol="formItemLayout.wrapperSingleCol"
                     label="审批备注：">
          {{companyInfo.approvalNote}}
        </a-form-item>
        <a-form-item :labelCol="formItemLayout.labelSingleCol"
                     :wrapperCol="formItemLayout.wrapperSingleCol"
                     label="提交时间：">
          {{companyInfo.recTimeval}}
        </a-form-item>
        <a-form-item :labelCol="formItemLayout.labelSingleCol"
                     :wrapperCol="formItemLayout.wrapperSingleCol"
                     label="审批时间：">
          {{companyInfo.approveTimeval}}
        </a-form-item>
      </a-form>
    </a-modal>
  </div>

  <!-- <a-row class="form-row">
          <a-col :lg="12" :md="12" :sm="24"></a-col>

          <a-col :lg="12" :md="12" :sm="24"></a-col>
  </a-row>-->
</template>
<script>
import { getCompanyType, getIndustryType, getBusinessStatusType } from '@/api/libraries'
// import { getBusinessLicenseInfoWithJson } from '@/api/common'
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
      companyInfo: {},
      myVisible: this.visible,
      formItemLayout,
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
        this.$nextTick(() => {
          // this.form.setFieldsValue(val)
          let queryParam = {}
          queryParam.companyId = val.companyId
          getCompanyDetail(queryParam).then(res => {
            console.log('res', res)
            this.companyInfo = res.data
            // res.data.ValDate = [moment(res.data.startDate, 'YYYY-MM-DD'), moment(res.data.endDate, 'YYYY-MM-DD')]
            // if (res.data.businessEndDate) { res.data.businessEndDateval = moment(res.data.businessEndDate, 'YYYY-MM-DD') }
            // if (res.data.registerTime) { res.data.registerTimeval = moment(res.data.registerTime, 'YYYY-MM-DD') }
            if (res.data.recTime) { res.data.recTimeval = moment(res.data.recTime).format('YYYY-MM-DD HH:mm') }
            if (res.data.approveTime) { res.data.approveTimeval = moment(res.data.approveTime).format('YYYY-MM-DD HH:mm') } else {
              let myDate = new Date(res.data.recTime)
              let dayTime = 1 * 24 * 60 * 60 * 1000 // 参数天数的时间戳
              let nowTime = myDate.getTime() // 当天的时间戳
              let t = new Date(nowTime + dayTime) // 把两个时间戳转换成普通时间
              res.data.approveTimeval = moment(t).format('YYYY-MM-DD HH:mm')
            }
            if (res.data.endDate) { res.data.endDateval = moment(res.data.endDate).format('YYYY-MM-DD') }
            if (res.data.startDate) { res.data.startDateval = moment(res.data.startDate).format('YYYY-MM-DD') }
            if (res.data.verifiedStatus === 3) {
              res.data.verifiedStatusval = '审批通过'
            }
            if (res.data.verifiedStatus === 4) {
              res.data.verifiedStatusval = '审批驳回'
            }
            if (this.CompanyType && this.companyInfo.companyType) {
              this.companyInfo.CompanyTypeName = this.CompanyType.find(list => list.dictId === this.companyInfo.companyType).dictName
            }
            if (this.IndustryType && this.companyInfo.industry) {
              this.companyInfo.IndustryTypeName = this.IndustryType.find(list => list.dictId === this.companyInfo.industry).dictName
            }
            if (this.BusinessStatusType && this.companyInfo.businessStatus) {
              this.companyInfo.BusinessStatusTypeName = this.BusinessStatusType.find(list => list.dictId === this.companyInfo.businessStatus).dictName
            }
            this.form.setFieldsValue(res.data)
            // return res.data
          })
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
    // 窗口关闭
    handleclose (e) {
      this.form.resetFields()
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
