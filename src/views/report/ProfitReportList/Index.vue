<template>
  <div class="page-container">
    <a-card :bordered="false" class="card-container" @keyup.enter="handleQuery">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :xl="6" :lg="6" :md="6" :sm="24">
              <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="客户名称：">
                <a-auto-complete
                  @change="handleCustomerNameChange"
                  v-model="queryParam.partnerName"
                  placeholder="请输入客户名称"
                  :filterOption="true"
                >
                  <template slot="dataSource">
                    <a-select-option v-for="c in allCustomerList"  :key="JSON.stringify(c)">{{c.partnerName}}</a-select-option>
                  </template>
                </a-auto-complete>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="6" :md="6" :sm="24">
              <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="项目名称：">
                <a-auto-complete
                  @change="handleCustomerProjectNameChange"
                  placeholder="请输入项目名称"
                  v-model="queryParam.projectName"
                  :filterOption="true"
                >
                  <template slot="dataSource">
                    <a-select-option v-for="p in allCustomerProjectList"  :key="JSON.stringify(p)">{{c.projectName
                      }}</a-select-option>
                  </template>
                </a-auto-complete>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="6" :md="6" :sm="24">
              <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="发货区域：">
                <a-cascader v-model="querySdAdcode"
                            :options="regionsMap"
                            expandTrigger="hover"
                            :showSearch="{filter}"
                            changeOnSelect
                            :placeholder="`请选择发货区域`"/>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="6" :md="6" :sm="24">
              <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="收货区域：">
                <a-cascader v-model="queryRvAdcode"
                            :options="regionsMap"
                            expandTrigger="hover"
                            :showSearch="{filter}"
                            changeOnSelect
                            :placeholder="`请选择收货区域`"/>
              </a-form-item>
            </a-col>
          </a-row>

          <a-row :gutter="24">
            <a-col :xl="6" :lg="6" :md="6" :sm="24">
              <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="运单号：">
                <a-input v-model="queryParam.waybillCode" placeholder="请输入运单号"/>
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="6" :md="6" :sm="24">
              <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="下单时间：">
                <a-range-picker
                  :ranges="{ '今天': [moment(), moment()], '本月': [moment().startOf('month'), moment().endOf('month')],
                  '本季度': [moment().startOf('quarter'), moment().endOf('quarter')],
                  '上半年': [moment().startOf('year'), moment().startOf('year').add(5,'months').endOf('month')],
                  '下半年': [moment().startOf('year').add(6,'months').startOf('month'), moment().endOf('year')],
                  '今年': [moment().startOf('year'), moment().endOf('year')] }"
                  v-model="orderTimeSelected"
                />
              </a-form-item>
            </a-col>
            <a-col :xl="6" :lg="6" :md="6" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" @click="handleQuery">查询</a-button>&nbsp;&nbsp;&nbsp;&nbsp;
                <a-button @click="handleReset">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-card>
    <a-card :bordered="false" style="margin-top: 10px" class="card-container">
      <div class="table-page-option-wrapper">
        <a-row>
          <a-col style="text-align: right;">
            <import-export :needExport="true" @exportClick="handleExportClick"/>

          </a-col>
        </a-row>
      </div>
      <s-table
        id="mainTable"
        ref="table"
        size="default"
        bordered
        :scroll="{x:1500}"
        :columns="currentColumns"
        :data="loadData"
        :rowKey="record => record.waybillCode"
        @onSelect="onMainTableChange">
        <span slot="profitMargin" slot-scope="text">{{text}}%</span>
        <a-table
          :scroll="{x:1500}"
          id="detailTable"
          slot="expandedRowRender"
          slot-scope="record, index"
          ref="detailTable"
          :columns="getDetailColumns(index)"
          :dataSource="record.dispatchVoList"
          :pagination="false"
          @onSelect="onDetailTableChange"
          size="small">
          <a slot="dispatchCode" slot-scope="text,record" @click="handleDetail(record)" >{{text}}</a>
        </a-table>
      </s-table>
    </a-card>
  </div>
</template>

<script>
import STable from '@/components/table/'
import AInput from 'ant-design-vue/es/input/Input'
// import ASelect from 'ant-design-vue/es/select/index'
import ImportExport from '@/components/ImportExport'
// import ConfirmInfo from '@/components/ListConfirm/ConfirmInfo'
import librariesBase from '@views/mixins/libraries_base'
import moment from 'moment'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
// import listData from './mockData/profitReportList'
import reportBase from '@views/report/mixins/report_base'
import { getProfitList } from '@/api/report/report'
import qs from 'qs'

export default {
  name: 'ProfitReportList',
  mixins: [librariesBase, reportBase],
  components: {
    AInput,
    // ASelect,
    STable,
    ImportExport
    // ConfirmInfo
  },
  data () {
    // const MockListData = listData
    return {
      visible: false,
      labelCol: { span: 5 },
      wrapperCol: { span: 8 },
      querySdAdcode: [], // 发货方区域选项
      queryRvAdcode: [], // 收货方区域选项
      orderTimeSelected: [moment().startOf('month'), moment().endOf('month')],
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 主列表表头
      currentColumns: [],
      // 详情列表表头
      getDetailColumns: mainRecordIndex => {
        return [
          {
            title: '',
            dataIndex: 'index',
            key: 'index',
            customRender: (text, record, index) => {
              return `${this.currentAddNum + mainRecordIndex + 1}-${index + 1}`
            }
          },
          {
            title: '调度单号',
            dataIndex: 'dispatchCode',
            key: 'dispatchCode',
            scopedSlots: { customRender: 'dispatchCode' }
          },
          {
            title: '承运类型',
            dataIndex: 'transportTypeName',
            key: 'transportTypeName'
          },
          {
            title: '承运人',
            dataIndex: 'transportName',
            key: 'transportName'
          },
          {
            title: '件数',
            dataIndex: 'totalAmount',
            key: 'totalAmount'
          },
          {
            title: '重量',
            dataIndex: 'totalWeight',
            key: 'totalWeight'
          },
          {
            title: '体积',
            dataIndex: 'totalVolume',
            key: 'totalVolume'
          },
          {
            title: '支出运费',
            dataIndex: 'outgoTransportationCost',
            key: 'outgoTransportationCost'
          },
          {
            title: '支出附加费',
            dataIndex: 'outgoAdditionalCost',
            key: 'outgoAdditionalCost'
          },
          {
            title: '支出特殊费',
            dataIndex: 'outgoSpecialCost',
            key: 'outgoSpecialCost'
          },
          {
            title: '索赔金额',
            dataIndex: 'claimExpense',
            key: 'claimExpense'
          },
          {
            title: '赔偿金额',
            dataIndex: 'indemnifyExpense',
            key: 'indemnifyExpense'
          },
          {
            title: '对账差额',
            dataIndex: 'tunedTotalMoney',
            key: 'tunedTotalMoney'
          },
          {
            title: '支出合计',
            dataIndex: 'outgoTotalValue',
            key: 'outgoTotalValue'
          }
        ]
      },
      pagination: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: params => {
        this.handleQueryCondition()
        console.log('queryParam:', Object.assign(params, this.queryParam))
        return getProfitList(
          Object.assign(params, this.queryParam)
        ).then(res => {
          console.log('res data==', res)
          return res.data
        })

        // return getProfitList(
        //   Object.assign(params, this.queryParam)
        // ).then(res => {
        //   console.log('res data==', res)
        //   return res.data
        // })
      },
      selectedRowKeys: [],
      selectedRows: [],
      selectedDetailsRowKeys: [],
      selectedDetailsRows: []
    }
  },
  created () {
    this.currentColumns = this.columns.slice(0)
  },
  computed: {
    currentAddNum () {
      return (this.$refs.table.localPagination.current - 1) * this.$refs.table.localPagination.pageSize
    },
    columns () {
      const cols = [
        {
          title: '',
          dataIndex: 'index',
          key: 'index',
          customRender: (text, record, index) => {
            return this.currentAddNum + (index + 1)
          }
        },
        {
          title: '运单号',
          dataIndex: 'waybillCode',
          key: 'waybillCode'
        },
        {
          title: '客户名称',
          dataIndex: 'partnerName',
          key: 'partnerName'
        },
        {
          title: '项目名称',
          dataIndex: 'projectName',
          key: 'projectName'
        },
        {
          title: '发货区域',
          dataIndex: 'sdAddressArea',
          key: 'sdAddressArea'
        },
        {
          title: '收货区域',
          dataIndex: 'rvAddressArea',
          key: 'rvAddressArea'
        },
        {
          title: '件数',
          dataIndex: 'totalAmount',
          key: 'totalAmount'
        },
        {
          title: '重量',
          dataIndex: 'totalWeight',
          key: 'totalWeight'
        },
        {
          title: '体积',
          dataIndex: 'totalVolume',
          key: 'totalVolume'
        },
        {
          title: '收入运费',
          dataIndex: 'incomeTransportationCost',
          key: 'incomeTransportationCost'
        },
        {
          title: '收入附加费',
          dataIndex: 'incomeAdditionalCost',
          key: 'incomeAdditionalCost'
        },
        {
          title: '收入特殊费',
          dataIndex: 'incomeSpecialCost',
          key: 'incomeSpecialCost'
        },
        {
          title: '索赔金额',
          dataIndex: 'claimExpense',
          key: 'claimExpense'
        },
        {
          title: '赔偿金额',
          dataIndex: 'indemnifyExpense',
          key: 'indemnifyExpense'
        },
        {
          title: '差额合计',
          dataIndex: 'tunedTotalMoney',
          key: 'tunedTotalMoney'
        },
        {
          title: '收入合计',
          dataIndex: 'incomeTotalValue',
          key: 'incomeTotalValue'
        },
        {
          title: '支出合计',
          dataIndex: 'outgoTotalValue',
          key: 'outgoTotalValue'
        },
        {
          title: '毛利金额',
          // fixed: 'right',
          dataIndex: 'grossProfitValue',
          key: 'grossProfitValue'
        },
        {
          title: '毛利率',
          // fixed: 'right',
          dataIndex: 'profitMargin',
          key: 'profitMargin',
          scopedSlots: { customRender: 'profitMargin' }
        }
      ]
      return cols
    }
  },
  watch: {
    queryParam: {
      deep: true,
      handler: function (val) {
        console.log('watch>queryParam', val)
      }
    }
  },
  mounted () {
    this.getRegions() // 省市区
    this.getAllCustomerList()
  },
  methods: {
    handleExportClick () {
      this.handleQueryCondition()
      console.log('handleExportClick>', this.queryParam, `${document.origin}/order/report/exportProfit`,
        qs.stringify(this.queryParam))

      const url = `/api/order/report/exportProfit?${qs.stringify(this.queryParam)}`
      console.log('url:', url)
      window.open(url)
    },
    moment,
    // 提交
    handleQuery (e) {
      this.$refs.table.refresh()
    },
    handleReset () {
      this.queryParam = {}
      this.queryRvAdcode = []
      this.querySdAdcode = []
      this.orderTimeSelected = [moment().startOf('month'), moment().endOf('month')]
    },
    onMainTableChange (row) {
      this.selectedRowKeys = row.selectedRowKeys
      this.selectedRows = row.selectedRows
      console.log('onMainTableChange', this.$refs.table)
    },
    onDetailTableChange (row) {
      this.selectedDetailsRowKeys = row.selectedRowKeys
      this.selectedDetailsRows = row.selectedRows

      console.log('onDetailTableChange', this.$refs.detailTable)
    },
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
      console.log('onSelectChange', this.$refs.table)
    },
    /* onDetailsSelectChange (selectedDetailsRowKeys) {
      this.selectedDetailsRowKeys = selectedDetailsRowKeys
      console.log('onDetailsSelectChange', this.$refs.detailTable)
    }, */
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    // 状态选择框事件处理方法
    handleChange (value) {
      console.log(`selected ${value}`)
    },
    handleDetail (record) {
      let toRoute = { name: 'dispatchDetail' }
      if (record.carrierId) toRoute.name = 'shopDetail'
      if (record.dispatchId) { toRoute.params = { dispatchId: record.dispatchId } }
      this.$router.push(toRoute)
    },
    filter (inputValue, path) {
      return (path.some(option => (option.label).toLowerCase().indexOf(inputValue.toLowerCase()) > -1))
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },
    handleQueryCondition () {
      console.log('handleQueryCondition', this.queryParam)
      // 处理行政区域的选择
      let o = {
        sdProvinceRgcode: this.querySdAdcode[0],
        sdCityRgcode: this.querySdAdcode[1],
        sdDistrictRgcode: this.querySdAdcode[2],
        sdStreetRgcode: this.querySdAdcode[3],
        rvProvinceRgcode: this.queryRvAdcode[0],
        rvCityRgcode: this.queryRvAdcode[1],
        rvDistrictRgcode: this.queryRvAdcode[2],
        rvStreetRgcode: this.queryRvAdcode[3],
        orderStart: this.orderTimeSelected[0].format('YYYY-MM-DD'),
        orderEnd: this.orderTimeSelected[1].format('YYYY-MM-DD')
      }

      this.queryParam = { ...this.queryParam, ...o }
      for (let key in this.queryParam) {
        !this.queryParam[key] && delete this.queryParam[key]
      }
      console.log('handleQueryCondition end', this.queryParam)
    },
    handleCustomerNameChange (value, option) {
      try {
        const selectedCustomer = JSON.parse(value)
        if (typeof selectedCustomer === 'object') {
          this.queryParam.partnerName = selectedCustomer.partnerName
          this.queryParam.partnerId = selectedCustomer.partnerId
        } else {
          this.queryParam.partnerName = value
          this.queryParam.partnerId = undefined
        }
      } catch (err) {
        this.queryParam.partnerName = value
        this.queryParam.partnerId = undefined
      }
    },
    handleCustomerProjectNameChange (value, option) {
      try {
        if (typeof selectedCustomer === 'object') {
          const selectedCustomerProject = JSON.parse(value)
          this.queryParam.projectName = selectedCustomerProject.projectName
          this.queryParam.projectId = selectedCustomerProject.projectId
        } else {
          this.queryParam.projectName = value
          this.queryParam.projectId = undefined
        }
      } catch (err) {
        this.queryParam.projectName = value
        this.queryParam.projectId = undefined
      }
    }
  }
}
</script>

<style lang="less">
  #mainTable > div > div > div > div > div > div > div > table > thead > tr > th > div {
    width: 100px;
  }
</style>
