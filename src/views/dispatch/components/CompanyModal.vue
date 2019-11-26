<template>
  <a-modal
    title="承运商信息"
    :width="440"
    :visible="visible"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form :form="form">
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="运输方式"
      >
        <a-select
          labelInValue
          placeholder="请选择运输方式"
          disabled
          v-decorator="['transportType',{initialValue:{key:'1',label:'零担'}} ]"
        >
          <a-select-option value="1" >零担</a-select-option>
          <a-select-option value="2" >整车</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="承运商"
      >
        <a-select
          labelInValue
          placeholder="请选择承运商"
          v-decorator="['company', {rules:[{required: true,message:'请选择承运商'}]} ]"
        >
          <a-select-option
            v-for="opt in partnerOptions"
            :key="opt.partnerId"
            :value="opt.partnerId"
          >{{ opt.partnerName }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="司机姓名"
      >
        <driver-auto-complete
          v-decorator="['driverName', {}]"
          :form="form"
          :driverOptions="driverOptions"
        >
        </driver-auto-complete>
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="司机手机号"
      >
        <a-input
          placeholder="请输入司机手机号"
          v-decorator="['mobile']"
        ></a-input>
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="提货时间"
      >
        <a-date-picker
          v-decorator="['takeTime']"
          :format="'YYYY-MM-DD hh:mm:ss'"
          :showTime="true"
          style="width: 100%"
        />
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="送货时间"
      >
        <a-date-picker
          v-decorator="['deliveryTime']"
          :format="'YYYY-MM-DD hh:mm:ss'"
          :showTime="true"
          style="width: 100%"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import partnerCollection from '../mixins/partner_collection'
import driverCollection from '../mixins/driver_collection'

import DriverAutoComplete from './DriversAutoComplete'

export default {
  name: 'CompanyModal',
  mixins: [driverCollection, partnerCollection],
  components: {
    DriverAutoComplete
  },
  data () {
    return {
      visible: false,
      form: this.$form.createForm(this),
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    }
  },
  mounted () {

  },
  computed: {},
  methods: {
    // 点击确定
    handleOk () {
      this.form.setFieldsValue({ 'transportType': { key: '1', label: '零担' } })

      this.form.validateFields((err, values) => {
        if (!err) {
          this.$emit('ok', values)
          this.visible = false
        }
      })
    },
    handleCancel () {
      this.visible = false
    }

  }
}
</script>
