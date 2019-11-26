<template>
  <div class="form-layout-body">
    <a-modal
      :visible="visible"
      title="货物详情"
      @cancel="$emit('onCancel',visible)"
      :maskClosable="true"
    >
      <template slot="footer">
        <a-button key="back" @click="$emit('onCancel',visible)">关闭</a-button>
      </template>
      <a-form :form="form">
        <a-form-item
          :labelCol="formItemLayout.labelSingleCol"
          :wrapperCol="formItemLayout.wrapperSingleCol"
          label="客户名称"
        >{{cargoRecord.partnerName}}</a-form-item>
        <a-form-item
          :labelCol="formItemLayout.labelSingleCol"
          :wrapperCol="formItemLayout.wrapperSingleCol"
          label="货物名称"
        >{{cargoRecord.cargoName}}</a-form-item>
        <a-form-item
          :labelCol="formItemLayout.labelSingleCol"
          :wrapperCol="formItemLayout.wrapperSingleCol"
          label="货物代码"
        >{{cargoRecord.cargoCode}}</a-form-item>
        <a-form-item
          :labelCol="formItemLayout.labelSingleCol"
          :wrapperCol="formItemLayout.wrapperSingleCol"
          label="货物规格"
        >{{cargoRecord.cargoSpecifications}}</a-form-item>
     <!--   <a-form-item
          :labelCol="formItemLayout.labelSingleCol"
          :wrapperCol="formItemLayout.wrapperSingleCol"
          label="外部编码"
        >{{cargoRecord.externalCode}}</a-form-item>-->
        <a-form-item
          :labelCol="formItemLayout.labelSingleCol"
          :wrapperCol="formItemLayout.wrapperSingleCol"
          label="货物类型"
        >{{cargoRecord.cargoTypeName}}</a-form-item>
        <a-form-item
          :labelCol="formItemLayout.labelSingleCol"
          :wrapperCol="formItemLayout.wrapperSingleCol"
          label="货物包装"
        >
          {{cargoRecord.packageTypeName}}
        </a-form-item>
        <a-row class="form-row">
          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item
              :labelCol="formItemLayout.labelCol"
              :wrapperCol="formItemLayout.wrapperCol"
              label="长(m)"
            >{{cargoRecord.lengthCustom}}</a-form-item>
          </a-col>

          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item
              :labelCol="formItemLayout.labelCol"
              :wrapperCol="formItemLayout.wrapperCol"
              label="宽(m)"
            >{{cargoRecord.widthCustom}}</a-form-item>
          </a-col>
        </a-row>
        <a-row class="form-row">
          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item
              :labelCol="formItemLayout.labelCol"
              :wrapperCol="formItemLayout.wrapperCol"
              label="高(m)"
            >{{cargoRecord.heightCustom}}</a-form-item>
          </a-col>

          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item
              :labelCol="formItemLayout.labelCol"
              :wrapperCol="formItemLayout.wrapperCol"
              label="单件货值"
            >{{cargoRecord.worth}}</a-form-item>
          </a-col>
        </a-row>
        <a-row class="form-row">
          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item
              :labelCol="formItemLayout.labelCol"
              :wrapperCol="formItemLayout.wrapperCol"
              label="单件重量(kg)"
            >{{cargoRecord.weightCustom}}</a-form-item>
          </a-col>

          <a-col :lg="12" :md="12" :sm="24">
            <a-form-item
              :labelCol="formItemLayout.labelCol"
              :wrapperCol="formItemLayout.wrapperCol"
              label="单件体积(m³)"
            >{{cargoRecord.volumeCustom}}</a-form-item>
          </a-col>
        </a-row>

        <a-form-item
          :labelCol="formItemLayout.labelSingleCol"
          :wrapperCol="formItemLayout.wrapperSingleCol"
          label="备注"
        >
          {{cargoRecord.remark}}
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>

const formItemLayout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 12 },
  labelSingleCol: { span: 5 },
  wrapperSingleCol: { span: 16 }
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
    isAdd: {
      type: Boolean,
      default: true
    },
    cargoRecord: {}
  },
  data () {
    return {
      myVisible: this.visible,
      formItemLayout,
      form: this.$form.createForm(this)
    }
  },
  methods: {
    check () {
      this.form.validateFields(err => {
        if (!err) {
          console.info('success')
        }
      })
    }
  }
}
</script>
