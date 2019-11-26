<template>
  <div class="page-container">
    <a-card :bordered="false" class="card-container"  @keyup.enter="handleQuery">
      <div class="table-page-search-wrapper">
        <a-form :form="queryForm" layout="inline">
          <a-row :gutter="24">
            <a-col :xl="8" :lg="8" :md="8" :sm="24">
              <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="">
                <a-input-group compact>
                  <a-select showSearch
                            style="width: 30%"
                            @change="handleStatisticObjectTypeChange"
                            v-decorator="['statictisObjectId',{initialValue:1}]"
                            :filterOption="filterOption"
                            placeholder="请选择统计对象">
                    <a-select-option v-for="value in statisticObjectList"
                                     :key="value.code" :selected="value.code === 1">{{value.name}}
                    </a-select-option>
                  </a-select>
                  <a-auto-complete
                    @change="handleStatisticObjectChange"
                    style="width: 70%"
                    placeholder="请输入统计对象"
                    v-model="queryParam.objectName"
                    :filterOption="true" allowClear
                  >
                    <template slot="dataSource">
                      <a-select-option v-for="c in currentStatisticObjectList()"  :key="JSON.stringify(c)">{{c
                        .objectName}}</a-select-option>
                    </template>
                  </a-auto-complete>
                </a-input-group>
              </a-form-item>
            </a-col>
            <a-col :xl="8" :lg="8" :md="8" :sm="24">
              <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="始发区域：">
                <a-cascader v-model="querySdAdcode"
                            :options="regionsMap"
                            expandTrigger="hover"
                            :showSearch="{filter}"
                            changeOnSelect
                            :placeholder="`请选择始发区域`"/>
              </a-form-item>
            </a-col>
            <a-col :xl="8" :lg="8" :md="8" :sm="24">
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
            <a-col :xl="8" :lg="8" :md="8" :sm="24">
              <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="">
                <a-input-group compact>
                  <a-select showSearch
                            style="width: 30%"
                            v-decorator="['statictisTimeId',{initialValue:1}]"
                            :filterOption="filterOption"
                            placeholder="请选择时间维度">
                    <a-select-option v-for="value in statisticTimeList"
                                     :key="value.code"
                                     :disabled="isDisabledDispatchTime(value.code)">{{value.name}}
                    </a-select-option>
                  </a-select>
                  <a-range-picker  style="width: 70%"
                  :ranges="{ '今天': [moment(), moment()], '本月': [moment().startOf('month'), moment().endOf('month')],
                  '本季度': [moment().startOf('quarter'), moment().endOf('quarter')],
                  '上半年': [moment().startOf('year'), moment().startOf('year').add(5,'months').endOf('month')],
                  '下半年': [moment().startOf('year').add(6,'months').startOf('month'), moment().endOf('year')],
                  '今年': [moment().startOf('year'), moment().endOf('year')] }"
                    v-model="orderTimeSelected"
                  />
                </a-input-group>
              </a-form-item>
            </a-col>
            <a-col :xl="8" :lg="8" :md="8" :sm="24">
              <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="展示维度：">
                <a-select showSearch
                          v-decorator="['exhibitionId',{initialValue:1}]"
                          @change="handleDisplayDimensionsChange"
                          :filterOption="filterOption"
                          placeholder="请选择展示维度">
                  <a-select-option v-for="value in displayDimensionsList"
                                   :key="value.code">{{value.name}}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xl="8" :lg="8" :md="8" :sm="24">
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
            <!--<import-export :needExport="true"/>-->
          </a-col>
        </a-row>
      </div>
      <s-table
        id="mainTable"
        ref="table"
        size="default"
        :columns="columns"
        :scroll="{x: 1500}"
        :data="loadData"
        :showAlertInfo="false"
        :rowKey="(record,index) => index"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @onSelect="onMainTableChange">
        <span slot="profitMargin" slot-scope="text">{{text}}%</span>
      </s-table>
    </a-card>
  </div>
</template>

<script>
import STable from '@/components/table/'
// import AInput from 'ant-design-vue/es/input/Input'
import ASelect from 'ant-design-vue/es/select/index'
// import ImportExport from '@/components/ImportExport'
// import ConfirmInfo from '@/components/ListConfirm/ConfirmInfo'
import librariesBase from '@views/mixins/libraries_base'
import moment from 'moment'
// import listData from './mockData/operationStatisticsReportList'
import {
  getStatisticTimeList,
  getDisplayDimensionsList,
  getStatisticObjectList,
  getOperationStatisticList
} from '@/api/report/report'
import reportBase from '@views/report/mixins/report_base'

export default {
  name: 'OperationStatisticReportList',
  mixins: [librariesBase, reportBase],
  components: {
    // AInput,
    ASelect,
    STable
    // ImportExport
    // ConfirmInfo
  },
  data () {
    // const MockListData = listData
    return {
      visible: false,
      queryForm: this.$form.createForm(this),
      labelCol: { span: 5 },
      wrapperCol: { span: 8 },
      statisticTimeList: [],
      currentExhibitionId: 1,
      displayDimensionsList: [],
      statisticObjectList: [],
      querySdAdcode: [], // 发货方区域选项
      queryRvAdcode: [], // 收货方区域选项
      orderTimeSelected: [moment().startOf('month'), moment().endOf('month')],
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 主列表表头
      columns: [
        {
          title: '',
          dataIndex: 'index',
          customRender: (text, record, index) => {
            return ((this.$refs.table.localPagination.current - 1) * this.$refs.table.localPagination.pageSize) + (index + 1)
          }
        },
        {
          title: '统计对象',
          dataIndex: 'objectName'
        },
        {
          title: '单据数',
          dataIndex: 'billNum'
        },
        {
          title: '日期',
          dataIndex: 'date'
          // scopedSlots: { customRender: 'date' }
        },
        {
          title: '总件数',
          dataIndex: 'totalAmount'
        },
        {
          title: '总重量',
          dataIndex: 'totalWeight'
        },
        {
          title: '总体积',
          dataIndex: 'totalVolume'
        },
        {
          title: '总运费',
          dataIndex: 'incomeTransportationCost'
        },
        {
          title: '总附加费',
          dataIndex: 'incomeAdditionalCost'
        },
        {
          title: '总特殊费',
          dataIndex: 'incomeSpecialCost'
        },
        {
          title: '总赔偿费',
          dataIndex: 'indemnifyExpense'
        },
        {
          title: '总索赔金额',
          dataIndex: 'claimExpense'
        },
        {
          title: '合计',
          dataIndex: 'incomeTotalValue'
        }
      ],
      pagination: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: params => {
        this.handleQueryCondition()
        console.log('queryParam:', Object.assign(params, this.queryParam))

        return getOperationStatisticList(
          Object.assign(params, this.queryParam)
        ).then(res => {
          console.log('res data==515', res)
          return res.data
        })

        /* return  new Promise((resolve, reject) => {
          resolve(MockListData)
        }).then(res => {
          console.log('res data==515', res)
          return res.data
        }) */
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  computed: {
  },
  mounted () {
    this.getRegions() // 省市区
    this.init()
  },
  methods: {
    handleDisplayDimensionsChange (value) {
      this.currentExhibitionId = value
      console.log('handleDisplayDimensionsChange (value', value)
    },
    isDisabledDispatchTime (code) {
      return [1, 2].includes(this.queryForm.getFieldValue('statictisObjectId')) && code === 3 /* 调度时间 */
    },
    currentStatisticObjectList () {
      const code = this.queryForm.getFieldValue('statictisObjectId')
      let resultMap = []
      switch (code) {
        case 1: // 按客户
          resultMap = this.allCustomerList.map(item => {
            return {
              objectId: item.partnerId,
              objectName: item.partnerName
            }
          })
          break
        case 2: // 按客户-项目
          resultMap = this.allCustomerProjectList.map(item => {
            return {
              objectId: item.projectId,
              objectName: item.projectName
            }
          })
          break
        case 3: // 按司机
          resultMap = this.allDriverList.map(item => {
            return {
              objectId: item.driverId,
              objectName: item.driverName
            }
          })
          break
        case 4: // 按承运商
          resultMap = this.allCarrierList.map(item => {
            return {
              objectId: item.partnerId,
              objectName: item.partnerName
            }
          })
          break
      }
      return resultMap
    },
    init () {
      this.queryStatisticObjectList()
      this.queryDisplayDimensionsList()
      this.queryStatisticTimeList()
      this.getAllCustomerList()
      this.getAllCarrierList()
    },
    queryStatisticObjectList () {
      getStatisticObjectList().then(res => {
        this.statisticObjectList = res.data
      })
    },
    queryDisplayDimensionsList () {
      getDisplayDimensionsList().then(res => {
        this.displayDimensionsList = res.data
      })
    },
    queryStatisticTimeList () {
      getStatisticTimeList().then(res => {
        this.statisticTimeList = res.data
      })
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
      this.queryForm.resetFields()
    },
    onMainTableChange (row) {
      this.selectedRowKeys = row.selectedRowKeys
      this.selectedRows = row.selectedRows
      console.log('onMainTableChange', this.$refs.table)
    },
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
      console.log('onSelectChange', this.$refs.table)
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    // 状态选择框事件处理方法
    handleChange (value) {
      console.log(`selected ${value}`)
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
      // [this.queryParam.sdProvinceRgcode, this.queryParam.sdCityRgcode, this.queryParam.sdDistrictRgcode,
      //   this.queryParam.sdStreetRgcode] = this.querySdAdcode;
      // [this.queryParam.rvProvinceRgcode, this.queryParam.rvCityRgcode, this.queryParam.rvDistrictRgcode,
      //   this.queryParam.rvStreetRgcode] = this.queryRvAdcode;
      this.queryParam.startTime = this.orderTimeSelected[0].format('YYYY-MM-DD')
      this.queryParam.endTime = this.orderTimeSelected[1].format('YYYY-MM-DD')

      // 处理下拉选中项
      this.queryParam.statictisObjectId = this.queryForm.getFieldValue('statictisObjectId')
      this.queryParam.statictisTimeId = this.queryForm.getFieldValue('statictisTimeId')
      this.queryParam.exhibitionId = this.queryForm.getFieldValue('exhibitionId')
      let o = {
        // 处理行政区域的选择
        sdProvinceRgcode: this.querySdAdcode[0],
        sdCityRgcode: this.querySdAdcode[1],
        sdDistrictRgcode: this.querySdAdcode[2],
        sdStreetRgcode: this.querySdAdcode[3],
        rvProvinceRgcode: this.queryRvAdcode[0],
        rvCityRgcode: this.queryRvAdcode[1],
        rvDistrictRgcode: this.queryRvAdcode[2],
        rvStreetRgcode: this.queryRvAdcode[3]
      }

      this.queryParam = { ...this.queryParam, ...o }

      for (const key in this.queryParam) {
        !this.queryParam[key] && delete this.queryParam[key]
      }
    },
    handleStatisticObjectChange (value, option) {
      try {
        const selectedStatisticObject = JSON.parse(value)
        if (typeof selectedStatisticObject === 'object') {
          this.queryParam.objectName = selectedStatisticObject.objectName
          this.queryParam.objectId = selectedStatisticObject.objectId
        } else {
          this.queryParam.objectName = value
          this.queryParam.objectId = undefined
        }
      } catch (err) {
        this.queryParam.objectName = value
        this.queryParam.objectId = undefined
      }
    },
    handleStatisticObjectTypeChange (value, option) {
      this.queryParam.objectName = undefined
      this.queryParam.objectId = undefined
    }
  }
}
</script>

<style lang="less">
  #statictisObjectId, #statictisTimeId  {
    & div {
      background: #F7F7F7
    }
  }
</style>
