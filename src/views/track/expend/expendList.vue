<template>
  <div class="page-container">
    <a-card :bordered="false"
            class="card-container">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :md="8"
                   :sm="24">
              <a-form-item label="特殊费编号：">
                <a-input v-model="queryParam.expenseCode"
                         placeholder="请输入特殊费编号" />
              </a-form-item>
            </a-col>
            <a-col :md="8"
                   :sm="24">
              <a-form-item label="特殊费添加人：">
                <a-input v-model="queryParam.createAccountName"
                         placeholder="请输入特殊费添加人" />
              </a-form-item>
            </a-col>
            <a-col :md="8"
                   :sm="24">
              <a-form-item label="发生日期：">
                <a-range-picker v-model="sDate" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :md="8"
                   :sm="24">
              <a-form-item label="关联单号：">
                <a-input v-model="queryParam.relCode"
                         placeholder="请输入关联单号" />
              </a-form-item>
            </a-col>
            <a-col :md="8"
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
      <!--      getCheckboxProps: getCheckboxProps-->
      <s-table rowKey="expenseCode"
               :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange, getCheckboxProps: getCheckboxProps}"
               :columns="columns"
               :data="loadData"
               ref="table"
               bordered
               :showAlertInfo="false"
               :scroll="{ x: scrollX }">
        <template slot="operation"
                  slot-scope="text, record">
          <a @click="expendCharge(record)"
             v-if="record.bizStatus !== 4">处理</a>
        </template>
        <template slot="relCode"
                  slot-scope="text, record">
          <a @click="handleDetail(record)">{{text}}</a>
        </template>
        <span slot="nodeType"
              slot-scope="text, record">{{record.nodeTypeName}}</span>
        <span slot="bizStatus"
              slot-scope="text, record">{{record.bizStatusName}}</span>
      </s-table>
      <special-fee ref="SpecialFee"
                   @hideForm="hideForm"></special-fee>
    </a-card>
  </div>
</template>
<script>
import fileBase from '@views/mixins/file_base'
import { getTrackSpecialExpenseList, trackExpenseCommit, trackExpenseDelete } from '@/api/track/track.js'
import moment from 'moment'
import STable from '@/components/table'
import { countCollumnsWidth } from '@/utils/util'
import SpecialFee from './SpecialFee'
import { mapGetters } from 'vuex'
import trackBase from '@views/track/mixins/trackBase'

const data = []
export default {
  name: 'expendList',
  components: {
    STable,
    SpecialFee
  },
  mixins: [fileBase, trackBase],
  data () {
    const expenseCode = this.$route.query.expenseCode
    return {
      outsideExpenseCode: expenseCode,
      picindex: 0,
      form: this.$form.createForm(this),
      visible: false,
      confirmLoading: false,
      // 查询参数
      queryParam: {
        timer: '',
        expenseCode: '',
        relCode: '',
        createAccountName: ''
      },
      sDate: undefined,
      columns: [{
        title: '特殊费编号',
        width: 200,
        dataIndex: 'expenseCode'
      },
      {
        title: '关联类型',
        width: 100,
        dataIndex: 'relationTypeName'
      },
      {
        title: '关联单号',
        width: 170,
        dataIndex: 'codeName',
        scopedSlots: { customRender: 'relCode' }
      },
      {
        title: '费用类型',
        width: 130,
        dataIndex: 'nodeTypeName',
        scopedSlots: { customRender: 'nodeType' }
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
        title: '结算方式',
        width: 100,
        dataIndex: 'settlementTypeName'
      },
      {
        title: '状态',
        width: 80,
        dataIndex: 'bizStatus',
        key: 'bizStatus',
        scopedSlots: { customRender: 'bizStatus' },
        filters: [
          { text: '待处理', value: '1' },
          { text: '已处理', value: '2' },
          { text: '审批中', value: '3' },
          { text: '已完成', value: '4' }
        ]
        // onFilter: (value, record) => record.bizStatus === value
      },
      {
        title: '收支类型',
        width: 130,
        dataIndex: 'budgetFlagName'
      },
      {
        title: '添加时间',
        width: 180,
        dataIndex: 'nodeDate'
      },
      {
        title: '添加人',
        width: 120,
        dataIndex: 'createAccountName'
      },
      {
        title: '运输环节',
        width: 100,
        dataIndex: 'transportTypeName'
      },
      {
        title: '操作',
        width: 70,
        fixed: 'right',
        dataIndex: 'operation',
        scopedSlots: { customRender: 'operation' }
      }],
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
        return getTrackSpecialExpenseList(Object.assign(parameter, this.queryParam)).then(res => {
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
      trackNode: [],
      exceptionType: []
    }
  },
  created () {
    this.selectedColumns = this.columns.slice(0)
    this.scrollX = countCollumnsWidth(this.columns)
    console.log('outsideExpenseCode', this.outsideExpenseCode, this.$route.query)
    this.outsideExpenseCode && (this.queryParam.expenseCode = this.outsideExpenseCode)

    this.loadSpecialFeeOrClaimProcessStatus().then(res => {
      console.log('515this.columns', this.columns, this.specialFeeOrClaimProcessStatusList)
      this.selectedColumns = this.columns.slice(0)
      this.specialFeeOrClaimProcessStatusList.length && this.columns.forEach(col => {
        col.dataIndex === 'bizStatus' && (col.filters = this.specialFeeOrClaimProcessStatusList)
      })
    })
  },
  computed: {
    ...mapGetters(['tenantId'])
  },
  methods: {
    moment,
    piclook (i) {
      this.picindex = i
    },
    // 处理
    expendCharge (record) {
      this.specialFee = record
      this.$refs.SpecialFee.add(this.specialFee, 2)
    },
    hideForm () {
      this.selectedRowKeys = []
      this.$refs.table.refresh()
    },
    // 提交（1） 删除（2）
    handleEvent (type) {
      if (this.trackNode.length === 0) {
        this.$message.info('请勾选单据')
      } else {
        // 无论什么状态都能提交或删除
        console.log('type', type)
        type === 1 ? this.handleSubmit() : this.handleDelete()
        // if (this.trackNode.every(v => v.bizStatus === 1 || v.bizStatus === 2)) {
        //   type === 1 ? this.handleSubmit() : this.handleDelete()
        // } else {
        //   this.$message.info('只允许提交状态为 待处理、已处理 的单据')
        // }
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
          trackExpenseCommit(url).then(res => {
            that.trackNode = []
            that.$refs.table.refresh() // 重新刷新表格数据
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
          trackExpenseDelete(url).then(res => {
            that.trackNode = []
            that.$refs.table.refresh() // 重新刷新表格数据
          })
        }
      })
    },
    // 重置
    handleReset (pageOne) {
      this.sDate = undefined
      this.queryParam = {
        expenseCode: '',
        relCode: '',
        createAccountName: ''
      }
      this.$refs.table.refresh(pageOne)
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.trackNode = []
      selectedRows.forEach((item, i) => {
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
    // 查看详情
    canUse (record) {
      let flag = true
      if (record.relationType === 1 && !record.waybillId) flag = false
      if (record.relationType === 2 && !record.dispatchId) flag = false
      if (!flag) this.$message.error('错误数据,无法使用')
      return flag
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
    getReceiptList () {
      this.$refs.table.refresh()
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
