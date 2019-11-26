<template>
    <div class="img-modal">
      <a-modal :visible="visible" :footer="null" @cancel="handleCancel">
        <img alt="example" style="width: 100%" :src="url" />
      </a-modal>
    </div>
</template>

<script>
export default {
  name: 'img-modal',
  data () {
    return {
      visible: false,
      url: ''
    }
  },
  methods: {
    show (url) {
      this.url = url
      this.visible = true
    },
    handleCancel () {
      this.visible = false
    }
  }
}
</script>

<style lang="less" scoped>

</style>
