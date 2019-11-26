<template>
  <a-table
    :columns="innerColumns"
    :dataSource="tableData"
    :pagination="false"
    :rowSelection="rowSelection"
    v-if="!isFinal"
  >
    <!-- 重量 -->
    <div slot="storedWeight" slot-scope="numText, numRecord">
      <span>{{ (numRecord.storedAmount * numRecord.singleStoredWeight).toFixed(3) }}</span>
    </div>
    <!-- 体积 -->
    <div slot="storedVolume" slot-scope="numText, numRecord">
      <span>{{ (numRecord.storedAmount * numRecord.singleStoredVolume).toFixed(3) }}</span>
    </div>
    <!-- 件数 -->
    <div slot="storedAmount" slot-scope="numText, numRecord">
      <span>装货</span>
      <a-input-number
        style="margin:0 10px;"
        :step="1"
        :max="numRecord.actAmount"
        :min="1"
        :defaultValue="Number(numText)"
        @change="v => inputChange(v, numRecord.key, 'storedAmount', numRecord)"
      ></a-input-number>
      <span>件</span>
    </div>

  </a-table>

  <a-table
    :columns="innerColumns"
    :dataSource="tableData"
    :pagination="false"
    v-else
  >
    <!-- 重量 -->
    <div slot="storedWeight" slot-scope="numText, numRecord">
      <span>{{ numRecord.storedAmount * numRecord.singleStoredWeight }}</span>
    </div>
    <!-- 体积 -->
    <div slot="storedVolume" slot-scope="numText, numRecord">
      <span>{{ numRecord.storedAmount * numRecord.singleStoredVolume }}</span>
    </div>
    <!-- 件数 -->
    <div slot="storedAmount" slot-scope="numText">
      {{ numText }}
    </div>
  </a-table>
</template>

<script>
import { innerColumns } from '../variable'

export default {
  name: 'ExpandedTable',
  data () {
    return {
      innerColumns,
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  props: {
    waybillId: {
      type: String,
      default: ''
    },
    innerData: {
      type: Array,
      default: null
    },
    isFinal: {
      type: Boolean,
      default: false
    }
  },
  created () { },
  computed: {
    // 使用过滤后的数据
    tableData () {
      let ta = this.innerData.filter(item => {
        return item.waybillId === this.waybillId
      })
      return ta
    },
    rowSelection () {
      const { selectedRowKeys } = this
      return {
        selectedRowKeys,
        onChange: this.onSelectChange
      }
    }
  },
  methods: {
    inputChange (value, key, column, record) {
      // console.log(value, key, column)
      record[column] = value
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
      this.$emit('selectGoodsItem', selectedRows)
    }
  },
  mounted () {}
}
</script>
