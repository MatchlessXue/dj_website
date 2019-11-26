<template>
  <div>
    <!-- <a-form @submit="handleSubmit" :form="form" class="form"> -->
    <a-row class="form-row" :gutter="16">
      <a-col :lg="6" :md="12" :sm="24">
        <a-form-item :label="config.partnerName" :labelCol="labelCol" :wrapperCol="wrapperCol">
          {{detail.partnerName}}
        </a-form-item>
      </a-col>
      <a-col :lg="6" :md="12" :sm="24">
        <a-form-item :label="config.partnerCode" :labelCol="labelCol" :wrapperCol="wrapperCol">
          {{detail.partnerCode}}
        </a-form-item>
      </a-col>
      <a-col :xl="6" :lg="6" :md="{span: 12}" :sm="24">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol"
                     :label="config.partnerIndustry">
          {{detail.partnerPropertyName}}
        </a-form-item>
      </a-col>
      <a-col :xl="6" :lg="6" :md="{span: 12}" :sm="24">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol"
                     :label='config.contactName'>
          {{detail.contactName}}
        </a-form-item>
      </a-col>
    </a-row>

    <a-row class="form-row" :gutter="16">
      <a-col :xl="6" :lg="6" :md="{span: 12}" :sm="24">
        <a-form-item :label="config.contactMobile"  :labelCol="labelCol" :wrapperCol="wrapperCol">
          {{detail.contactMobile}}
        </a-form-item>
      </a-col>
      <a-col :xl="6" :lg="6" :md="{span: 12}" :sm="24">
        <a-form-item :label="config.contactTel"  :labelCol="labelCol" :wrapperCol="wrapperCol">
          {{detail.contactTel}}
        </a-form-item>
      </a-col>
      <a-col :xl="6" :lg="6" :md="{span: 12}" :sm="24">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" :label='config.contactMail'>
          {{detail.contactMail}}
        </a-form-item>
      </a-col>
    </a-row>

    <a-row class="form-row" :gutter="16">
      <a-col :xl="6" :lg="6" :md="{span: 12}" :sm="24">
        <a-form-item :label="config.remark" :labelCol="labelCol" :wrapperCol="wrapperCol">
          {{detail.remark}}
        </a-form-item>
      </a-col>
    </a-row>

    <a-row
      v-if="type === 'customer'"
      class="form-row" :gutter="16">
      <a-col :lg="12" :md="12" :sm="24">
        <a-table
          style="margin-bottom: 24px"
          :columns="projectColumns"
          :dataSource="projectList"
          :pagination="false"
          :bordered="true"
          :rowKey='record => projectList.findIndex(project => project.projectName === record.projectName)'>
          <span slot="bizStatus" slot-scope="text">{{ djConsts.ENABLE_STATUS_CONST[text] }}
          </span>
        </a-table>
      </a-col>
    </a-row>
    <template v-if="type === 'carrier'">
      <a-row v-for="item in detail.carrierAreaList" :key="item.accountId" class="form-row" :gutter="16">
        <a-col :xl="6" :lg="6" :md="{span: 12}" :sm="24">
          <a-form-item :label="'省市区'" :labelCol="labelCol" :wrapperCol="wrapperCol">
            {{item.provinceName}}{{item.cityName}}{{item.districtName}}
          </a-form-item>
        </a-col>
        <a-col :xl="6" :lg="6" :md="{span: 12}" :sm="24">
          <a-form-item :label="'地址'" :labelCol="labelCol" :wrapperCol="wrapperCol">
            {{item.detailAddress}}
          </a-form-item>
        </a-col>
      </a-row>
    </template>

    <!-- </a-form> -->
  </div>
</template>

<script>
export default {
  name: 'BasicinfoDetail',
  props: {
    detail: {
      type: Object,
      default () {
        return {}
      }
    },
    config: {
      type: Object,
      default () {
        return {}
      }
    },
    type: {
      type: String,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      labelCol: { span: 10 },
      wrapperCol: { span: 12, offset: 1 },
      dataSource: [],
      projectColumns: [
        {
          title: '项目名称',
          dataIndex: 'projectName'
        },
        {
          title: '状态',
          dataIndex: 'bizStatus',
          scopedSlots: { customRender: 'bizStatus' }
        },
        {
          title: '人员',
          dataIndex: 'accountListName'
        }
        // {
        //   title: '操作',
        //   dataIndex: 'action'
        // }
      ]
    }
  },
  computed: {
    projectList () {
      return this.detail.projectList || [{ bizStatus: 100, projectName: this.detail.partnerName }]
    }
  },
  methods: {
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.$notification['error']({
            message: 'Received values of form:',
            description: values
          })
        }
      })
    },
    validate (rule, value, callback) {
      const regex = /^user-(.*)$/
      if (!regex.test(value)) {
        // callback('需要以 user- 开头')
      }
      callback()
    }
  }
}
</script>

<style scoped>

</style>
