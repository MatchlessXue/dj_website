<template>
  <div class="enclosure-detail">
    <s-table
      ref="table"
      size="default"
      bordered
      :scroll="{ x: scrollX}"
      :columns="columns"
      :data="loadData"
      :showAlertInfo="false"

      @onSelect="onChange"
    >
      <a slot="driverName"
         slot-scope="text, record"
         @click="handleDetail(record)"
      >{{text}}</a>

      <a slot="bizStatus"
         slot-scope="text, record">{{record.bizStatusName}}</a>

    </s-table>
  </div>
</template>

<script>
import STable from '@/components/table'
import { countCollumnsWidth } from '@/utils/util'
import { checkCoordinateDetail } from '@/api/settlement/customer'
export default {
  name: 'enclosure-detail',
  components: {
    STable
  },
  data () {
    return {
      columns: [
        {
          title: '结款类型',
          width: 200,
          dataIndex: 'waybillCode',
          scopedSlots: { customRender: 'waybillCode' }
        },
        {
          title: '结款金额',
          width: 100,
          dataIndex: 'clientCode'
        },
        {
          title: '收款时间',
          width: 150,
          dataIndex: 'sdAddressArea'
        },
        {
          title: '备注',
          width: 150,
          dataIndex: 'rvAddressArea'
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        this.selectedRowKeys = []
        this.selectedRows = []
        console.log(parameter, 'queryParam=', this.queryParam)

        // 测试数据
        // this.queryParam.settlementObjectType = 2
        // this.queryParam.dispatchStart = '2011-02-19'
        // this.queryParam.dispatchEnd = '2020-02-23'
        // this.queryParam.regionIds = 1 // 收货区域
        // this.queryParam.settlementStyle = 1

        return checkCoordinateDetail(Object.assign(parameter, this.queryParam, { })).then(
          res => {
            console.log('res data==', res)
            return res.data
          }
        )
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  computed: {
    scrollX () {
      return countCollumnsWidth(this.columns)
    }
  },
  created () {

  },
  methods: {
    onChange (row) {
      console.log(row)
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
      this.costForm(this.selectedRows)
      // 将页面选择的数据带入
      this.clientSelectCondiation(this.queryParam)
    }
  }
}
</script>

<style lang="less" scoped>

</style>
