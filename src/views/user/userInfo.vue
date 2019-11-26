<template>
  <a-card :bordered="false"
          class="content-layout">
  </a-card>
</template>

<script>
// import { getInfo } from '@/api/login'
export default {
  name: 'updatePwd',
  data () {
    return {
      form: this.$form.createForm(this),
      labelCol: { span: 8 },
      wrapperCol: { span: 12, offset: 1 }
    }
  }
}
</script>
