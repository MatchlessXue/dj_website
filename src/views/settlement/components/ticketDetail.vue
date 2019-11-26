<template>
  <div class="ticket-detail">
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
  name: 'ticket-detail',
  components: {
    STable
  },
  data () {
    return {
      columns: [
        {
          title: '发票类型',
          width: 200,
          dataIndex: 'waybillCode',
          scopedSlots: { customRender: 'waybillCode' }
        },
        {
          title: '公司名称',
          width: 100,
          dataIndex: 'clientCode'
        },
        {
          title: '统一社会信用',
          width: 150,
          dataIndex: 'sdAddressArea'
        },
        {
          title: '账号',
          width: 150,
          dataIndex: 'rvAddressArea'
        },
        {
          title: '开户行',
          width: 140,
          dataIndex: 'rvName'
        },
        {
          title: '发票编号',
          width: 120,
          dataIndex: 'rvAddress'
        },
        {
          title: '开票金额',
          width: 100,
          dataIndex: 'waybillStatusName'
        },
        {
          title: '联系人',
          width: 100,
          dataIndex: 'totalAmount'
        },
        {
          title: '联系人电话',
          width: 100,
          dataIndex: 'totalWeight'
        },
        {
          title: '详细地址',
          width: 100,
          dataIndex: 'totalVolume'
        },
        {
          title: '图片信息',
          width: 100,
          dataIndex: 'totalValue'
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
