<template>
  <a-card :title="title" :style="{ backgroundColor: 'rgba(255,255,255,1)' }">
      <span slot="extra">
             <a-button-group>
              <a-button :type="getButtonType(1)" @click="handleDateButtonClick(1)">近三天</a-button>
              <a-button :type="getButtonType(2)" @click="handleDateButtonClick(2)">近一周</a-button>
              <a-button :type="getButtonType(3)" @click="handleDateButtonClick(3)">近四周</a-button>
            </a-button-group>
      </span>
      <slot></slot>
    </a-card>
</template>

<script>
export default {
  name: 'ChartAnalysisCard',
  props: {
    title: {
      type: String,
      default: '无标题'
    }
  },
  components: {},
  data () {
    return {
      currentDateType: 1
    }
  },
  created () {
  },
  computed: {},
  watch: {},
  mounted () {
  },
  methods: {
    getButtonType (dateType) {
      return this.currentDateType === dateType ? 'primary' : 'default'
    },
    handleDateButtonClick (dateType) {
      this.currentDateType = dateType
      this.$emit('dateTypeChange', dateType)
    }
  }
}
</script>

<style>
</style>
