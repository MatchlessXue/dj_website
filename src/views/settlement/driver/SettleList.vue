<template>
  <div class="page-container">
    <a-card
      :bordered="false"
      class="card-container tabbar-container"
    >
      <top-nav :items='tabItems'></top-nav>
    </a-card>
    <a-card :bordered="false" class = "card-container" @keyup.enter="$refs.table.refresh()">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :md="6" :sm="24">
              <a-form-item label="结算对象">
                <a-auto-complete
                  :dataSource="allDriverList"
                  placeholder="请选择司机名称"
                  v-model="queryParam.driverId"
                  @change="partnerNameChange">
                </a-auto-complete>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="结算类型">
                <a-select
                  allowClear
                  placeholder="请选择结算类型"
                  v-model="queryParam.settlementType">
                  <a-select-option v-for="d in settlementStatusMap" :key="d.code">
                    {{d.name}}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="结算单号">
                <a-input
                  v-model="queryParam.documentCode"
                  placeholder="请输入结算单号"
                />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button
                  type="primary"
                  @click="$refs.table.refresh()"
                >查询</a-button>
                <a-button
                  @click="queryParam = {}"
                  style="margin-left: 12px;"
                >重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-card>
    <a-card
      :bordered="false"
      style="margin-top: 10px" class="card-container"
    >
       <!-- <add-modal :isShow="addModalvisible" @hideForm="hideForm" /> -->

      <div class="table-page-option-wrapper">
        <a-row>
          <a-col :md="{span: 12}" :sm="12">
            <a-button v-show="[300, 301].includes(settleType)" :loading="submitLoading" type="primary" @click="handleSubmit">提交</a-button>
            <!-- <a v-show="settleType === 300" @click="handleCooperation" style="margin-left: 12px;">协同结算单</a> -->
          </a-col>
          <a-col style="text-align: right;" :md="12" :sm="12">
            <import-export />
          </a-col>
        </a-row>
      </div>
      <s-table
        ref="table"
        size="default"
        bordered
        :scroll="{ x: scrollX }"
        :columns="columns"
        :data="loadData"
        :showAlertInfo="false"
        rowKey="documentId"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @onSelect="onChange">
        <a slot="idCode"
          slot-scope="text, record"
          @click="handleSettleDocDetail(record)">{{text}}</a>
        <span slot="reqInvoiceDateShow" slot-scope="text, record">{{record.reqInvoiceDateShow}}</span>
        <a slot="bizStatus"
           slot-scope="text, record">{{record.bizStatusName}}</a>

        <span
          slot="action"
          slot-scope="text, record">
          <!-- 结算单管理 -->
          <template v-if="settleType === 300">
            <!-- payPeriod:结算类型:1：月结，2:现付,3:到付; -->
            <template>
              <a @click="handleCheckAccount(record)">调整</a>
              <a-divider type="vertical" />
            </template>
            <confirm-info title="确认删除这条记录么" content="删除" @onconfirm="handleDel(record)" />
          </template>
          <!-- 开票管理 -->
          <template v-if="settleType === 301">
            <a @click="$refs.InvoiceModal.add(record.documentId, record.partnerId)">开票申请</a>
          </template>
          <!-- 出纳确认 -->
          <template v-if="record.operation>0">
            <a v-if="record.operation === 2 || record.operation === 4" @click="$refs.AddpaymentModal.add(record.documentId,1)">添加付款</a>
            <a v-if="record.operation === 1 || record.operation === 3" @click="$refs.AddpaymentModal.add(record.documentId,2)">添加结款</a>
            <template v-if="record.operation>=3 && record.operation<5">
              <a-divider type="vertical" />
              <confirm-info title="确认退回这条记录么" content="退回" @onconfirm="handleBack(record)" />
            </template>
            <template v-if="record.operation === 5 && objectType !== 1">
              <!--<confirm-info title="确认通过这条记录么" content="确认" @onconfirm="$refs.AddpaymentModal.add(record.documentId,3)" />-->
              <a @click="$refs.AddpaymentModal.add(record.documentId,3)">确认</a>
              <a-divider type="vertical" />
              <confirm-info title="确认删除这条记录么" content="删除" @onconfirm="handleSettleDel(record)" />
            </template>
          </template>
        </span>

      </s-table>
      <coordinatemodal ref='coord' @hideForm="hideForm"></coordinatemodal>
      <invoice-modal ref="InvoiceModal"></invoice-modal>
      <addpayment-modal ref="AddpaymentModal" :key="new Date().getTime()" @hideForm="hideFormCb"></addpayment-modal>
      <check-modal :type="objectType" ref="mode" @hideForm="hideForm" > </check-modal>
      <investGateModal ref='invest'></investGateModal>
      <document-detail ref="docDetail"></document-detail>
    </a-card>
  </div>
</template>

<script>
import { throttle, trim } from 'lodash'
import { mapActions } from 'vuex'
import STable from '@/components/table'
import ImportExport from '@/components/ImportExport'
import TopNav from '@/components/tabs/'
import ConfirmInfo from '@/components/ConfirmInfo'

import { globalMap } from '@/api/global'
import { countCollumnsWidth } from '@/utils/util'
import base from './mixins/base'
import librariesBase from '@/views/mixins/libraries_base'
import { getAllDrivers } from '@/api/resource/driver'
import { getSettleList, deleteSettle, commitSettle, returnSettlement, enterSettlement, delSettlement } from '@/api/settlement/driver'
import { settlementStatus } from '@/api/settlement/carrier'

import checkModal from '@views/settlement/components/CheckModal'
import coordinatemodal from '@views/settlement/components/CoordinateModal'
import InvoiceModal from '@views/settlement/components/InvoiceModal'
import AddpaymentModal from '@views/settlement/components/AddpaymentModal'
import investGateModal from '@views/settlement/components/investigateModal'
import DocumentDetail from '@views/settlement/components/DocumentDetail'

export default {
  name: 'driverCostsList',
  mixins: [ librariesBase, base ],
  components: {
    STable,
    TopNav,
    ConfirmInfo,
    ImportExport,
    checkModal,
    coordinatemodal,
    InvoiceModal,
    AddpaymentModal,
    investGateModal,
    DocumentDetail
  },
  data () {
    return {
      visible: false,
      submitLoading: false, // 提交按钮loading

      form: null,
      mdl: {},
      statusEnable: globalMap.statusEnable, // 启用状态
      allDrivers: [],
      allDriverList: [], // 客户名称列表
      allCarriersList: [], // 承运方列表
      settlementStatusMap: [], // 结算类型列表

      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [],
      scrollX: 0,
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        console.log(parameter, 'queryParam=', this.queryParam)

        let find = this.allDrivers.find(item => {
          return item.driverId === this.queryParam.driverId
        })
        console.log('this.allDrivers', find)
        if (find) {
          // this.queryParam.partnerName = find.driverName
          this.queryParam.partnerId = this.queryParam.driverId
        } else {
          this.queryParam.partnerName = this.queryParam.driverId
          delete this.queryParam.partnerId
        }
        delete this.queryParam.driverId
        this.queryParam.objectType = this.objectType // 结算对象类型 1:客户，2:承运商 3:司机 4:服务商
        this.queryParam.settlementStatus = this.settleType // 结算的流程类型: 300:结算单管理，301:开票管理,302:出纳确认管理
        return getSettleList(Object.assign(parameter, this.queryParam)).then(
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
  watch: {
    '$route' (to, from) {
      console.log('route update....')
      this.init()
    }
  },
  mounted () {
    console.log('mounted.......=======================')
    this.getAllPartnerList() // 结算对象列表
    this.getSettlementStatusMap() // 结算类型
    this.init()
  },
  methods: {
    ...mapActions('settlement', [
      'setDocumentInfo'
    ]),
    showSomeModal () {
      this.$refs.invest.showModal()
    },
    hideFormCb () {
      console.log('触发了')
      this.$refs.table.refresh()
    },
    init () {
      this.selectedRowKeys = []
      this.selectedRows = []
      this.setColumns() // 设置列
      this.queryParam = {}
      this.$nextTick(() => {
        this.$refs.table.refresh()
      })
    },
    setColumns () {
      let columns = [
        {
          title: '结算单号',
          width: 220,
          dataIndex: 'documentCode',
          scopedSlots: { customRender: 'idCode' }
        },
        {
          title: '结算单名称',
          width: 220,
          dataIndex: 'documentName'
        },
        {
          title: '结算单类型',
          width: 120,
          dataIndex: 'settlementTypeName'
        },
        {
          title: '结算对象',
          width: 100,
          dataIndex: 'partnerName'
        },
        {
          title: '结算金额',
          width: 100,
          dataIndex: 'totalMoney'
        },
        {
          title: '已结金额',
          width: 100,
          dataIndex: 'paidMoney'
        },
        {
          title: '结算账期',
          width: 100,
          dataIndex: 'settlementPeriod'
        },
        {
          title: '要求开票日期',
          width: 140,
          dataIndex: 'reqInvoiceDate',
          scopedSlots: { customRender: 'reqInvoiceDateShow' }
        },
        {
          title: '结算状态',
          width: 140,
          dataIndex: 'bizStatusName',
          scopedSlots: { customRender: 'bizStatusName' }
        },
        {
          title: '是否含税',
          width: 100,
          dataIndex: 'taxIncludeName'
        },
        {
          title: '税点',
          width: 100,
          dataIndex: 'taxRateName'
        },
        {
          title: '是否开票',
          width: 100,
          dataIndex: 'isInvoiceName'
        },
        {
          title: '开票状态',
          width: 100,
          dataIndex: 'invoiceStatusName'
        },
        {
          title: '结算备注',
          width: 100,
          dataIndex: 'remark'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: 140,
          fixed: 'right',
          scopedSlots: { customRender: 'action' }
        }
      ]

      const { settleType } = this
      // 结算的流程类型: 300:结算单管理，301:开票管理,302:出纳确认管理
      console.log('settleType===', settleType)

      if (settleType === 300) {
        columns = columns.filter((val) => { // 删除开票状态,已结金额
          return val.dataIndex !== 'invoiceStatusName' && val.dataIndex !== 'paidMoney'
        })
      }
      if (settleType === 301) {
        columns = columns.filter((val) => { // 删除已结金额
          return val.dataIndex !== 'paidMoney'
        })
      }

      // 计算滚动宽度
      this.scrollX = countCollumnsWidth(columns)

      this.columns = [...columns]
    },
    // 添加结算单
    // handleAdd () {
    //   this.addModalvisible = true
    // },
    // 提交
    handleSubmit () {
      const { selectedRowKeys } = this
      if (!selectedRowKeys.length) {
        this.$message.error('请选择结算单')
        return
      }
      this.$confirm({
        title: '确认要提交选择的结算单吗?',
        content: '',
        onOk: () => {
          const documentIds = selectedRowKeys.map(r => {
            return r
          })
          this.submitLoading = true
          commitSettle({ documentIds }).then(res => {
            this.$refs.table.refresh()
            this.$message.success('操作成功')
          }).finally(() => {
            this.submitLoading = false
          })
        }
      })
    },
    // 协同结算单
    // handleCooperation () {
    //   this.$refs.coord.showModal()
    // },
    /**
     * 1 为发出
     * 2 为接收
     * 3 为驳回
     * 4 为调差
     */
    hideForm (isRefresh) {
      this.addModalvisible = false
      if (isRefresh === 1) {
        // this.$refs.table.refresh()
      } else if (isRefresh === 2) {

      } else if (isRefresh === 3) {

      } else if (isRefresh === 4) {
        this.$refs.invest.showModal()
      }
    },
    // 查看详情
    handleDetail (record) {
      this.$router.push({
        name: 'settleCustomerDetail',
        params: { id: record.driverId }
      })
    },
    // 查看详情
    handleSettleDocDetail (record) {
      this.$refs.docDetail.getDocDetail(record.documentId)
    },
    // 调整
    handleCheckAccount (record) {
      this.$refs.mode.showModal(record)
      this.setDocumentInfo(record)
    },
    // 添加开票
    handleMakeInvoice (record) {
      console.log('record.', record)
    },
    // 添加结款
    handleAddPay (record) {
      console.log('record.', record)
    },
    // 删除
    handleDel ({ documentId }) {
      deleteSettle({ documentId }).then(res => {
        this.$message.success('操作成功')
        this.$refs.table.refresh()
      })
    },
    // 出纳退回
    handleBack ({ documentId }) {
      returnSettlement({ documentId }).then(res => {
        this.$message.success('操作成功')
        this.$refs.table.refresh()
      })
    },
    // 出纳确认
    handleEnter ({ documentId }) {
      enterSettlement({ documentId }).then(res => {
        this.$message.success('操作成功')
        this.$refs.table.refresh()
      })
    },
    // 出纳删除
    handleSettleDel ({ documentId }) {
      delSettlement({ documentId }).then(res => {
        this.$message.success('操作成功')
        this.$refs.table.refresh()
      })
    },
    onChange (row) {
      console.log(this.$refs.table)
    },
    // 表格选择多选框改变事件
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    // 客户名称选择框事件处理方法
    partnerNameChange: throttle(async function (v) {
      if (v === '') {
        this.getAllPartnerList()
        return
      }
      const key = trim(v)
      // 重置表单的值
      // this.selectCompony = { coopCompanyId: '', coopCompanyName: v }
      // 查询级联列表
      if (!key) {
        this.companyNameSource = []
      } else {
        const self = this
        await getAllDrivers({ driverName: key, page: 1, pageSize: 1000 }).then((res) => {
          const datas = res.data.records || []
          self.clientNameList = res.data.records
          // 用于级联的下拉列表的显示只能是如下格式
          let source = []
          datas.forEach((val) => {
            source.push({ value: val.driverId, text: val.driverName })
          })
          self.allDriverList = source
        })
      }
    }, 500),
    // 获取司机列表
    getAllPartnerList () {
      getAllDrivers({ page: 1, pageSize: 100000 }).then(res => {
        let datas = []
        if (res.data && res.data.length) {
          this.clientNameList = res.data
          datas = res.data
        }
        if (res.data.records && res.data.records.length) {
          this.clientNameList = res.data.records
          datas = res.data.records
        }
        // 用于级联的下拉列表的显示只能是如下格式
        let source = []
        datas.forEach((val) => {
          source.push({ value: val.driverId, text: val.driverName })
        })
        console.log('获取司机=============================', source)
        this.allDriverList = source
      })
    },
    // 过滤客户列表
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },
    // 结算类型列表
    getSettlementStatusMap () {
      settlementStatus({ objectId: this.objectType }).then((res) => {
        this.settlementStatusMap = res.data
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
