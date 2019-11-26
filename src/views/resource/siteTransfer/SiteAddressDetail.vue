<template>
<div class="form-layout-body">
  <a-modal title="中转站详情" :visible="visible" @ok="handleadd" @cancel="handleaddCancel">
      <template slot="footer">
        <a-button key="back" @click="handleaddCancel">取消</a-button>
      </template>
    <a-form class="form">
      <a-form-item label="中转站名称" :labelCol="labelCol" :wrapperCol="wrapperCol">{{detail.siteName}}</a-form-item>
      <a-form-item label="中转站区域" :labelCol="labelCol" :wrapperCol="wrapperCol">{{detail.addressArea}}</a-form-item>
      <a-form-item label="中转站地址" :labelCol="labelCol" :wrapperCol="wrapperCol">{{detail.address}}</a-form-item>
      <!-- <a-form-item label="自定义区" :labelCol="labelCol" :wrapperCol="wrapperCol">{{detail.customAreaName}}</a-form-item>
      <a-form-item label="经度" :labelCol="labelCol" :wrapperCol="wrapperCol">{{detail.longitude}}</a-form-item>
      <a-form-item label="纬度" :labelCol="labelCol" :wrapperCol="wrapperCol">{{detail.latitude}}</a-form-item> -->
      <a-form-item label="联系人" :labelCol="labelCol" :wrapperCol="wrapperCol">{{detail.contact}}</a-form-item>
      <a-form-item label="手机号" :labelCol="labelCol" :wrapperCol="wrapperCol">{{detail.mobile}}</a-form-item>
      <a-form-item label="中转站属性" :labelCol="labelCol" :wrapperCol="wrapperCol">{{detail.siteTypeName}}</a-form-item>
      <a-form-item label="中转站备注" :labelCol="labelCol" :wrapperCol="wrapperCol">{{detail.remark}}</a-form-item>
    </a-form>
  </a-modal>
</div>
</template>

<script>
export default {
  name: 'SiteAddressDetail',
  props: {
    isShow: {
      type: Boolean,
      default () {
        return false
      }
    },
    detail: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      visible: this.isShow,
      form: this.$form.createForm(this),
      labelCol: { span: 8 },
      wrapperCol: { span: 12, offset: 1 }
    }
  },
  watch: {
    detail: {
      deep: true,
      handler: function (val) {
        this.$nextTick(() => {
          this.form.setFieldsValue(val)
        })
      }
    },
    isShow (val) {
      this.visible = val
    }
  },
  methods: {
    // 新增浮层确认事件
    handleadd (e) {
      e.preventDefault()
      this.handleaddCancel()
    },
    // 新增浮层关闭事件
    handleaddCancel () {
      this.visible = false
      this.$emit('hideDetail')
    }
  }
}
</script>
