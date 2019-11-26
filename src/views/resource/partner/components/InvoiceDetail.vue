<template>
  <a-form @submit="handleSubmit" class="form">
    <a-row class="form-row" :gutter="16">
      <a-col :xl="6" :lg="6" :md="12" :sm="24">
        <a-form-item  :labelCol="labelCol" :wrapperCol="wrapperCol"
          label="公司名称">
          {{detail.companyName}}
        </a-form-item>
      </a-col>
      <a-col :xl="6" :lg="6" :md="12" :sm="24">
        <a-form-item  :labelCol="labelCol" :wrapperCol="wrapperCol"
          label="公司电话">
          {{detail.tel}}
        </a-form-item>
      </a-col>
      <a-col :xl="6" :lg="6" :md="12" :sm="24">
        <a-form-item  :labelCol="{ span: 14 }" :wrapperCol="{ span: 10 }"
          label="统一社会信用代码">
          {{detail.creditCode}}
        </a-form-item>
      </a-col>
      <a-col :xl="6" :lg="6" :md="12" :sm="24">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol"
          label="开户行">
          {{detail.bankName}}
        </a-form-item>
      </a-col>
    </a-row>
    <a-row class="form-row" :gutter="16">
      <a-col :xl="6" :lg="6" :md="12" :sm="24">
        <a-form-item  :labelCol="labelCol" :wrapperCol="wrapperCol"
          label="账号">
          {{detail.bankAccount}}
        </a-form-item>
      </a-col>
      <a-col :xl="6" :lg="6" :md="6" :sm="24">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol"
          label="注册地址">
         {{detail.address}}
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<script>
export default {
  name: 'InvoiceDetail',
  props: {
    detail: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      // detail: {
      //   companyName: '公司名称',
      //   creditCode: '统一社会信用代码',
      //   bankId: '开户行',
      //   address: '注册地址'
      // },
      labelCol: { span: 8 },
      wrapperCol: { span: 12, offset: 1 }
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
    }
  }
}
</script>

<style scoped>

</style>
