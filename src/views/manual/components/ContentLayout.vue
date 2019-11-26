<template>
  <div>
    <a-row type="flex" justify="space-around" align="middle">
      <h1><strong>{{title}}</strong></h1>
    </a-row>
    <a-row type="flex" justify="space-around" align="middle">
      <slot name="indicativePicture"></slot>
    </a-row>
    <a-row type="flex" v-for="(desc,index) in descriptionArr" :key="index" justify="start" align="middle">
      {{desc}}
    </a-row>
  </div>
</template>

<script>
export default {
  name: 'ManualIndex',
  props: {
    title: {
      type: String,
      default: ''
    },
    picSrc: {
      type: String,
      default: ''
    },
    descriptionArr: {
      type: Array,
      default () {
        return []
      }
    }
  },
  mounted () {
    console.log('picSrc', this.picSrc)
  }
}
</script>
