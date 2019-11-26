
<template>
  <a-popconfirm :title="title"
                @confirm="confirmfunction"
                @cancel="cancelfunction"
                :okText="okText"
                :cancelText="cancelText">
    <a href="javascript:;">{{content}}</a>
  </a-popconfirm>
</template>

<script>
export default {
  name: 'ConfirmInfo',
  props: {
    title: {
      type: String,
      default: 'title'
    },
    content: {
      type: String,
      default: 'content'
    },
    okText: {
      type: String,
      default: '确认'
    },
    cancelText: {
      type: String,
      default: '取消'
    }
  },
  methods: {
    confirmfunction () {
      this.$emit('onconfirm')
    },
    cancelfunction () {
      this.$emit('oncancel')
    }
  }
}
</script>
