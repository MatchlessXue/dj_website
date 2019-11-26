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
      </span>
      <a-card :bordered="false" class = "card-container" @keyup.enter="$refs.table.refresh()">
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <a-row :gutter="24">
              <a-col :md="6" :sm="24">
                <a-form-item label="调度单号">
                  <a-input
                    v-model="queryParam.dispatchCode"
                    placeholder="请输入调度单号"/>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="结算对象">
                  <a-auto-complete
                    :disabled="true"
                    :dataSource="allDrivers"
                    placeholder="请选择客户名称"
                    v-model="queryParam.driverId"
                    @change="partnerNameChange">
                  </a-auto-complete>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="车牌号码">
                  <a-input
                    v-model="queryParam.plateNumber"
                    placeholder="请输入车牌号码"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="运输方式">
                  <a-select
                    allowClear
                    showSearch
                    placeholder="请选择运输方式"
                    :filterOption="true"
                    v-model="queryParam.transportType" defaultValue="1">
                    <a-select-option v-for="d in transportTypeMap" :key="d.dictId">
                      {{d.dictName}}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="24">
              <a-col :md="6" :sm="24">
                <a-form-item label="调度时间">
                  <!--:defaultValue="[defaultDate, defaultDate]"-->
                  <a-range-picker
                    :defaultValue="defaultDate"
                    format="YYYY-MM-DD"
                    @change="onChangeDate"/>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
<!--                @change="settlementStyleChange"-->
                <a-form-item label="结算方式">
                  <a-select
                    placeholder="请选择结算方式"
                    :disabled="true"
                    v-model="queryParam.settlementStyle">
                    <a-select-option v-for="d in settlementStylesMap" :key="d.dictId">
                      {{d.dictName}}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
<!--                @change="settlementTypeChange"-->
                <a-form-item label="费用类型">
                  <a-select
                    :disabled="true"
                    placeholder="运输费用"
                    v-model="queryParam.settlementType" :defaultValue="[220]">
                    <a-select-option v-for="d in setCostTypeList" :key="d.code">
                      {{d.name}}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button
                  type="primary"
                  @click="$refs.table.refresh()"
                >查询</a-button>
                <a-button
                  @click="resetQuery"
                  style="margin-left: 12px;"
                >重置</a-button>
              </span>
              </a-col>
            </a-row>
          </a-form>
        </div>
      </a-card>
      <s-table
        ref="table"
        size="default"
        bordered
        :scroll="{ x: 2800}"
        :columns="columns"
        :data="loadData"
        rowKey="settleId"
        :pageSize="pagination.pageSize"
        :showAlertInfo="false"
        @change="pageChange"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}">
      </s-table>
    </a-modal>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { queryDrivers } from '@/api/resource/driver'
import STable from '@/components/table'
import librariesBase from '@views/mixins/libraries_base'
import base from './mixins/base'
import { getAllPartners } from '@/api/resource/partner'
import { countCollumnsWidth } from '@/utils/util'
import moment from 'moment'
import wmath from '@utils/wmath'
export default {
  name: 'addModel',
  mixins: [librariesBase, base],
  components: {
    STable
  },
  props: {
    title: {
      type: String,
      default: '添加调度单'
    },
    info: {
      type: Object,
      default () {
        return {}
      }
    },
    queryParamData: {
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
      // form: this.$form.createForm(this),
      isSubmit: false,
      setCostTypeList: [],
      allDrivers: [],
      partnerId: '',
      // defaultDate: moment(),
      labelCol: { span: 5 },
      wrapperCol: { span: 16 },
      allPartnerList: [], // 客户名称列表
      allPageList: [],
      selectedRowKeys: [],
      selectedRows: [],
      pagination: {
        current: 1,
        pageSize: 5,
        defaultPageSize: 5,
        pageSizeOptions: ['5', '15', '25', '35'],
        total: 1,
        page: 1,
        showTotal: () => {

        }
      },
      // 查询参数
      queryParam: {
        settlementStyle: 1,
        settlementType: 320
      },
      // 表头
      columns: [
        {
          title: '调度单号',
          width: 200,
          dataIndex: 'dispatchCode',
          scopedSlots: { customRender: 'dispatchCode' }
        },
        {
          title: '车牌号',
          width: 100,
          dataIndex: 'plateNumber'
        },
        {
          title: '司机姓名',
          width: 100,
          dataIndex: 'driverName'
        },
        {
          title: '司机手机号',
          width: 150,
          dataIndex: 'mobile'
        },
        {
          title: '车辆类型',
          width: 150,
          dataIndex: 'truckTypeName'
        },
        {
          title: '调度单类型',
          width: 150,
          dataIndex: 'dispatchTypeName'
        },
        {
          title: '运输方式',
          width: 140,
          dataIndex: 'transportTypeName'
        },
        {
          title: '调度单时间',
          width: 200,
          dataIndex: 'createDate'
        },
        {
          title: '件数',
          width: 100,
          dataIndex: 'totalAmount'
        },
        {
          title: '重量(kg)',
          width: 100,
          dataIndex: 'totalWeight'
        },
        {
          title: '体积',
          width: 100,
          dataIndex: 'totalVolume'
        },
        {
          title: '费用总计',
          width: 100,
          dataIndex: 'totalValue',
          scopedSlots: { customRender: 'totalValue' }
        },
        {
          title: '现付金额',
          width: 100,
          dataIndex: 'settlementCurrent'
        },
        {
          title: '到付金额',
          width: 100,
          dataIndex: 'settlementArrival'
        },
        {
          title: '月结金额',
          width: 100,
          dataIndex: 'settlementMonth'
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        this.selectedRowKeys = []
        this.selectedRows = []
        console.log(parameter, 'queryParam=', this.queryParam)
        this.queryParam.settlementObjectType = this.objectType // 结算对象 1:客户 2：承运商 3：司机 4：服务商
        const settlementStyle = !this.queryParam.settlementStyle ? 1 : this.queryParam.settlementStyle // 默认月结,不直接改this.queryParam.settlementStyle，否则下拉选框不能选
        const settlementType = !this.queryParam.settlementType ? 1 : this.queryParam.settlementType.toString().substr(1, 1)

        return this.pageConfig.getCostCheckList(Object.assign(parameter, this.queryParam, { settlementStyle, settlementType })).then(
          res => {
            this.allPageList[parameter.page - 1] = res.data.records
            return res.data
          }
        )
      },
      defaultDate: [moment(this.getFirstDay(), 'YYYY-MM-DD'), moment(this.getLastDay(), 'YYYY-MM-DD')],
      tableData: []
    }
  },
  created () {
    this.getAllDriver()
    this.getTransportTypeMap() // 运输方式
  },
  computed: {
    ...mapGetters('settlement',
      ['getDocumentInfo']
    ),
    scrollX () {
      return countCollumnsWidth(this.columns)
    }

  },
  methods: {
    // 重置
    resetQuery () {
      // this.queryParam.settlementStyle = 1
      this.queryParam.dispatchCode = undefined
      this.queryParam.plateNumber = undefined
      this.queryParam.transportType = 1
      // this.initDate()
    },
    // 司机
    getAllDriver () {
      queryDrivers({ pageSize: 10000, page: 1 }).then(res => {
        let arr = []
        if (res.data && res.data.records.length) {
          res.data.records.forEach(item => {
            arr.push({
              ...item,
              value: item.driverId,
              text: item.driverName
            })
          })
        }
        this.allDrivers = arr
      })
    },
    showModal () {
      this.visible = true
      console.log('this.queryParamData', this.queryParamData)

      this.$set(this.queryParam, 'driverId', this.queryParamData.driverId)
      this.$set(this.queryParam, 'driverName', this.queryParamData.driverName)
      this.$set(this.queryParam, 'documentId', this.queryParamData.documentId)
      this.$set(this.queryParam, 'settlementStyle', this.queryParamData.payPeriod)
      this.$set(this.queryParam, 'settlementType', this.queryParamData.settlementType.toString().substr(0, 2) * 10)
      this.$set(this.queryParam, 'partnerId', this.queryParamData.partnerId)
      this.$set(this.queryParam, 'partnerName', this.queryParamData.partnerName)
      this.allPageList = []
      this.getAllPartnerList() // 获取客户名称信息
      this.getRegions() // 省市区
      this.getSettlementStylesMap() // 结算方式
      this.costTypeList().then(res => { // 费用类型
        this.setCostTypeList = res.data
      })
      this.$nextTick(() => {
        this.$refs.table.refresh()
      })
    },
    // 新增浮层确认事件
    handleadd () {
      let varibaleAmount = 0
      let settleIds = ''
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
      const operatorStatus = 1
      const settlementType = this.queryParamData.settlementType
      const documentId = this.queryParamData.documentId
      const partnerId = this.queryParamData.partnerId
      const settlementStyle = this.queryParamData.settlementStyle

      this.loading = true
      this.pageConfig.addWaybillList(Object.assign({
        settleIds,
        operatorStatus,
        settlementType,
        documentId,
        partnerId,
        settlementStyle,
        varibaleAmount })).then(res => {
        this.handleaddCancel()
        settleIds = ''
        this.selectedRowKeys = []
        this.selectedRows = []
        varibaleAmount = 0
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
          settlelId: tabDatas[i]['settleId']
        })
      }
      return costList
    },
    // 新增浮层关闭事件
    handleaddCancel (isRefresh) {
      this.visible = false
      this.$emit('hideForm', { isRefresh: true, detail: false })
    },
    // 获取客户列表
    getAllPartnerList () {
      getAllPartners({ partnerTypes: 1 }).then(res => {
        this.allPartnerList = res.data
      })
    },
    // 调度时间回调
    onChangeDate (date, dateString) {
      dateString.length > 0 && (this.queryParam.dispatchStart = dateString[0])
      dateString.length > 1 && (this.queryParam.dispatchEnd = dateString[1])
    },
    pageChange (idx) {
      // console.log(idx)
      // if (this.selectedRows.length) {
      //   this.allPageList.concat(this.selectedRows)
      // }
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
      console.log(selectedRows)
    },
    // 客户名称选择框事件处理方法
    partnerNameChange (value) {
      console.log(`selected ${value}`)
      for (let i = 0; i < this.allPartnerList.length; i++) {
        if (value === this.allPartnerList[i].partnerId) {
          this.queryParam.partnerName = this.allPartnerList[i].partnerName
        }
      }
    },
    // 过滤客户列表
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },
    getFirstDay () {
      let date = new Date()
      let monthStart = date.setDate(1)
      return moment(monthStart).format('YYYY-MM-DD')
    },
    getLastDay () {
      let date = new Date()
      let currentMonth = date.getMonth()
      let nextMonth = ++currentMonth
      let nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1)
      let oneDay = 1000 * 60 * 60 * 24
      return moment(nextMonthFirstDay - oneDay).format('YYYY-MM-DD')
    }
  }
}
</script>
<style lang="less" scope>
</style>
