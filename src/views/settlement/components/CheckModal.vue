<template>
  <div class="total">
    <a-modal
      :visible="visible"
      :maskClosable="false"
      :centered="true"
      :confirmLoading="loading"
      @ok="handleadd"
      @cancel="handleaddCancel"
      width='90%'>
      <span slot="title">
        <span >{{title}}</span>
        <!--司机不显示按钮-->
<!--        <a @click="checkDetail(record)" v-if="type !== 3" class="checkdetail">查看费用明细</a>-->
      </span>
      <condition ref="condition" @sendForminfo="getForminfo" :info="forminfo" :type="2"></condition>
      <a-card class="card-wrap" :bordered="false">
        <a-col :md="{span: 12}" :sm="12">
          <a-button type="primary" @click="handleAddWaybill">添加</a-button>
          <a-button type="primary" @click="handleDel">删除</a-button>
        </a-col>
      </a-card>
      <s-table
        ref="table"
        size="default"
        bordered
        :scroll="{ x: 3200}"
        :columns="columns"
        :data="loadData"
        :showAlertInfo="false"
        :pageSize="5"
        :rowKey='record => record.settleId'
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}">
        <a slot="action"
           slot-scope="text, record"
           v-if="record.isAdjust === 1"
           @click="handleAdjust(record)">调差</a>
      </s-table>
      <add-waybill ref="addWaybill"
        @hideForm="AddWaybillHideForm"
        :queryParamData="queryParamData">
      </add-waybill>
      <add-dispatch ref="addDispatch"
                   @hideForm="AddWaybillHideForm"
                   :queryParamData="queryParamData">
      </add-dispatch>
      <add-carrier ref="addCarrier"
                    @hideForm="AddWaybillHideForm"
                    :queryParamData="queryParamData">
      </add-carrier>
      <adjust-modal ref="adjustModal"
                    @hideForm="AddWaybillHideForm">
      </adjust-modal>
      <cost-detail ref="costDetail"></cost-detail>
    </a-modal>

  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import wmath from '@utils/wmath'
import librariesBase from '@views/mixins/libraries_base'
import base from './mixins/base'
import condition from '@views/settlement/components/ConditionForm'
import STable from '@/components/table'
import addWaybill from '@views/settlement/components/AddWaybill'
import addDispatch from '@views/settlement/components/AddDispatch'
import addCarrier from '@views/settlement/components/AddCarrier'
import adjustModal from '@views/settlement/components/adjust'
import costDetail from '@views/settlement/components/CostDetail'
import { deepClone, countCollumnsWidth } from '@/utils/util'
import { addDocumentParams } from '@views/settlement/components/queryParams.js'
export default {
  name: 'checkModal',
  mixins: [librariesBase, base],
  components: {
    condition,
    STable,
    addWaybill,
    adjustModal,
    addCarrier,
    addDispatch,
    costDetail
  },
  props: {
    title: {
      type: String,
      default: '结算单调整'
    },
    type: {
      type: Number,
      default: 0 // 结算对象类型 1:客户，2:承运商 3:司机 4:服务商
    }
  },
  data () {
    return {
      visible: false,
      loading: false,
      needRefresh: false,
      detailvisible: false,
      form: this.$form.createForm(this),
      record: {},
      isSubmit: false,
      partnerId: '',
      columns: [],
      labelCol: { span: 5 },
      wrapperCol: { span: 16 },
      allPartnerList: [], // 客户名称列表
      forminfo: {},
      allPageList: [],
      queryParamData: {},
      otherCostListVos: {},
      queryParam: {
        'documentId': '',
        'settlementStyle': ''
      },
      selectedRowKeys: [],
      selectedRows: [],
      loadData: parameter => {
        this.$set(this.queryParam, 'status', true)
        this.needRefresh = true
        console.log(parameter, 'queryParam=', this.queryParam)
        return this.pageConfig.waybillPageWithFee(Object.assign(parameter, this.queryParam)).then(res => {
          this.columns = res.data.tableTitle
          console.log('this.columns', this.columns)
          if (this.pageType !== 3) {
            this.columns.push({
              title: '操作',
              dataIndex: 'action',
              width: 100,
              fixed: 'right',
              scopedSlots: { customRender: 'action' }
            })
          }
          if (res.data.otherCostListVos) {
            this.otherCostListVos = res.data.otherCostListVos
          }
          // if (this.pageType === 3) {
          //   this.$set(res.data, 'records', res.data.dispatchSettleVos)
          // }
          if (res.data.records) {
            res.data.records.forEach(val => {
              if (val.expenseVos) {
                val.expenseVos.forEach(v => {
                  this.$set(val, v.type, v.money)
                })
              }
            })
            if (parameter.page > 0) {
              this.allPageList[parameter.page - 1] = res.data.records
            }
          }
          return res.data
        })
      }
    }
  },
  computed: {
    ...mapGetters('settlement',
      ['getCostForm']
    ),
    scrollX () {
      return countCollumnsWidth(this.columns)
    }
  },
  mounted () {
    console.log((this.getCostForm))
  },
  methods: {
    showModal (record) {
      this.selectedRowKeys = []
      this.allPageList = []
      this.record = record
      this.visible = true
      this.init(record)
    },
    getForminfo (data) {
      this.queryParamData = data
    },
    closeModal () {
      this.visible = false
    },
    hide (val) {
      this.closeModal()
      this.$emit('hideForm', 4)
    },
    init (record) {
      this.record = record
      this.$set(this.queryParam, 'documentId', record.documentId)
      this.$set(this.queryParam, 'settlementStyle', record.payPeriod)
      this.$set(this.queryParam, 'settlementType', record.settlementType)
      this.totalMoney = record.totalMoney
      if (this.needRefresh) {
        this.$refs.table.refresh()
      }
      this.$nextTick(() => {
        this.$refs.condition.init()
      })
    },
    // 新增浮层确认事件
    handleadd () {
      // 表单中的数据
      let myParams = {}
      let isOk = true
      this.$refs.condition.form.validateFields((err, values) => {
        if (!err) {
          myParams = Object.assign(addDocumentParams, values)
        } else {
          isOk = false
        }
      })
      if (!isOk) return

      this.loading = true
      this.pageConfig.updataSettlement(Object.assign(myParams)).then(res => {
        this.handleaddCancel()
        this.$emit('hideForm', 6)// 对账结束之后刷新list表单
      }).finally(() => {
        this.loading = false
      })
    },
    handleAddWaybill () {
      console.log('type', this.type)
      if (this.type === 3) this.$refs.addDispatch.showModal()
      if (this.type === 1) this.$refs.addWaybill.showModal()
      if (this.type === 2) this.$refs.addCarrier.showModal()
    },
    handleAdjust (record) {
      let totalMoney = this.totalMoney
      this.$refs.adjustModal.showModal(record, Object.assign(this.queryParam, { totalMoney }))
    },
    handleDel () {
      if (this.selectedRows.length) {
        this.postDelWaybill()
      } else {
        this.$message.error('请选择删除对象！')
      }
    },
    // 删除运单请求
    postDelWaybill () {
      let varibaleAmount = 0
      let settleIds = ''
      let delData = deepClone(this.queryParam)
      if (this.selectedRowKeys) {
        this.selectedRowKeys.forEach(v => {
          this.allPageList.forEach(allv => {
            allv.forEach(item => {
              if (item.settleId === v) {
                varibaleAmount = wmath.add(varibaleAmount, item.settlementFee)
              }
            })
          })
          settleIds += `${v},`
        })
      }

      const operatorStatus = 0
      const partnerId = this.queryParamData.partnerId

      this.loading = true
      this.pageConfig.addWaybillList(Object.assign(delData, {
        settleIds,
        operatorStatus,
        partnerId,
        varibaleAmount
      })).then(res => {
        settleIds = ''
        varibaleAmount = 0
        // this.init(this.record)
        this.selectedRowKeys = []
        this.$refs.table.refresh()
        this.$refs.condition.init()
      }).finally(() => {
        this.loading = false
      })
    },
    AddWaybillHideForm (value) {
      if (value.isRefresh) {
        this.$refs.table.refresh()
        this.$refs.condition.init()
      }
    },
    // 浮层关闭事件
    handleaddCancel (isRefresh) {
      this.visible = false
      this.$emit('hideForm', { isRefresh: true, detail: false })
    },
    // 费用详情页
    checkDetail () {
      this.$refs.costDetail.showModal(this.otherCostListVos)
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
      // this.costForm(this.selectedRows)
      // 将页面选择的数据带入
      // this.clientSelectCondiation(this.queryParam)
    }
  }
}
</script>
<style lang="less" scope>
.checkdetail{
  border-bottom: 2px solid #1890ff;
  padding-bottom: 5px;
  margin-left: 15px;
}
.card-wrap{
  .ant-card-body{
    padding: 0 0 15px 0;
    button{
      margin-right: 10px;
    }
  }
}
</style>
