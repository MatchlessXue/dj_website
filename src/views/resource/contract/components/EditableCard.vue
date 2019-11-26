<template>
  <a-card :title="title" class="card"  :bordered="false">
    <span href="#" v-if="isShowEditButton" slot="extra" class="topRightEdit" @click="$emit('EditClicked')">
      <a-icon type="edit"/>
      <span>编辑</span>
    </span>
    <slot></slot>
  </a-card>
</template>

<script>
export default {
  name: 'AnEditableCard',
  components: {
  },
  props: {
    title: {
      type: String,
      default: '卡片标题'
    },
    isShowEditButton: {
      type: Boolean,
      default: true
    }

  },
  data () {
    return {}
  },
  created () {
  },
  methods: {}
}
</script>

<style lang="less">

  .ant-form-item {
    margin-bottom: 10px;
  }
</style>
