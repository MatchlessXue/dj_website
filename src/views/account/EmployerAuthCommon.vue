<template>
  <div>
    <a-card :bordered="false">
      <a-row class="form-row" :style="getRowBottomMargin(15)">
        <a-col :lg="6" :md="6" :sm="6">
          <slot name="employerAuthCardHeading"></slot>
        </a-col>
        <slot name="rightTitleSection"></slot>
      </a-row>
      <a-row class="form-row" :style="getRowBottomMargin(5)">
        <slot></slot>
      </a-row>
    </a-card>
  </div>
</template>
<script>
export default {
  name: 'EmployerAuthCommon',
  methods: {
    getTipTextFontSize (multiple) {
      return {
        'font-size': multiple + 'em'
      }
    },
    getRowBottomMargin (multiple) {
      return {
        'margin-bottom': multiple + 'px'
      }
    }
  }
}
</script>
<style scoped>
</style>
