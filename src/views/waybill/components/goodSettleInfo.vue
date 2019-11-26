<template>
  <div class="settlement-odd-detail">
    <s-table
      ref="table"
      size="default"
      bordered
      rowKey="documentId"
      :scroll="{ x: scrollX}"
      :columns="columns"
      :data="loadData"
      :showAlertInfo="false"
      @onSelect="onChange"
    >
      <span slot="documentId"
            slot-scope="text, record">
          <a @click="goDetail(record)">{{text}}</a>
        </span>
    </s-table>
    <!-- 费用列表 -->
    <div class="settInfoCard10">
      <div class="main">
        <h3>收入费用</h3>
        <a-table :columns="columned" :dataSource="dataList.settleSummaryFees" size="middle" :pagination="false"/>
        <p v-show="dataList.settleSummaryFees && dataList.settleSummaryFees.length">现付金额：{{dataList.settlementCurrent}} 到付金额：{{dataList.settlementArrival}} 月结金额：{{dataList.settlementMonth}}</p>
      </div>
      <div class="main position-right">
        <h3>支出费用</h3>
        <a-table :columns="settleColumnes" :dataSource="settle.settleSummaryFees" size="middle" :pagination="false"/>
        <p v-show="settle.settleSummaryFees && settle.settleSummaryFees.length">现付金额：{{settle.settlementCurrent}} 到付金额：{{settle.settlementArrival}} 月结金额：{{settle.settlementMonth}}</p>
      </div>
    </div>
    <document-detail ref="docDetail"></document-detail>
  </div>
</template>

<script>
import STable from '@/components/table'
import { countCollumnsWidth } from '@/utils/util'
import librariesBase from '@views/mixins/libraries_base'
import { page } from '@/api/settlement/document'
import { settleSummary } from '@/api/waybill/waybill'
import DocumentDetail from '@views/settlement/components/DocumentDetail'

const columned = [{
  title: '费用名称',
  dataIndex: 'feeName'
}, {
  title: '费用金额',
  dataIndex: 'fee'
}]

const settleColumnes = [{
  title: '调度单号',
  dataIndex: 'dispathCode'
}, {
  title: '费用名称',
  dataIndex: 'feeName'
}, {
  title: '费用金额',
  dataIndex: 'fee'
}]

export default {
  name: 'good-settle-info',
  mixins: [librariesBase],
  components: {
    STable,
    DocumentDetail
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
          title: '结算单号',
          dataIndex: 'documentCode',
          key: 'documentCode',
          width: 200,
          fixed: 'left',
          scopedSlots: { customRender: 'documentId' }
        },
        {
          title: '结算单名称',
          dataIndex: 'documentName',
          key: 'documentName',
          width: 150
        },
        {
          title: '结算类型',
          dataIndex: 'settlementTypeName',
          key: 'settlementTypeName',
          width: 150
        },
        {
          title: '结算对象',
          dataIndex: 'partnerName',
          key: 'partnerName',
          width: 150
        },
        {
          title: '结算金额',
          dataIndex: 'totalMoney',
          key: 'totalMoney',
          width: 150
        },
        {
          title: '已结金额',
          dataIndex: 'paidMoney',
          key: 'paidMoney',
          width: 150
        },
        {
          title: '结算状态',
          dataIndex: 'bizStatusName',
          key: 'bizStatusName',
          width: 150
        },
        {
          title: '结算账期',
          dataIndex: 'settlementPeriod',
          key: 'settlementPeriod',
          width: 150
        },
        {
          title: '是否开票',
          dataIndex: 'isInvoiceName',
          key: 'isInvoiceName',
          width: 150
        },
        {
          title: '要求开票时间',
          dataIndex: 'reqInvoiceDateShow',
          key: 'reqInvoiceDateShow',
          width: 150
        },
        {
          title: '开票状态',
          dataIndex: 'invoiceStatusName',
          key: 'invoiceStatusName',
          width: 150
        },
        {
          title: '开票金额',
          dataIndex: 'invoiceMoney',
          key: 'invoiceMoney',
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
        return page(Object.assign(params, { waybillId: this.waybillId })).then(
          res => {
            return res.data || []
          }
        )
      },
      selectedRowKeys: [],
      selectedRows: [],
      columned,
      settleColumnes,
      dataList: [], // 收入
      settle: [] // 支出
    }
  },
  computed: {
    scrollX () {
      return countCollumnsWidth(this.columns)
    }
  },
  created () {
    // 获取收入 支出费用接口
    let self = this
    settleSummary({ waybillId: this.waybillId }).then((result) => {
      // 收入
      self.dataList = result.data.in || {}
      // 支出
      self.settle = result.data.out || {}
    })
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
    },
    // 订单详情页
    goDetail (record) {
      this.$refs.docDetail.getDocDetail(record.documentId)
    }
  },
  watch: {
    queryParam (n, o) {}
  }
}
</script>

<style lang="less" scoped>
  .settlement-odd-detail {
    background: #fff;
  }
  .settInfoCard10 {
    margin-top: 10px;
    padding: 10px;
    overflow: hidden;
    .main {
      width: 48%;
      padding: 0 5px;
      float: left;
    }
    .position-right {
      margin-left: 10px;
    }
    p {
      padding: 5px;
    }
  }
</style>
