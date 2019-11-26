<template>
<div class="form-layout-body">
  <a-modal :title="title" :visible="visible" @ok="handleadd" @cancel="handleaddCancel">
    <template slot="footer">
        <a-button key="back" @click="handleaddCancel">关闭</a-button>
      </template>
    <a-form class="form">
      <a-form-item label="客户名称" :labelCol="labelCol" :wrapperCol="wrapperCol">{{detail.partnerName}}</a-form-item>
      <a-form-item :label="`${config.siteName}`" :labelCol="labelCol" :wrapperCol="wrapperCol">{{detail.siteName}}</a-form-item>
      <!-- <a-form-item :label="`${config.externalCode}`" :labelCol="labelCol" :wrapperCol="wrapperCol">{{detail.externalCode}}</a-form-item> -->
      <a-form-item :label="`${config.adcode}`" :labelCol="labelCol" :wrapperCol="wrapperCol">{{detail.addressArea}}</a-form-item>
      <a-form-item :label="`${config.address}`" :labelCol="labelCol" :wrapperCol="wrapperCol">{{detail.address}}</a-form-item>
      <!-- <a-form-item label="经度" :labelCol="labelCol" :wrapperCol="wrapperCol">{{detail.longitude}}</a-form-item>
      <a-form-item label="纬度" :labelCol="labelCol" :wrapperCol="wrapperCol">{{detail.latitude}}</a-form-item> -->
      <a-form-item :label="`${config.contact}`" :labelCol="labelCol" :wrapperCol="wrapperCol">{{detail.contact}}</a-form-item>
      <a-form-item :label="`${config.mobile}`" :labelCol="labelCol" :wrapperCol="wrapperCol">{{detail.mobile}}</a-form-item>
      <a-form-item :label="`${config.tel}`" :labelCol="labelCol" :wrapperCol="wrapperCol">{{detail.tel}}</a-form-item>
      <a-form-item v-for="(relatedMobileItem, relatedMobileIndex) in relatedMobileList"
                   :key="relatedMobileItem.relatedMobile"
                   :labelCol="getRalatedMobileLabelCol(relatedMobileIndex)"
                   :style="{ marginLeft: getRalatedMobileMarginLeft(relatedMobileIndex) }"
                   :wrapperCol="wrapperCol"
                   :label="getRelatedMobileLabel(relatedMobileIndex)">{{ relatedMobileItem.relatedMobile}}
      </a-form-item>
      <!-- <a-form-item :label="`${config.tel}`" :labelCol="labelCol" :wrapperCol="wrapperCol">{{detail.tel}}</a-form-item>
      <a-form-item :label="`${config.remark}`" :labelCol="labelCol" :wrapperCol="wrapperCol">{{detail.remark}}</a-form-item> -->
    </a-form>
  </a-modal>
</div>
</template>

<script>
import { getBasicFormConfig } from './config'
export default {
  name: 'SiteAddressDetail',
  props: {
    isShow: {
      type: Boolean,
      default () {
        return false
      }
    },
    type: {
      type: String,
      default: 'send'
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
      config: getBasicFormConfig(this.type),
      visible: this.isShow,
      form: this.$form.createForm(this),
      labelCol: { span: 8 },
      wrapperCol: { span: 12, offset: 1 },
      relatedMobileList: []
    }
  },
  watch: {
    type (val) {
      console.log('val====', val)
      this.config = getBasicFormConfig(val)
    },
    detail: {
      deep: true,
      handler: function (val) {
        this.$nextTick(() => {
          this.form.setFieldsValue(val)
          if (!val.relateMobile) {
            this.relatedMobileList = [{
              relatedMobile: undefined
            }]
          } else {
            this.relatedMobileList = []
            val.relateMobile.split(';').forEach(relatedMobile => {
              this.relatedMobileList.push({
                relatedMobile: relatedMobile
              })
            })
          }
        })
      }
    },
    isShow (val) {
      this.visible = val
    }
  },
  computed: {
    title () {
      return `${this.config.title}详情`
    }
  },
  methods: {
    getRalatedMobileLabelCol (relatedMobileIndex) {
      return relatedMobileIndex === 0 ? this.labelCol : { span: 18 }
    },
    getRelatedMobileLabel (relatedMobileIndex) {
      return relatedMobileIndex === 0 ? this.config.relatedMobile : ''
    },
    getRalatedMobileMarginLeft (relatedMobileIndex) {
      return relatedMobileIndex === 0 ? '0px' : '163px'
    },
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
<style lang="less" scoped>
  .ant-form-item {
    margin-bottom: 0;
  }
</style>
