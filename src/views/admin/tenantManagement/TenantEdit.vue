<template>
  <div class="form-layout-body">
    <a-spin :spinning="confirmLoading">
      <back-btn title="返回上一级" />
      <a-card :bordered="false"
              class="card-container">
        <h2 style="font-weight:bold;font-size:16px">编辑企业信息</h2>
        <a-form :form="form">
          <a-form-item :labelCol="labelCol2"
                       :wrapperCol="wrapperCol2"
                       label='营业执照扫描件'>
            <img :src="companyInfo.businessLicenseUrl"
                 class="codeimg" />
            <a href="javascript:;"
               @click="handleGetLicenseInfo">识别营业执照</a>
          </a-form-item>
          <a-form-item :labelCol="labelCol2"
                       :wrapperCol="wrapperCol2"
                       label='提交时间'>
            {{companyInfo.recTimeval}}
          </a-form-item>

          <a-form-item :labelCol="labelCol2"
                       :wrapperCol="wrapperCol2"
                       label='审批时间'>
            {{companyInfo.approveTimeval}}
          </a-form-item>
          <a-form-item :labelCol="labelCol2"
                       :wrapperCol="wrapperCol2"
                       label='超管账号'>
            <!-- {{15026389054}} -->
            {{companyInfo.adminAccount}}
          </a-form-item>
          <a-col :md="8"
                 :sm="24">
            <a-form-item :labelCol="labelCol"
                         :wrapperCol="wrapperCol"
                         label='公司名称'>
              <a-input placeholder='请输入公司名称'
                       v-decorator="[ 'companyName', {rules: [{ required: true, message: '公司名称不能为空'},{required: false,
          validator: validateNickName , message: '请输入正确的公司名称'}]} ]" />
            </a-form-item>
          </a-col>
          <a-col :md="8"
                 :sm="24">
            <a-form-item :labelCol="labelCol"
                         :wrapperCol="wrapperCol"
                         label='统一社会信用代码'>
              <a-input placeholder='请输入统一社会信用代码'
                       v-decorator="[ 'creditCode', {rules: [{ required: true, message: '统一社会信用代码不能为空'},{required: false,
          validator: validateCreditCode}]} ]" />
            </a-form-item>
          </a-col>
          <a-col :md="8"
                 :sm="24">
            <a-form-item :labelCol="labelCol"
                         :wrapperCol="wrapperCol"
                         label='有效期'>
              <a-range-picker v-decorator="['ValDate', {rules: [{ required: true, message: '有效期为空'}]}]" />
            </a-form-item>
          </a-col>
          <a-col :md="8"
                 :sm="24">
            <a-form-item :labelCol="labelCol"
                         :wrapperCol="wrapperCol"
                         label='法人姓名'>
              <a-input placeholder='请输入法人姓名'
                       v-decorator="['legalPerson']" />
            </a-form-item>
          </a-col>
          <a-col :md="8"
                 :sm="24">
            <a-form-item :labelCol="labelCol"
                         :wrapperCol="wrapperCol"
                         label='证件编号'>
              <a-input placeholder='请输入证件编号'
                       v-decorator="['taxIdentification']" />
            </a-form-item>
          </a-col>
          <a-col :md="8"
                 :sm="24">
            <a-form-item :labelCol="labelCol"
                         :wrapperCol="wrapperCol"
                         label='公司类型'>
              <!-- 2 -->
              <a-select placeholder="请选择公司类型"
                        v-decorator="['companyType']">
                <a-select-option v-for="item in CompanyType"
                                 :key="item.dictId"
                                 :value="item.dictId">{{item.dictName}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8"
                 :sm="24">
            <a-form-item :labelCol="labelCol"
                         :wrapperCol="wrapperCol"
                         label='公司地址'>
              <a-input placeholder='请输入公司地址'
                       v-decorator="['address']" />
            </a-form-item>
          </a-col>
          <a-col :md="8"
                 :sm="24">
            <a-form-item :labelCol="labelCol"
                         :wrapperCol="wrapperCol"
                         label='所属行业'>
              <!-- 1 -->
              <a-select placeholder="请选择所属行业"
                        v-decorator="['industry']">
                <a-select-option v-for="item in IndustryType"
                                 :key="item.dictId"
                                 :value="item.dictId">{{item.dictName}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8"
                 :sm="24">
            <a-form-item :labelCol="labelCol"
                         :wrapperCol="wrapperCol"
                         label='注册资本'>
              <a-input placeholder='请输入注册资本'
                       v-decorator="['registerCapital']" />
            </a-form-item>
          </a-col>
          <a-col :md="8"
                 :sm="24">
            <a-form-item :labelCol="labelCol"
                         :wrapperCol="wrapperCol"
                         label='成立日期'>
              <a-date-picker placeholder='请输入成立日期'
                             v-decorator="['registerTimeval']" />
            </a-form-item>
          </a-col>
          <a-col :md="8"
                 :sm="24">
            <a-form-item :labelCol="labelCol"
                         :wrapperCol="wrapperCol"
                         label='营业期止'>
              <a-date-picker placeholder='请输入营业期止'
                             v-decorator="['businessEndDateval']" />
            </a-form-item>
          </a-col>
          <a-col :md="8"
                 :sm="24">
            <a-form-item :labelCol="labelCol"
                         :wrapperCol="wrapperCol"
                         label='经营状态'>
              <a-select placeholder="请选择经营状态"
                        v-decorator="['businessStatus']">
                <a-select-option v-for="item in BusinessStatusType"
                                 :key="item.dictId"
                                 :value="item.dictId">{{item.dictName}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8"
                 :sm="24">
            <a-form-item :labelCol="labelCol"
                         :wrapperCol="wrapperCol"
                         label='经营范围'>
              <a-textarea placeholder='请输入经营范围'
                          v-decorator="['businessScope']"
                          :rows="4" />
            </a-form-item>
          </a-col>
        </a-form>
      </a-card>
      <footer-tool-bar align="center">
        <a-button @click="handleCancel">取消</a-button> &nbsp;&nbsp;
        <a-button type="primary"
                  @click="handleSave"
                  :loading="loading">
          保存
        </a-button>
      </footer-tool-bar>
    </a-spin>
  </div>
</template>

<script>
import BackBtn from '@/components/BackBtn'
import { validateNickName, validateCreditCode } from '@/utils/validate'
import { getCompanyType, getIndustryType, getBusinessStatusType } from '@/api/libraries'
import FooterToolBar from '@/components/FooterToolbar'
import { getCompanyDetail, getCompanyUpdate } from '@/api/account.js'
import { getBusinessLicenseInfoWithJson } from '@/api/common'
import moment from 'moment'
export default {
  name: 'TenantEdit',
  props: {
    selectedId: {
      type: String,
      default: ''
    }
  },
  components: {
    BackBtn,
    FooterToolBar
  },
  data () {
    const { id } = this.$route.params
    return {
      id,
      confirmLoading: false,
      companyInfo: {},
      validateNickName,
      validateCreditCode,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      labelCol2: {
        xs: { span: 12 },
        md: { span: 2 }
      },
      wrapperCol2: {
        xs: { span: 12 },
        md: { span: 22 }
      },
      CompanyType: [],
      BusinessStatusType: [],
      IndustryType: [],
      form: this.$form.createForm(this),
      loading: false
      // CompanyType: []
    }
  },
  created () {
    // this.fetchPartList()
    // this.fetchRoleList()
    let queryParam = {}
    queryParam.companyId = this.id
    getCompanyDetail(queryParam).then(res => {
      console.log('res', res)
      this.companyInfo = res.data
      res.data.ValDate = [moment(res.data.startDate, 'YYYY-MM-DD'), moment(res.data.endDate, 'YYYY-MM-DD')]
      if (res.data.businessEndDate) { res.data.businessEndDateval = moment(res.data.businessEndDate, 'YYYY-MM-DD') }
      if (res.data.registerTime) { res.data.registerTimeval = moment(res.data.registerTime, 'YYYY-MM-DD') }
      if (res.data.recTime) { res.data.recTimeval = moment(res.data.recTime).format('YYYY-MM-DD HH:mm') }
      if (res.data.approveTime) { res.data.approveTimeval = moment(res.data.approveTime).format('YYYY-MM-DD HH:mm') } else {
        let myDate = new Date(res.data.recTime)
        let dayTime = 1 * 24 * 60 * 60 * 1000 // 参数天数的时间戳
        let nowTime = myDate.getTime() // 当天的时间戳
        let t = new Date(nowTime + dayTime) // 把两个时间戳转换成普通时间
        res.data.approveTimeval = moment(t).format('YYYY-MM-DD HH:mm')
      }
      this.form.setFieldsValue(res.data)
      // return res.data
    })
  },
  mounted () {
    this.init()
  },
  computed: {
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
      console.log('handleGetLicenseInfo')
      if (this.companyInfo.businessLicenseUrl) {
        this.confirmLoading = true
        getBusinessLicenseInfoWithJson({ url: this.companyInfo.businessLicenseUrl }).then(res => {
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
              businessScope: res.data.business }
            this.form.setFieldsValue(datainfo)
          }
          this.confirmLoading = false
        }).catch(() => {
          this.confirmLoading = false
        })
      }
    },
    handleCancel () {
      // this.$confirm({
      //   title: '系统提示',
      //   content: '您确定要取消编辑并回到列表页吗',
      //   onOk: () => {
      this.$router.back()
      //   },
      //   onCancel () { }
      // })
    },
    handleSave () {
      this.form.validateFields((err, values) => {
        if (!err) {
          if (values.ValDate) { values.startDate = moment(values.ValDate[0]).format('YYYY-MM-DD') }
          if (values.ValDate) { values.endDate = moment(values.ValDate[1]).format('YYYY-MM-DD') }
          if (values.registerTimeval) { values.registerTime = moment(values.registerTimeval).format('YYYY-MM-DD') }
          if (values.businessEndDateval) { values.businessEndDate = moment(values.businessEndDateval).format('YYYY-MM-DD') }
          values.ValDate = null
          values.registerTimeval = null
          values.businessEndDateval = null
          values.companyId = this.id
          console.log(values)
          getCompanyUpdate(values).then(res => {
            console.log(res)
            if (res.code === 0) {
              this.$message.success(res.message)
              this.$router.back()
            } else {
              this.$message.error(res.message)
            }
          })
        }
      })
    }

  }
}
</script>
<style>
.subdatediv {
  float: right;
  width: 200px;
}
.codeimg {
  width: 100px;
  vertical-align: initial;
}
</style>
