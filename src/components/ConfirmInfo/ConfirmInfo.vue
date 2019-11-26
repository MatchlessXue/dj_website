
<template>
  <a-popconfirm :title="title"
                @confirm="confirmfunction"
                @cancel="cancelfunction"
                :okText="okText"
                :cancelText="cancelText">
    <a v-if="isForList" href="javascript:;">{{content}}</a>
    <a-button v-if="!isForList" type="primary">{{content}}</a-button>
  </a-popconfirm>
</template>

<script>
export default {
  name: 'ConfirmInfo',
  props: {
    isForList: {
      type: Boolean,
      default: true
    },
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
