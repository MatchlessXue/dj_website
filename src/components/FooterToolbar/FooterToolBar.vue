<template>
  <div :class="prefixCls">
    <div style="float: left" :style="style">
      <slot name="extra">{{ extra }}</slot>
    </div>
    <div style="float: right" :style="style">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FooterToolBar',
  props: {
    prefixCls: {
      type: String,
      default: 'ant-pro-footer-toolbar'
    },
    extra: {
      type: [String, Object],
      default: ''
    },
    align: {
      type: String,
      default: 'center'
    }
  },
  computed: {
    style () {
      const style = {}
      if (this.align) {
        style.textAlign = this.align
        style.width = '100%'
      }
      return style
    }
  }
}
</script>

<style lang="less" scoped>

</style>
