<template>
  <a-modal
    title="车辆信息"
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
          v-decorator="['transportType', { rules: [{required: true, message:'请选择运输方式'}]} ]"
        >
          <a-select-option value="1">零担</a-select-option>
          <a-select-option value="2">整车</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="车牌号"
      >
        <truck-auto-complete
          v-decorator="[ 'truckNo', {rules:[{required: true,message:'请输入车牌号'}]} ]"
          :form="form"
          :truckOptions="truckOptions"></truck-auto-complete>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="车辆类型"
      >
        <a-select
          placeholder="请选择车辆类型"
          v-decorator="['truckType', {rules:[{required: true,message:'请选择车辆类型'}]} ]"
        >
          <a-select-option
            v-for="tp in truckTypeMap"
            :key="tp.dictId"
          >{{tp.dictName}}</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="车长"
      >
        <a-input
          placeholder="请输入车长"
          addonAfter="m"
          v-decorator="['truckLength', {rules:[{required: true,message:'请输入车长'}, { pattern: new RegExp(/^(0|[1-9][0-9]*)(\.[0-9]*)?$/,'g'),message: '请输入数字'}]} ]"
        />
      </a-form-item>

      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="载重"
      >
        <a-input
          placeholder="请输入载重"
          addonAfter="kg"
          v-decorator="['weightLoad', {rules:[{required: true,message:'请输入载重'}, { pattern: new RegExp(/^(0|[1-9][0-9]*)(\.[0-9]*)?$/,'g'),message: '请输入数字'}]} ]"
        ></a-input>
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="载方"
      >
        <a-input
          placeholder="请输入载方"
          addonAfter="m³"
          v-decorator="['volumeLoad', {rules:[{required: true,message:'请输入载方'}, { pattern: new RegExp(/^(0|[1-9][0-9]*)(\.[0-9]*)?$/, 'g'),message: '请输入数字'}]} ]"
        ></a-input>
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="司机姓名"
      >
        <driver-auto-complete
          v-decorator="['driverName', {}]"
          :form="form"
          :driverOptions="driverOptions">
        </driver-auto-complete>
      </a-form-item>
      <a-form-item
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
        label="司机手机号"
      >
        <a-input
          placeholder="请输入司机手机号"
          v-decorator="['mobile',{rules:[{ pattern: new RegExp(/^[1-9]\d{10}$/, 'g'),message: '请输入合法手机号'}]} ]"
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
// import pick from 'lodash.pick'
import librariesBase from '@views/mixins/libraries_base' // 为获取车辆类型
import driverCollection from '../mixins/driver_collection'
import truckCollection from '../mixins/truck_collection'

import DriverAutoComplete from './DriversAutoComplete'
import TruckAutoComplete from './TruckAutoComplete'

export default {
  name: 'TruckModal',
  mixins: [ librariesBase, driverCollection, truckCollection ],
  components: {
    DriverAutoComplete,
    TruckAutoComplete
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
  created () {
    this.getTruckTypeByDataStatusMap() // 车辆类型
  },
  computed: {},
  methods: {
    // 点击确定
    handleOk () {
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

<style lang="less" scoped>
.truck-auto-select {
  .truck-auto-item {
    display: flex;
    flex-wrap: wrap;
    & > div {
      width: 33%;
    }
  }
}
</style>
