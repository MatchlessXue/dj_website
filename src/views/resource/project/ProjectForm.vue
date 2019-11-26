<template>
  <div class="form-layout-body">
    <a-modal :visible="visible" :title="heading" @cancel="$emit('onCancel',visible)" :maskClosable="false">
      <template slot="footer">
        <a-button key="back" @click="$emit('onCancel',visible)">取消</a-button>
        <a-button v-if="isAdd" key="submit" type="primary" :loading="loading" @click="onOkForAdd()">确认</a-button>
        <a-button v-if="!isAdd" key="submit" type="primary" :loading="loading" @click="onOkForEdit()">确认</a-button>
      </template>
      <a-form :form="form" class="form">
        <a-form-item label="客户名称" v-if="isAdd"
                     :labelCol="formItemLayout.labelSingleCol"
                     :wrapperCol="formItemLayout.wrapperSingleCol">
          <a-select showSearch placeholder="请选择客户名称"
                          optionFilterProp="children"
                          v-decorator="['partnerId']"
                          :allowClear="true"
                          :filterOption="filterOption">
            <a-select-option v-for="partner in allPartnerList" :key="partner.partnerId">{{partner.partnerName}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="项目名称"
                     :labelCol="formItemLayout.labelSingleCol"
                     :wrapperCol="formItemLayout.wrapperSingleCol">
                    <a-input v-decorator="['projectName']" placeholder="请输入项目名称"/>
        </a-form-item>
        <a-form-item label="状态" v-if="isAdd"
                     :labelCol="formItemLayout.labelSingleCol"
                     :wrapperCol="formItemLayout.wrapperSingleCol">
          <a-radio-group v-decorator="['bizStatus', {initialValue: statusEnable}]">
            <a-radio v-for="item in allStatusMap" :key="item.code" :value="item.code">{{item.name}}</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>

    </a-modal>
  </div>
</template>

<script>
import { mixin, mixinDevice } from '@/utils/mixin'
import librariesBase from '@views/mixins/libraries_base'
import { getAllPartners } from '@/api/resource/partner'

const formItemLayout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 12 },
  labelSingleCol: { span: 5 },
  wrapperSingleCol: { span: 16 }
}
export default {
  name: 'ProjectForm',
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
    projectRecord: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  mixins: [mixin, mixinDevice, librariesBase],
  watch: {
    projectRecord: {
      deep: true,
      handler: function (val) {
        console.log('watch-val', val)
        this.$nextTick(() => {
          const { projectName } = val
          this.form.setFieldsValue({ projectName })
        })
      }
    }
  },
  data () {
    return {
      formItemLayout,
      loading: false,
      initData: {},
      submitData: {},
      form: this.$form.createForm(this),
      allPartnerList: [], // 客户名称列表
      isSubmit: false
    }
  },
  created () {
    this.getStatusMap()
    this.getAllPartnerList()
  },
  methods: {
    // 窗口关闭
    handleclose (e) {
      this.form.resetFields()
    },
    getAllPartnerList () {
      getAllPartners({ partnerTypes: 1 }).then(res => {
        this.allPartnerList = res.data
      })
    },
    // 过滤
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    onOkForAdd () {
      this.form.validateFields((err, values) => {
        console.log(values)
        if (!err) {
          // this.handleclose()
          this.$emit('onOkForAdd', values)
        }
      })
    },
    onOkForEdit () {
      this.form.validateFields((err, values) => {
        console.log(values)
        console.log(this.projectRecord)
        values.partnerId = this.projectRecord.partnerId
        values.projectId = this.projectRecord.projectId
        if (!err) {
          // this.handleclose()
          this.$emit('onOkForEdit', values)
        }
      })
    }
  }
}
</script>

<style lang="less">
</style>
