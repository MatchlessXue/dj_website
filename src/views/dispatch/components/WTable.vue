<template>
  <a-table :columns="columns"
           :rowKey="record => record[id]"
           :dataSource="tableData"
           :loading="loadingState"
           :scroll="{x:scrollX}"
           :pagination="pager"
           :rowSelection="selection"
           @change="_tableChange">
    <slot></slot>
  </a-table>
</template>

<script>
import Table from 'ant-design-vue/es/table/Table'

const props = Object.assign({}, Table.props, {
  columns: {
    type: Array,
    required: true,
    default: []
  },
  id: {
    type: String,
    default: 'id'
  },
  api: {
    type: Function,
    required: true,
    default: function () {}
  },
  filter: {
    type: Function,
    default: function (data) { return data }
  },
  pageSize: {
    type: Number,
    default: 10
  },
  // 进来就初始化
  isInit: {
    type: Boolean,
    default: true
  },
  scrollX: {
    type: Number,
    default: 0
  },

  // 显示选择数据框
  showSelection: {
    type: Boolean,
    default: true
  },
  // 类型
  selectionType: {
    type: String,
    default: 'checkbox'
  }

})

// 表格通用组件
export default {
  name: 'WTable',
  props: props,
  components: {
  },
  data () {
    return {
      tableData: [],
      // 页码配置
      pager: {
        showSizeChanger: true,
        pageSize: this.pageSize,
        total: 0,
        current: 1
      },
      loadingState: false,
      initParams: {
        page: 1,
        pageSize: this.pageSize
      },
      params: {},
      selectionSetting: {},

      // 所有选中的数据(id)
      selectedRowKeys: []

    }
  },
  created () {
    this._initFn()
  },
  mounted () {
    this.refresh()
  },
  computed: {
    selection () {
      const { selectedRowKeys } = this
      if (this.showSelection === false) return null
      return {
        type: this.selectionType,
        selectedRowKeys,
        onChange: this._onSelectionChange,
        onSelect: this._onSelectionSelect
      }
    }
  },
  methods: {
    _initFn () {

    },
    _tableChange (pagination, filters, sorter) {
      this.pager.current = pagination.current
      this.refresh({
        page: pagination.current,
        pageSize: pagination.pageSize,
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...filters
      })
    },

    // 刷新table
    refresh (params = {}) {
      this.loadingState = true
      this.setParams(params)
      this.$emit('before', this)
      this.api(this.getParams()).then(res => {
        let data = res.data
        this.loadingState = false
        this.pager.total = data.total
        if (data.records && data.records.length) {
          this.tableData = this.filter(data.records)
          this.pager.total = data.total
        } else {
          this.tableData = []
        }
      }).catch(err => {
        console.log('获取table数据失败', err)
        this.tableData = []
        this.loadingState = false
      })
    },

    getParams () {
      return Object.assign({}, this.initParams, this.params)
    },

    setParams (params) {
      Object.assign(this.params, params)
    },

    // 选择器配置
    _onSelectionChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.$emit('change', selectedRowKeys, selectedRows)
    },
    _onSelectionSelect (record, selected, selectedRows) {
      this.$emit('select', record, selected, selectedRows)
    },
    getSelectedRows () {
      return this.tableData.filter(item => {
        return this.selectedRowKeys.includes(item[this.id])
      })
    },
    getSelectedIds () {
      return this.selectedRowKeys
    },
    rowIsSelected (rowId) {
      return this.selectedRowKeys.some(id => id === rowId)
    },
    addSelectedRow (rowId) {
      if (!this.rowIsSelected(rowId)) this.selectedRowKeys.push(rowId)
    },
    removeSelectedRow (rowId) {
      const index = this.selectedRowKeys.findIndex(id => id === rowId)
      if (index !== -1) this.selectedRowKeys.splice(index, 1)
    }

  }
}
</script>

<style lang="less" scoped>

</style>
