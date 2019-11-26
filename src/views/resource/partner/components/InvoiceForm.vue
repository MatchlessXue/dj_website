<template>
  <a-form @submit="handleSubmit"
          :form="form"
          class="form">
    <a-form-item>
      <a-input type="hidden"
               v-decorator="['infoId']"></a-input>
    </a-form-item>
    <a-row class="form-row"
           :gutter="16">
      <a-col :xl="6"
             :lg="6"
             :md="12"
             :sm="24">
        <a-form-item label="公司名称">
          <!-- <a-input placeholder="请输入公司名称" v-decorator="[ 'name', {rules: [{ required: true, message: '请输入公司名称', whitespace: true}]} ]" /> -->
          <a-auto-complete :dataSource="dataSource"
                           @select="onSelect"
                           @search="handleSearch"
                           v-decorator="['companyName', {rules: [{ message: `最多可输入50个字符`, whitespace: true, max: 50}]}]"
                           placeholder="请输入公司名称" />
        </a-form-item>
      </a-col>
      <a-col :xl="6"
             :lg="6"
             :md="12"
             :sm="24">
        <a-form-item label="公司电话">
          <a-input v-decorator="['tel', {rules: [{ whitespace: true, validator: validateTelNumber }]}]"
                   placeholder="请输入公司电话" />
        </a-form-item>
      </a-col>
      <a-col :xl="6"
             :lg="6"
             :md="12"
             :sm="24">
        <a-form-item label="统一社会信用代码">
          <a-input v-decorator="['creditCode', {rules: [{ validator: validateCreditCode }] }]"
                   placeholder="请输入统一社会信用代码或注册号" maxlength="18"/>
        </a-form-item>
      </a-col>
      <a-col :xl="6"
             :lg="6"
             :md="12"
             :sm="24">
        <a-form-item label="开户行">
          <a-input-group compact>
            <!-- <a-col :span="5"> -->
            <a-select showSearch
                      optionFilterProp="children"
                      style="width: 60%"
                      placeholder="请选择开户行"
                      v-decorator="['bankId']"
                      :filterOption="bankFilterOption">
              <a-select-option v-for="value in bankByDataStatusMap"
                               :key="value.dictId">{{value.dictName}}</a-select-option>
            </a-select>
            <!-- </a-col>
            <a-col :span="5"> -->
            <a-input style="width: 40%"
                     v-decorator="['bankName', {rules: [{ message: `最多10个字符`, whitespace: true, max: 10}]}]"
                     placeholder="支行名称" />
            <!-- </a-col> -->
          </a-input-group>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row class="form-row"
           :gutter="16">
      <a-col :xl="6"
             :lg="{span: 6}"
             :md="{span: 12}"
             :sm="24">
        <a-form-item label="账号">
          <a-input v-decorator="['bankAccount', {rules: [
            { message: `最多可输入30个字符`, whitespace: true, max: 30}
            ]}]"
                   :maxlength="30"
                   :value="bankAccountValue"
                   @keyup="keyup"
                   placeholder="请输入账号" />
        </a-form-item>
      </a-col>
      <a-col :xl="{span: 12}"
             :lg="12"
             :md="12"
             :sm="24">
        <a-form-item label="注册地址">
          <a-input v-decorator="['address', {rules: [{ message: `最多可输入50个字符`, whitespace: true, max: 50}]}]"
                   placeholder="详细地址（XXX路XXX号XXX室）" />
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<script>
import { getBankByDataStatus } from '@/api/libraries'
import { getInvoiceWithLike } from '@/api/resource/partner'
import { throttle, trim } from 'lodash'
import { validateTelNumber, validateCreditCode } from '@/utils/validate'

export default {
  name: 'InvoiceForm',
  props: {
    info: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      // 校验相关
      validateTelNumber,
      validateCreditCode,

      bankAccountValue: '',
      bankByDataStatusMap: [],
      componeyList: [],
      selectCompony: {},
      dataSource: [],
      form: this.$form.createForm(this)
    }
  },
  watch: {
    info: {
      deep: true,
      handler: function (val) {
        console.log('data update....', val)
        this.$nextTick(() => {
          this.form.setFieldsValue(val)
        })
      }
    },
    selectCompony (val) {
      this.resetSelComponyForm()
    }
  },
  created () {
    this.getBankByDataStatusMap()
  },
  methods: {
    // 查询公司级联列表
    handleSearch: throttle(async function (v) {
      const key = trim(v)
      console.log('value==', v)
      // 重置表单的值
      // if (this.selectCompony && this.selectCompony.infoId) {
      this.selectCompony = { companyName: v }
      // }
      // 查询级联列表
      if (!key) {
        this.dataSource = []
      } else {
        const self = this
        await getInvoiceWithLike({ name: key }).then((res) => {
          // res.data = [{ coopCompanyId: 'aa', coopCompanyId: '可口可乐', creditCode: 'ssss', bankId: '1', address: '虹漕路299号' }]
          const datas = res.data || []
          self.componeyList = res.data
          // 用于级联的下拉列表的显示只能是如下格式
          let source = []
          datas.forEach((val) => {
            source.push({ value: val.infoId, text: val.companyName })
          })
          self.dataSource = source
        })
      }
    }, 500),
    onSelect (value) {
      this.selectCompony = this.getSelCompony(value)
    },
    resetSelComponyForm () {
      const { companyName = '', creditCode = '', tel = '', address = '' } = this.selectCompony
      this.form.setFieldsValue({ companyName, creditCode, tel, address })
    },
    getSelCompony (value) {
      const sel = this.componeyList.filter((val) => {
        return val.infoId === value
      })
      return sel[0] || {}
    },
    // 获取开户行列表
    getBankByDataStatusMap () {
      getBankByDataStatus().then((res) => {
        this.bankByDataStatusMap = res.data
      })
    },
    // 开户行筛选
    bankFilterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    keyup (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log(values)
          console.log(values.bankAccount)
          if (e.key !== 'Backspace') {
            const regex = /([0-9])/
            if (regex.test(e.key)) {
              this.testval = values.bankAccount.replace(/ /g, ``)
              this.testval = this.testval.replace(/([0-9]{4})/g, `$1 `).trim()
            }
          } else {
            this.testval = values.bankAccount
          }
          this.form.setFieldsValue({ 'bankAccount': this.testval })
        }
      })
    },
    // onBankAccountChange (e) {
    //   const { value } = e.target
    //   console.log('value', value)
    //   // const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/
    //   this.bankAccountValue = value.replace(/ /g, '').replace(/([0-9]{4})/g, `$1 `)
    //   console.log('bankAccount', this.bankAccountValue)
    //   this.form.setFieldsValue({ bankAccount: this.bankAccountValue })
    // },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.$notification['error']({
            message: 'Received values of form:',
            description: values
          })
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
