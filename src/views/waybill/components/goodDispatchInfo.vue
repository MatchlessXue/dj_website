<template>
  <div class="settlement-odd-detail">
    <s-table
      ref="table"
      size="default"
      bordered
      rowKey="dispatchId"
      :scroll="{ x: scrollX}"
      :columns="columns"
      :data="loadData"
      :showAlertInfo="false"
      @onSelect="onChange"
    >
      <span slot="transportType" slot-scope="text">{{getTransportTypeDesc(text)}}</span>
      <span slot="carrierName" slot-scope="text, record">
        <span v-if="record.carrierId">{{record.carrierName}}</span>
        <span v-else>{{record.driverName}}</span>
      </span>
      <span slot="bizStatus" slot-scope="text">{{getDispatchStatusDesc(text)}}</span>
      <span slot="dispatchId" slot-scope="text, record">
        <a @click="goDetail(record)">{{text}}</a>
      </span>
    </s-table>
  </div>
</template>

<script>
import STable from '@/components/table'
import { countCollumnsWidth } from '@/utils/util'
import librariesBase from '@views/mixins/libraries_base'
import dictionaryBase from '@/views/dispatch/DispatchList/mixins/dictionary_base'
import { dispatchSelectByPage } from '@/api/dispatch/dispatch'

export default {
  name: 'good-dispatch-info',
  mixins: [dictionaryBase, librariesBase],
  components: {
    STable
  },
  props: {
    waybillId: {
      type: String,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      columns: [
        {
          title: '调度单号',
          dataIndex: 'dispatchCode',
          key: 'dispatchCode',
          width: 200,
          fixed: 'left',
          scopedSlots: { customRender: 'dispatchId' }
        },
        {
          title: '车牌号',
          dataIndex: 'plateNumber',
          key: 'plateNumber',
          width: 150
        },
        {
          title: '承运方',
          dataIndex: 'carrierName',
          key: 'carrierName',
          width: 150,
          scopedSlots: { customRender: 'carrierName' }
        },
        {
          title: '运输方式',
          dataIndex: 'transportType',
          key: 'transportType',
          width: 150,
          scopedSlots: { customRender: 'transportType' }
        },
        {
          title: '总重量(kg)',
          dataIndex: 'totalWeight',
          key: 'totalWeight',
          width: 150
        },
        {
          title: '总载方(m³)',
          dataIndex: 'totalVolume',
          key: 'totalVolume',
          width: 150
        },
        {
          title: '状态',
          dataIndex: 'bizStatus',
          key: 'bizStatus',
          width: 150,
          scopedSlots: { customRender: 'bizStatus' }
        },
        {
          title: '现付金额',
          dataIndex: 'settlementCurrent',
          key: 'settlementCurrent',
          width: 150
        },
        {
          title: '到付金额',
          dataIndex: 'settlementArrival',
          key: 'settlementArrival',
          width: 150
        },
        {
          title: '月结金额',
          dataIndex: 'settlementMonth',
          key: 'settlementMonth',
          width: 150
        },
        {
          title: '调度时间',
          dataIndex: 'createDate',
          key: 'createDate',
          width: 150
        },
        {
          title: '备注',
          dataIndex: 'remark',
          key: 'remark',
          width: 150
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: params => {
        this.selectedRowKeys = []
        this.selectedRows = []
        return dispatchSelectByPage(Object.assign(params, { waybillId: this.waybillId })).then(
          res => {
            return res.data || []
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
    // 订单详情页
    goDetail (record) {
      let toRoute = { name: 'dispatchDetail' }
      if (record.carrierId) toRoute.name = 'shopDetail'
      if (record.dispatchId) { toRoute.params = { dispatchId: record.dispatchId } }
      this.$router.push(toRoute)
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
      this.costForm(this.selectedRows)
      // 将页面选择的数据带入
      this.clientSelectCondiation(this.queryParam)
    }
  },
  watch: {
    queryParam (n, o) {

    }
  }
}
</script>

<style lang="less" scoped>
.settlement-odd-detail {
    background: #fff;
  }
</style>
