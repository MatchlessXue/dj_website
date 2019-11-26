<template>
  <div>
    <a-row type="flex" v-for="(rowData, i) in rowDatas" :key="i" justify="center" :style="rowStyle" :gutter="5">
      <a-col v-if="rowType === 1 && !rowData" :style="{ borderRight: rowStyle.border }"
             :span="1">
      </a-col>
      <a-col v-if="rowType === 2" :style="{ borderRight: rowStyle.border }"
             :span="1"><a-checkbox></a-checkbox>
      </a-col>
      <a-col v-if="rowType === 3 && !rowData" :style="{ borderRight: rowStyle.border }"
             :span="1">总计
      </a-col>
      <a-col :style="{ borderRight: rowStyle.border }" v-for="(sCol, c) in customColumns" :key="c"
             :span="sCol.span">{{ getContent(sCol, rowData) }}
      </a-col>
    </a-row>
  </div>
</template>
<script>
export default {
  name: 'CustomRow',
  props: {
    customColumns: {
      type: Array,
      default () {
        return []
      }
    },
    rowType: {
      type: Number,
      default: 1 /* 1: header 2：content 3：footer */
    },
    rowDatas: {
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
  },
  computed: {
    rowStyle () {
      let myStyle = {
        border:
            '1px solid rgba(232,232,232,1)'
      }
      if (this.rowType === 1 /* 表头 */) {
        myStyle.background = 'rgba(250,250,250,1)'
      }
      return myStyle
    }
  },
  methods: {
    getContent (colObj, currentRowData) {
      switch (this.rowType) {
        case 1:
          return colObj.title
        case 2:
          return currentRowData && colObj.val(currentRowData)
        case 3:
          return colObj.sum(this.currentSums)
        default:
          break
      }
    }
  }
}
</script>
