<template>
  <div>
    <a-button v-if="needImport">导入</a-button>
    <a-button v-if="needExport" style="margin-left: 5px" @click="$emit('exportClick')">导出</a-button>
  </div>
</template>

<script>
export default {
  name: 'ImportExport',
  props: {
    needImport: {
      type: Boolean,
      default: false,
      required: false
    },
    needExport: {
      type: Boolean,
      default: false,
      required: false
    }
  }
}
</script>

<style scoped>
</style>
