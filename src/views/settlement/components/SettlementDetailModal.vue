<template>
  <div class="total">
    <a-modal
      :visible="visible"
      :maskClosable="false"
      :centered="true"
      @ok="handleadd"
      @cancel="handleaddCancel"
      width='90%'

    >
    <span slot="title">
          <span >{{title}}</span>
          <!-- <a @click="checkDetail(record)" class="checkdetail">查看费用明细</a> -->
        </span>
    <a-form>
      <a-row :gutter='16'>
        <a-col :xs="6">
          <a-form-item label="结算单号">
            <span>{{}}</span>
          </a-form-item>

        </a-col>
        <a-col :xs="6">
           <a-form-item label="结算类型">
            <span>{{}}</span>
          </a-form-item>
        </a-col>
        <a-col :xs="6">
           <a-form-item label="结算对象">
            <span>{{}}</span>
          </a-form-item>
        </a-col>
        <a-col :xs="6">
           <a-form-item label="结算单名称">
            <span>{{}}</span>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter='16'>
        <a-col :xs="6">
           <a-form-item label="结算账期">
            <span>{{}}</span>
          </a-form-item>
        </a-col>
        <a-col :xs="6">
           <a-form-item label="要求开票时间">
            <span>{{}}</span>
          </a-form-item>
        </a-col>
        <a-col :xs="6">
           <a-form-item label="是否含税">
            <span>{{}}</span>
          </a-form-item>
        </a-col>
        <a-col :xs="6">
           <a-form-item label="税点">
            <span>{{}}</span>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter='16'>
        <a-col :xs="6">
           <a-form-item label="应收金额">
            <span>{{}}</span>
          </a-form-item>
        </a-col>
        <a-col :xs="6">
           <a-form-item label="是否开票">
            <span>{{}}</span>
          </a-form-item>
        </a-col>
        <a-col :xs="12">
           <a-form-item label="结算备注">
            <span>{{}}</span>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <a-button >导出</a-button>
    <tab-List></tab-List>
    </a-modal>

  </div>
</template>
<script>
import librariesBase from '@views/mixins/libraries_base'

import tabList from '@views/settlement/components/TableList'
import base from './mixins/base'

export default {
  name: 'addModel',
  mixins: [librariesBase, base],
  components: {
    tabList
  },
  props: {
    title: {
      type: String,
      default: '添加结算单'
    },
    loading: {
      type: Boolean,
      default () {
        return false
      }
    },
    isShow: {
      type: Boolean,
      default () {
        return false
      }
    },
    heading: {
      type: String,
      default () {
        return ''
      }
    },
    type: {
      type: String,
      default: 'send'
    },
    siteType: {
      type: Number,
      default: 1
    },
    info: {
      type: Object,
      default () {
        return {}
      }
    },
    regionsList: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      // config: getBasicFormConfig(this.type),
      visible: this.isShow,
      detailvisible: false,
      form: this.$form.createForm(this),
      isSubmit: false,
      labelCol: { span: 5 },
      wrapperCol: { span: 16 },
      allPartnerList: [] // 客户名称列表
    }
  },
  mounted () {

  },
  watch: {
    info: {
      deep: true,
      handler: function (val) {
        this.$nextTick(() => {
          this.form.setFieldsValue(val)
        })
      }
    },
    isShow (val) {
      this.visible = val
      if (val) {
        this.form.resetFields()
      }
    }
  },
  computed: {

  },
  methods: {

    // 新增浮层确认事件
    handleadd () {
      // this.$refs.condition.form.validateFields((err, values) => {
      //   console.log(values)
      // })
    },
    // 新增浮层关闭事件
    handleaddCancel (isRefresh) {
      this.visible = false
      this.$emit('hideForm', { isRefresh: true, detail: false })
    },
    // 费用详情页
    checkDetail () {
      this.visible = false
      this.detailvisible = true
      this.$emit('hideForm', { isRefresh: true, detail: true })
    }

  }
}
</script>
<style lang="less" scope>
.checkdetail{
  text-decoration: underline;
  margin-left:10px;
}

</style>
