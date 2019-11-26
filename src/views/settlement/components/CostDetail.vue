<template>
  <div>
    <a-modal
      :title="title"
      :maskClosable="false"
      :centered="true"
      :visible="visible"
      @cancel="handleaddCancel"
      width='70%'>
      <template slot="footer">
        <a-button key="back" @click="handleaddCancel">取消</a-button>
      </template>
      <a-table
      :columns="selectedColumns"
      :dataSource="tableData"
      rowKey="type"
      :pagination="false">
      </a-table>
    </a-modal>
  </div>
</template>
<script>
import { CostDetailHead } from '@views/settlement/components/column.js'
import base from './mixins/base'

export default {
  name: 'costdetail',
  mixins: [base],
  props: {
    title: {
      type: String,
      default: '费用明细'
    },
    isShow: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  data () {
    return {
      visible: this.isShow,
      selectedColumns: [],
      tableData: []
    }
  },
  watch: {
    isShow (val) {
      this.visible = val
      if (val) {

      }
    }
  },

  mounted () {
    if (this.pageType === 3) {
      this.selectedColumns = [ { title: '派车单号',
        dataIndex: 'dispatchCode',
        key: 'dispatchCode',
        width: '100' }, ...CostDetailHead]
    } else {
      this.selectedColumns = CostDetailHead
    }
    console.log(this.selectedColumns)
  },
  methods: {
    showModal (record) {
      this.visible = true
      let arr = []
      if (record.expenseVos) {
        record.expenseVos.forEach(v => {
          if (v.money !== 0) {
            arr.push(v)
          }
        })
        record.expenseVos = arr
      }
      this.tableData = record.expenseVos ? arr : record
    },
    handleadd (id) {
      this.visible = true
    },
    handleaddCancel () {
      this.visible = false
    }
  }
}
</script>
<style lang="">

</style>
