<template>
  <a-form class="form">
    <a-form-item label="GPS设备号"
                 :labelCol="labelCol"
                 :wrapperCol="wrapperCol">
      {{viewdata.deviceNumber}}
    </a-form-item>

    <a-form-item label="类型"
                 :labelCol="labelCol"
                 :wrapperCol="wrapperCol">
      {{viewdata.deviceTypeName}}
    </a-form-item>
    <a-form-item label="厂商"
                 :labelCol="labelCol"
                 :wrapperCol="wrapperCol">
      {{viewdata.brandName}}
    </a-form-item>
    <a-form-item label="所属伙伴"
                 :labelCol="labelCol"
                 :wrapperCol="wrapperCol">
      {{viewdata.partner?viewdata.partner.partnerName:''}}
    </a-form-item>
    <a-form-item label="状态"
                 :labelCol="labelCol"
                 :wrapperCol="wrapperCol">
      {{viewdata.bizStatusName}}
    </a-form-item>
    <a-form-item label="公钥"
                 :labelCol="labelCol"
                 :wrapperCol="wrapperCol">
      {{viewdata.publicKey}}
    </a-form-item>
    <a-form-item label="秘钥"
                 :labelCol="labelCol"
                 :wrapperCol="wrapperCol">
      {{viewdata.privateKey}}
    </a-form-item>
    <a-form-item label="URL"
                 :labelCol="labelCol"
                 :wrapperCol="wrapperCol">
      {{viewdata.gpsApi}}
    </a-form-item>
    <a-form-item label="备注"
                 :labelCol="labelCol"
                 :wrapperCol="wrapperCol">
      {{viewdata.remark}}
    </a-form-item>
  </a-form>
</template>

<script>
// import gpsBase from '@views/mixins/gps_base'
export default {
  name: 'GPSDetail',
  // mixins: [gpsBase],
  props: {
    viewdata: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      labelCol: { span: 8 },
      wrapperCol: { span: 12, offset: 1 }
    }
  },
  methods: {
  }
}
</script>
