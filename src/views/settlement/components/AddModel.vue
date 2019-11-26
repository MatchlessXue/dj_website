<template>
  <div class="total">
    <a-modal
      :visible="visible"
      :maskClosable="false"
      :centered="true"
      @ok="handleadd"
      @cancel="handleaddCancel"
      :confirmLoading="loading"
      width='90%'>
    <span slot="title">
      <span>{{title}}</span>
<!--      <a @click="checkDetail(record)" class="checkdetail">查看费用明细</a>-->
    </span>
    <condition ref="condition"></condition>
      <a-table :columns="columns"
           ref="tablist"
           :dataSource="tableData"
           :scroll="{x:2400}"
           :loading="loading"
           rowKey="settleId">
        :pagination="false"
        <!--<div style="width:50px" slot="total" slot-scope="text, record">{{text}}</div>-->
        <!--<div style="width:100px" slot="clientCode" slot-scope="text, record">{{text}}</div>-->
        <!--<div style="width:100px" slot="sdName" slot-scope="text, record">{{text}}</div>-->
        <!--<div style="width:100px" slot="sdAddressArea" slot-scope="text, record">{{text}}</div>-->
        <!--<div style="width:100px" slot="rvName" slot-scope="text, record">{{text}}</div>-->
        <!--<div style="width:100px" slot="rvAddressArea" slot-scope="text, record">{{text}}</div>-->
        <!--<div style="width:100px" slot="rvAddress" slot-scope="text, record">{{text}}</div>-->
      </a-table>
      <a-pagination size="middle"
        :pageSizeOptions="pagination.pageSizeOptions"
        :current="pagination.page"
        :defaultPageSize="pagination.defaultPageSize"
        :total="pagination.total"
        showSizeChanger
        showQuickJumper
        position="right"
        @change="handleTableChange"/>
    </a-modal>

  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import condition from '@views/settlement/components/ConditionForm'
import { addDocumentParams } from '@views/settlement/components/queryParams.js'
import librariesBase from '@views/mixins/libraries_base'
import base from './mixins/base'
import { countCollumnsWidth } from '@/utils/util'
import wmath from '@utils/wmath'
export default {
  name: 'addModel',
  mixins: [librariesBase, base],
  components: {
    condition
  },
  props: {
    title: {
      type: String,
      default: '添加结算单'
    },
    info: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      visible: false,
      loading: false,
      detailvisible: false,
      detailRecord: null,
      form: this.$form.createForm(this),
      isSubmit: false,
      partnerId: '',
      allPartnerList: [], // 客户名称列表
      columns: [],
      tableData: [],
      totalData: [],
      settleIds: '',
      pagination: {
        current: 1,
        pageSize: 5,
        defaultPageSize: 5,
        pageSizeOptions: ['5', '15', '25', '35'],
        total: 1,
        page: 1,
        showTotal: () => {

        }
      }
    }
  },
  computed: {
    ...mapGetters('settlement',
      ['getCostForm', 'getClientSelectCondiation']
    ),
    scrollX () {
      return countCollumnsWidth(this.columns)
    }

  },
  methods: {
    ...mapActions('settlement', [
      'setTableListData'
    ]),
    init (settleIds) {
      this.$nextTick(() => {
        this.$refs.condition.init()
        this.getTableData(settleIds)
      })
    },
    // 结算单表格的数据
    getTableData (settleIds) {
      this.loading = true
      let queryParam = {
        page: this.pagination.page,
        pageSize: this.pagination.pageSize,
        settlementStyle: this.getCostForm[0].settlementStyle,
        settleIds: ''
      }

      queryParam.settleIds = settleIds.toString()
      this.settleIds = queryParam.settleIds
      return this.pageConfig.waybillPageWithFee(queryParam).then(res => {
        this.columns = res.data.tableTitle
        this.setTabWidth(this.columns)
        this.tableData = this.pageType === 3 ? res.data.records : res.data.records
        this.detailRecord = res.data.records
        this.$set(this.pagination, 'total', res.data.total)
        this.$set(this.pagination, 'current', res.data.current)
        this.columns.unshift({
          title: '',
          dataIndex: 'total',
          key: 'total',
          scopedSlots: { customRender: 'total' }
        })
        console.log('查看cols', this.columns)
        // 添加总计数据
        let costType = {
          total: '总计',
          totalAmount: 0,
          totalWeight: 0,
          totalVolume: 0,
          specialExpense: 0,
          claimExpense: 0,
          indemnifyExpense: 0,
          totalValue: 0,
          settlementCurrent: 0,
          settlementArrival: 0,
          settlementMonth: 0,
          settlementFee: 0
        }
        Object.assign(costType, res.data.costType)
        this.tableData.forEach(val => {
          if (val.expenseVos) {
            val.expenseVos.forEach(v => {
              this.$set(val, v.type, v.money)
            })
          }
          for (let key in costType) {
            if (val[key]) {
              this.$set(costType, key, wmath.add(costType[key] * 1, val[key] * 1))
            }
          }
        })
        this.loading = false
        this.tableData.push(costType)
      }).catch(() => {
        this.loading = false
      })
    },
    showModal (settleIds) {
      this.visible = true
      this.init(settleIds)
    },
    // 新增浮层确认事件 提交添加结算单
    handleadd () {
      // 表单中的数据
      let myParams = {}
      let isOk = true
      this.$refs.condition.form.validateFields((err, values) => {
        if (!err) {
          myParams = Object.assign({}, addDocumentParams, values)
        } else {
          isOk = false
        }
      })
      if (!isOk) return
      // 拼接运单ID
      if (this.getSubTableData()) {
        this.$set(myParams, 'settleIds', this.settleIds)
        this.$set(myParams, 'mobile', this.getSubTableData()[0].mobile)
      }
      this.loading = true
      this.pageConfig.addSettlement(myParams).then(res => {
        this.handleaddCancel()
      }).finally(() => {
        this.loading = false
      })
    },
    // 保存时提交给后端的数据
    getSubTableData () {
      let costList = []
      const tabDatas = this.tableData
      for (let i = 0; i < tabDatas.length; i++) {
        costList.push({
          partnerId: this.pageType === 2 ? tabDatas[i].carrierId : tabDatas[i].partnerId,
          mobile: tabDatas[i].mobile, // 用于司机
          settlementMoney: tabDatas[i].settlementFee,
          tunedRemark: tabDatas[i].tunedRemark,
          tunedTotalMoney: tabDatas[i].tunedTotalMoney,
          settleId: tabDatas[i]['settleId']
        })
      }
      return costList
    },
    // 新增浮层关闭事件
    handleaddCancel (isRefresh) {
      this.visible = false
      this.$emit('hideForm', { isRefresh: true, detail: false })
    },
    // 费用详情页
    checkDetail () {
      this.detailvisible = true
      this.$emit('hideForm', { isRefresh: true, detail: true, record: this.detailRecord })
    },
    handleTableChange (page) {
      this.$set(this.pagination, 'page', page)
      this.getTableData()
    },
    setTabWidth (data) {
      let idxs = {
        'clientCode': 100,
        'sdName': 150,
        'sdAddressArea': 150,
        'rvName': 150,
        'rvAddressArea': 150,
        'rvAddress': 150
      }

      this.columns.forEach(v => {
        if (idxs[v.dataIndex]) {
          this.$set(v, 'width', idxs[v.dataIndex])
          this.$set(v, 'scopedSlots', { customRender: v.dataIndex })
        }
      })
      countCollumnsWidth(this.columns)
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
</style>
