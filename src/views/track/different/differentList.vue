<template>
  <div class="page-container">
    <a-card :bordered="false" class="card-container">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :md="6" :sm="24">
              <a-form-item label="关联单号：">
                <a-input v-model="queryParam.relCode" placeholder="请输入调度关联单号" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="异常提交人：">
                <a-input v-model="queryParam.createAccountName" placeholder="请输入异常提交人" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="发生时间">
                <a-range-picker v-model="sDate" />
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="24" class="operation">
              <span style="margin-right: 10px;">
                <a-button @click="getReceiptList()" type="primary">查询</a-button>
              </span>
              <a-button @click="handleReset">重置</a-button>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-card>
    <a-card :bordered="false" style="margin-top:10px" class="card-container">
      <s-table :columns="columns" :data="loadData" ref="table" bordered :showAlertInfo="false" :scroll="{ x: 1000 }">
        <template slot="relCode" slot-scope="text, record">
          <a @click="handleDetail(record)">{{record.relCode}}</a>
        </template>
        <template slot="operation" slot-scope="text, record">
          <a @click="expendCharge(record)">处理</a>
        </template>
      </s-table>
      <exception-handler @handlingExceptionSuccess="$refs.table.refresh()" ref="ExceptionHandler" @hideForm="hideForm"></exception-handler>
    </a-card>
  </div>
</template>
<script>
import { trackException, exceptionType } from '@/api/track/track.js'
import STable from '@/components/table'

import ExceptionHandler from './diffentDialog'

const data = []
export default {
  name: 'differentList',
  components: {
    STable,
    ExceptionHandler
  },
  data () {
    return {
      queryParam: { // 查询参数
        timer: '',
        waybillCode: '',
        relCode: '',
        createAccountName: ''
      },
      sDate: undefined,
      columns: [],
      data,
      loadData: parameter => {
        this.queryParam.timer = new Date().getTime()
        if (this.sDate && this.sDate.length > 0) {
          this.queryParam.startNodeDate = this.sDate[0].format('YYYY-MM-DD')
          this.queryParam.endNodeDate = this.sDate[1].format('YYYY-MM-DD')
        } else {
          this.queryParam.startNodeDate = ''
          this.queryParam.endNodeDate = ''
        }
        return trackException(Object.assign(parameter, this.queryParam)).then(res => {
          res.data.records.forEach(function (item, i) {
            item.nodeType = String(item.nodeType)
            item.picJsons = JSON.parse(item.picJson)
            if (item.picJsons && item.picJsons.length !== 0) {
              item.picWidth = (item.picJsons.length + 1) * 55
            } else {
              item.picWidth = 0
            }
          })
          this.data = res.data.records
          return res.data
        })
      },
      selectedRowKeys: [],
      nodeType: [],
      trackNode: []
    }
  },
  created () {
    this.createCloumns()
  },
  methods: {
    canUse (record) {
      let flag = true
      if (record.relationType === 1 && record.dispatchId)flag = false
      if (record.relationType === 2 && record.waybillId)flag = false
      if (!flag) this.$message.error('错误数据,无法使用')
      return flag
    },
    createCloumns () {
      exceptionType({}).then(res => {
        for (var i in res.data) {
          this.nodeType.push({ text: res.data[i], value: String(i) })
        }
      })
      this.columns = [{
        title: '异常编号',
        width: 180,
        dataIndex: 'exceptionCode',
        scopedSlots: { customRender: 'exceptionCode' }
      },
      {
        title: '关联类型',
        width: 100,
        dataIndex: 'relationTypeName'
      },
      {
        title: '关联单号',
        width: 180,
        dataIndex: 'relCode',
        scopedSlots: { customRender: 'relCode' }
      },
      {
        title: '异常类型',
        width: 120,
        dataIndex: 'nodeTypeName',
        key: 'nodeType',
        scopedSlots: { customRender: 'nodeType' },
        filters: this.nodeType,
        onFilter: (value, record) => record.nodeType === value
      },
      {
        title: '异常状态',
        width: 120,
        dataIndex: 'bizStatusName',
        key: 'bizStatus',
        scopedSlots: { customRender: 'bizStatus' },
        filters: [
          { text: '待处理', value: '1' },
          { text: '已处理', value: '2' }
        ],
        onFilter: (value, record) => record.bizStatus === value
      },
      {
        title: '发生日期',
        width: 170,
        dataIndex: 'nodeDate'
      },
      {
        title: '异常提交人',
        width: 130,
        dataIndex: 'createAccountName'
      },
      {
        title: '运输环节',
        width: 120,
        dataIndex: 'transportTypeName'
      },
      {
        title: '操作',
        width: 90,
        fixed: 'right',
        dataIndex: 'operation',
        scopedSlots: { customRender: 'operation' }
      }
      ]
    },
    handleDetail (record) {
      if (!this.canUse(record)) return
      if (record.relationType === 1) {
        window.location.href = `/waybill/#/waybill/detail/${record.waybillId}`
        // this.$router.push({
        //   name: 'WaybillDetail',
        //   params: { id: record.waybillId }
        // })
      } else if (record.relationType === 2) {
        let toRoute = { name: 'dispatchDetail' }
        if (record.carrierName) toRoute.name = 'shopDetail'
        if (record.dispatchId) { toRoute.params = { dispatchId: record.dispatchId } }
        this.$router.push(toRoute)
      }
    },
    expendCharge (record) {
      if (!this.canUse(record)) return
      this.$refs.ExceptionHandler.add([record])
    },
    hideForm () { // 隐藏dialog
      this.selectedRowKeys = []
      this.$refs.table.refresh()
    },
    handleReset (pageOne) {
      this.sDate = undefined
      this.queryParam = {
        waybillCode: '',
        dispatchCode: '',
        createAccountName: ''
      }
      // this.$refs.table.refresh(pageOne)
      this.$refs.table.refreshPaginationOptionsAndData()
    },
    getReceiptList (type) {
      this.$refs.table.refresh()
    }
  }
}
</script>
<style lang="less" scoped>
  .operation {
    margin-top: 10px;
  }

  .ant-menu-horizontal {
    font-size: 24px;
  }

  .ant-menu-submenu {
    margin-right: 20px;
  }

  .ant-menu-item {
    margin-right: 20px;
  }

  .ant-form-item {
    margin-bottom: 40px;
  }
</style>
