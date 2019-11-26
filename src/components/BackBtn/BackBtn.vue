<template>
  <div v-if="isShow" class="back-btn" :callbackFn="callbackFn" @click="clickHandler()"><slot></slot>{{title}}</div>
</template>

<script>

export default {
  name: 'BackBtn',
  props: {
    title: {
      type: String,
      default: '返回上一级'
    },
    callbackFn: {
      type: Function,
      default: undefined
    }
  },
  data () {
    return {

    }
  },
  watch: {
    callbackFn (val) {
      this.callbackFn = val
    }
  },
  computed: {
    isShow () {
      if (window.history.length > 1) {
        return true
      }
      return false
    }
  },
  methods: {
    clickHandler () {
      console.log('clickHandler', this.callbackFn)
      if (this.callbackFn) {
        this.callbackFn()
      } else {
        this.$router.back()
      }
    }
  }
}
</script>

<style scoped>
  .back-btn {
    font-size:14px;
    font-weight:400;
    color:rgba(24,144,255,1);
    line-height:20px;
    margin-bottom: 5px;
    cursor: pointer;
  }
</style>
