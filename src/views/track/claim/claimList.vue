<template>
  <div class="page-container">
    <a-card :bordered="false"
            class="card-container">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :md="6"
                   :sm="24">
              <a-form-item label="结算对象：">
                <a-input v-model="queryParam.settlementName"
                         placeholder="请输入结算对象" />
              </a-form-item>
            </a-col>
            <a-col :md="6"
                   :sm="24">
              <a-form-item label="事件添加人：">
                <a-input v-model="queryParam.createAccountName"
                         placeholder="请输入特殊费添加人" />
              </a-form-item>
            </a-col>
            <a-col :md="8"
                   :sm="24">
              <a-form-item label="事件添加时间：">
                <a-range-picker v-model="sDate" />
              </a-form-item>
            </a-col>
            <a-col :md="4"
                   :sm="24"
                   class="operation">
              <span style="margin-right: 10px;">
                <a-button @click="getReceiptList()"
                          type="primary">查询</a-button>
              </span>
              <a-button @click="handleReset">重置</a-button>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-card>
    <a-card :bordered="false"
            style="margin-top:10px"
            class="card-container">
      <div class="table-page-option-wrapper">
        <a-row :gutter="24">
          <a-col :md="16"
                 :sm="24">
            <a-button :disabled="canDeal"
                      @click="handleEvent(1)"
                      type="primary"
                      style="margin-right: 10px;">提交</a-button>
            <a-button :disabled="canDeal"
                      @click="handleEvent(2)"
                      type="primary">删除</a-button>
          </a-col>
        </a-row>
      </div>
      <s-table :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange,getCheckboxProps: getCheckboxProps}"
               :columns="columns"
               :data="loadData"
               ref="table"
               :rowKey="record => record.expenseId"
               bordered
               :showAlertInfo="false"
               :scroll="{ x: scrollX }">
        <template slot="operation"
                  slot-scope="text, record">
          <a v-if="record.bizStatus !== 4"
             @click="expendCharge(record)">处理</a>
        </template>
        <template slot="dispatchCode"
                  slot-scope="text, record">
          <a v-if="record.relationType === 1"
             @click="handleDetail(record)">{{text}}</a>
          <a v-else
             @click="handleDetaild(record)">{{text}}</a>
        </template>
        <span slot="nodeType"
              slot-scope="text, record">{{record.nodeTypeName}}</span>
        <span slot="bizStatus"
              slot-scope="text, record">{{record.bizStatusName}}</span>
      </s-table>
      <special-fee ref="SpecialFee"
                   @hideForm="hideForm"
                   :trackData="(specialFee)"></special-fee>
    </a-card>
  </div>
</template>
<script>
import fileBase from '@views/mixins/file_base'
import { getExpenseList, trackExpenseCommit, trackExpenseDelete } from '@/api/track/track.js'
import moment from 'moment'
import STable from '@/components/table'
import { countCollumnsWidth } from '@/utils/util'
import SpecialFee from './SpecialFee'
import { mapGetters } from 'vuex'
import trackBase from '@views/track/mixins/trackBase'

const data = []
export default {
  name: 'claimList',
  components: {
    STable,
    SpecialFee
  },
  mixins: [fileBase, trackBase],
  data () {
    return {
      picindex: 0,
      form: this.$form.createForm(this),
      visible: false,
      confirmLoading: false,
      // 查询参数
      queryParam: {
        timer: '',
        settlementName: '',
        dispatchCode: '',
        createAccountName: ''
      },
      sDate: undefined,
      columns: [],
      data,
      loadData: parameter => {
        this.queryParam.timer = new Date().getTime()
        if (this.sDate && this.sDate.length > 0) {
          this.queryParam.stNodeDate = this.sDate[0].format('YYYY-MM-DD')
          this.queryParam.edNodeDate = this.sDate[1].format('YYYY-MM-DD')
        } else {
          this.queryParam.stNodeDate = ''
          this.queryParam.edNodeDate = ''
        }
        return getExpenseList(Object.assign(parameter, this.queryParam)).then(res => {
          res.data.records.forEach(function (item, i) {
            item.nodeType = String(item.nodeType)
            item.picJsons = JSON.parse(item.picJson)
            if (typeof item.picJsons === 'string') {
              item.picJsons = JSON.parse(item.picJsons)
            }
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
      specialFee: {},
      canDeal: false,
      selectedColumns: [],
      selectedRowKeys: [],
      selectedRows: [],
      trackNode: []
    }
  },
  created () {
    this.createCloumns()
    this.selectedColumns = this.columns.slice(0)
    this.scrollX = countCollumnsWidth(this.columns)
    this.loadSpecialFeeOrClaimProcessStatus()
  },
  computed: {
    ...mapGetters(['tenantId'])
  },
  methods: {
    moment,
    piclook (i) {
      this.picindex = i
    },
    expendCharge (record) {
      // debugger;
      this.specialFee = record
      this.$refs.SpecialFee.add(this.specialFee, 1)
    },
    clearData (context) {
      context.selectedRowKeys = []
      context.trackNode = []
      context.$refs.table.refresh()
    },
    hideForm () {
      this.clearData(this)
    },
    createCloumns () {
      this.columns = [{
        title: '事件编号',
        width: 150,
        dataIndex: 'expenseCode'
      },
      {
        title: '关联类型',
        width: 120,
        dataIndex: 'relationTypeName'
      },
      {
        title: '关联单号',
        width: 170,
        dataIndex: 'codeName',
        scopedSlots: { customRender: 'dispatchCode' }
      },
      {
        title: '事件类型',
        width: 130,
        dataIndex: 'nodeTypeName',
        scopedSlots: { customRender: 'nodeTypeName' }
      },
      {
        title: '金额',
        width: 80,
        dataIndex: 'price'
      },
      {
        title: '结算对象',
        width: 100,
        dataIndex: 'settlementName'
      },
      {
        title: '异常状态',
        width: 130,
        dataIndex: 'bizStatus',
        scopedSlots: { customRender: 'bizStatus' },
        filters: this.specialFeeOrClaimProcessStatusList
      },
      {
        title: '添加人',
        width: 120,
        dataIndex: 'createAccountName'
      },
      {
        title: '添加时间',
        width: 180,
        dataIndex: 'nodeDate'
      },
      {
        title: '操作',
        width: 70,
        fixed: 'right',
        dataIndex: 'operation',
        scopedSlots: { customRender: 'operation' }
      }
      ]
    },
    // 提交（1） 删除（2）
    handleEvent (type) {
      if (this.trackNode.length === 0) {
        this.$message.info('请勾选单据')
      } else {
        if (this.trackNode.every(v => v.bizStatus === 1 || v.bizStatus === 2)) {
          type === 1 ? this.handleSubmit() : this.handleDelete()
        } else {
          this.$message.info('只允许提交状态为 待处理、已处理 的单据')
        }
      }
    },
    // 提交
    handleSubmit () {
      const that = this
      let expenseIds = this.trackNode.map(v => v.expenseId)
      let url = '?expenseIds=' + expenseIds.join('&expenseIds=')
      this.$confirm({
        title: `确认将选中的项提交 ?`,
        centered: true,
        onOk () {
          return trackExpenseCommit(url).then(res => {
            res.code === 0 && that.$message.success('提交成功')
            that.clearData(that)
          })
        }
      })
    },
    // 删除
    handleDelete () {
      const that = this
      let expenseIds = this.trackNode.map(v => v.expenseId)
      let url = '?expenseIds=' + expenseIds.join('&expenseIds=')
      this.$confirm({
        title: `确认删除选中的项吗 ?`,
        okType: 'danger',
        centered: true,
        class: 'del',
        iconType: 'close-circle',
        onOk () {
          return trackExpenseDelete(url).then(res => {
            that.clearData(that)
          })
        }
      })
    },
    // 重置
    handleReset (pageOne) {
      this.sDate = undefined
      this.queryParam = {
        settlementName: '',
        dispatchCode: '',
        createAccountName: ''
      }
      this.$refs.table.refresh(pageOne)
    },
    // 表格选中
    onSelectChange (selectedRowKeys, selectedRows) {
      console.log('selectedRowKeys, obj515', selectedRowKeys, selectedRows)

      // 如果是已完成，不允许选中
      this.selectedRowKeys = selectedRowKeys
      this.trackNode = []
      selectedRows && selectedRows.length && selectedRows.forEach((item, i) => {
        console.log('515item, i', item, i)
        this.trackNode.push({
          waybillId: item.waybillId,
          bizStatus: item.bizStatus,
          expenseId: item.expenseId
        })
      })
    },
    getCheckboxProps: record => ({
      props: {
        disabled: Number(record.bizStatus) === 4
      }
    }),
    waybillStatusChange (value) {
      value = value === 0 ? '' : value
      this.queryParam.waybillStatus = value
    },
    // 查看运单详情
    handleDetail (record) {
      console.log('运单', record)
      window.location.href = `/waybill/#/waybill/detail/${record.waybillId}`
      // this.$router.push({
      //   name: 'WaybillDetail',
      //   params: { id: record.waybillId }
      // })
    },
    // 查看调度单详情
    handleDetaild (record) {
      console.log('调度单', record)
      let toRoute = { name: 'dispatchDetail' }
      if (record.carrierName) toRoute.name = 'shopDetail'
      if (record.dispatchId) { toRoute.params = { dispatchId: record.dispatchId } }
      this.$router.push(toRoute)
    },
    // 查询
    getReceiptList () {
      this.clearData(this)
    }
  }
}
</script>
<style lang="less" scoped>
.ant-carousel .slick-dots li {
  width: 60px;
  margin: 10px 0px;
}

.ant-carousel .slick-dots {
  height: auto;
}

.ant-carousel .slick-slide img {
  border: 5px solid #fff;
  display: block;
  margin: auto;
  max-width: 80%;
}

.ant-carousel .slick-thumb {
  bottom: -45px;
}

.ant-carousel .slick-thumb li {
  width: 60px;
  height: 45px;
}

.ant-carousel .slick-thumb li img {
  width: 100%;
  height: 100%;
  filter: grayscale(100%);
}

.ant-carousel .slick-thumb li.slick-active img {
  filter: grayscale(0%);
}

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
<style lang="less">
.ant-modal-confirm-confirm.del .ant-modal-confirm-body > .anticon {
  color: #f5222d;
}
</style>
