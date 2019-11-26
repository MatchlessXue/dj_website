<template>
  <div>
    <custom-row v-if="hasHeader"  :rowType="1" :customColumns="columns"></custom-row>
    <custom-row :rowType="2" :rowDatas="dataSource" :customColumns="columns"></custom-row>
    <custom-row v-if="hasFooter"  :rowType="3" :currentSums="currentSums" :customColumns="columns"></custom-row>
  </div>
</template>

<script>
import CustomRow from '@/components/CustomRow'
export default {
  name: 'CustomTable',
  components: {
    CustomRow
  },
  props: {
    hasHeader: {
      type: Boolean,
      default: true
    },
    hasFooter: {
      type: Boolean,
      default: false
    },
    columns: {
      type: Array,
      default () {
        return []
      }
    },
    dataSource: {
      type: Array,
      default () {
        return new Array(1)
      }
    },
    currentSums: {
      type: Object,
      default () {
        return {}
      }
    }
  }
}
</script>
