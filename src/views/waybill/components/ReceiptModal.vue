<template>
  <a-card title="回单信息" :bordered="false">

    <a-form @submit="handleSubmit"
            :form="form"
            layout="vertical"
            class="form">
      <a-row class="form-row"
             :gutter="10">
        <a-col :sm="6">
          <a-form-item label="回单类型">
            <a-select
                      v-decorator="['receiptType']"
                      placeholder="请选择回单类型"
                      >
              <a-select-option v-for="receiptType in receiptTypeList"
                               :key="receiptType.dictId">{{receiptType.dictName}}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :sm="6">
          <a-form-item label="回单份数">
            <a-input v-decorator="['receiptAmount']"
                            :max='9999'
                            :min='0'
                            style="width: 100%"
                            placeholder="请输入回单份数"
                            :decimalSeparator="'0'" />
          </a-form-item>
        </a-col>
        <a-col :sm="6">
          <a-form-item label="回单要求时间">
            <a-date-picker v-decorator="['reqReturnDate']"
                           :format="'YYYY-MM-DD'"
                           :showTime="false"
                           style="width: 100%"
                           placeholder="请选择回单要求时间" />
          </a-form-item>
        </a-col>
        <a-col :sm="6">
        </a-col>
      </a-row>
    </a-form>
  </a-card>
</template>

<script>
import moment from 'moment'
import { deepClone } from '@/utils/util'
import {
  getReceiptType
} from '@/api/libraries'
export default {
  name: 'ReceiptModal',
  props: {
    receiptdata: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  watch: {
    receiptdata: {
      deep: true,
      handler: function (val) {
        this.model = deepClone(val)
        if (this.model.reqReturnDate) { this.model.reqReturnDate = moment(this.model.reqReturnDate) }
        const { receiptType, receiptAmount, reqReturnDate } = this.model
        this.form.setFieldsValue({ receiptType, receiptAmount, reqReturnDate })
      }
    }
  },
  data () {
    return {
      receiptTypeList: [],
      form: this.$form.createForm(this),
      visible: false,
      model: {}
    }
  },
  mounted () {
    this.getReceiptTypeList()
  },
  methods: {
    handleGetdata () { // 获取组件数据
      // return this.model
      var tempdata = {}
      this.form.validateFields((err, values) => {
        if (!err) {
          tempdata = deepClone(values)
          if (values.reqReturnDate) {
            tempdata.reqReturnDate = values.reqReturnDate.format('YYYY-MM-DD')
          }
        }
      })
      // return deepClone(this.model)
      return tempdata
    },
    // 获取回单类型
    getReceiptTypeList () {
      getReceiptType().then(res => {
        this.receiptTypeList = res.data
      })
    },
    handleSubmit () {

    }
  }
}
</script>
