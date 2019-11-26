<template>
  <div class="form-layout-body">
    <a-modal
      :visible="visible"
      :title="heading"
      @cancel="$emit('onCancel',visible)"
      :maskClosable="false"
    >
      <template slot="footer">
        <a-button key="back" @click="$emit('onCancel',visible)">关闭</a-button>
      </template>
      <a-form :form="form" class="form">
        <a-form-item label="司机姓名"
                     :labelCol="formItemLayout.labelSingleCol"
                     :wrapperCol="formItemLayout.wrapperSingleCol">
          {{driverRecord.driverName}}
        </a-form-item>
        <a-form-item label="手机号"
                     :labelCol="formItemLayout.labelSingleCol"
                     :wrapperCol="formItemLayout.wrapperSingleCol">
          {{driverRecord.mobile}}
        </a-form-item>
        <a-form-item label="驾驶证号"
                     :labelCol="formItemLayout.labelSingleCol"
                     :wrapperCol="formItemLayout.wrapperSingleCol">
          {{driverRecord.driverLicense}}
        </a-form-item>
        <a-form-item label="准驾车型"
                     :labelCol="formItemLayout.labelSingleCol"
                     :wrapperCol="formItemLayout.wrapperSingleCol">
          {{driverRecord.driverRankName}}
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { mixin, mixinDevice } from '@/utils/mixin'
import fileBase from '@views/mixins/file_base'

const formItemLayout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 12 },
  labelSingleCol: { span: 10 },
  wrapperSingleCol: { span: 12 }
}
export default {
  name: 'DriverDetailModel',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    heading: {
      type: String,
      default: ''
    },
    isAdd: {
      type: Boolean,
      default: true
    },
    driverRecord: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  mixins: [mixin, mixinDevice, fileBase],
  data () {
    return {
      loading: false,
      formItemLayout,
      form: this.$form.createForm(this)
    }
  },
  created () {
  },
  computed: {},
  methods: {}
}
</script>

<style lang="less">

</style>
