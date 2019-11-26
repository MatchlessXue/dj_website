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
                <a-form-item label="结算对象">
                  <a-auto-complete
                    :dataSource="allCarriersList"
                    placeholder="请选择客户名称"
                    :disabled="true"
                    v-model="queryParam.partnerName"
                    @change="partnerNameChange">
                  </a-auto-complete>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="运单号">
                  <a-input
                    v-model="queryParam.waybillCode"
                    placeholder="请输入运单号"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="调度时间">
                  <a-range-picker
                    :defaultValue="defaultDate"
                    @change="onChangeDate"/>
                </a-form-item>
              </a-col>

              <a-col :md="6" :sm="24">
                <a-form-item label="收货区域">
                  <a-cascader v-model="queryParam.regionIds"
                              changeOnSelect
                              :options="regionsMap"
                              expandTrigger="hover"
                              :placeholder="`请选择收货区域`" />
                </a-form-item>
              </a-col>

            </a-row>
            <a-row :gutter="24">
              <a-col :md="6" :sm="24">
                <!-- {{settlementStylesMap}} -->
                <a-form-item label="结算方式">
                  <a-select
                    @change="settlementStyleChange"
                    :disabled="true"
                    placeholder="请选择结算方式"
                    v-model="queryParam.settlementStyle">
                    <a-select-option v-for="d in settlementStylesMap" :key="d.dictId">
                      {{d.dictName}}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="24">
                <a-form-item label="费用类型">
                  <a-select
                    :disabled="true"
                    @change="settlementTypeChange"
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
                  @click="handleReset"
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
import STable from '@/components/table'
import { getCostCheckList } from '@/api/settlement/carrier'
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
      default: '添加运单'
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
      partnerId: '',
      defaultDate: [moment(this.getFirstDay(), 'YYYY-MM-DD'), moment(this.getLastDay(), 'YYYY-MM-DD')],
      labelCol: { span: 5 },
      wrapperCol: { span: 16 },
      allCarriersList: [],
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
        settlementType: 220
      },
      // 表头
      columns: [
        {
          title: '运单号',
          width: 200,
          dataIndex: 'waybillCode'
        },
        {
          title: '调度单号',
          width: 200,
          dataIndex: 'dispatchCode'
        },
        {
          title: '客户名称',
          width: 100,
          dataIndex: 'partnerName'
        },
        {
          title: '客户单号',
          width: 100,
          dataIndex: 'clientCode'
        },
        {
          title: '承运方名称',
          width: 120,
          dataIndex: 'carrierName'
        },
        {
          title: '发货区域',
          width: 150,
          dataIndex: 'sdAddressArea'
        },
        {
          title: '收货区域',
          width: 150,
          dataIndex: 'rvAddressArea'
        },
        {
          title: '收货方地址',
          width: 120,
          dataIndex: 'rvAddress'
        },
        {
          title: '回单状态',
          width: 100,
          dataIndex: 'receiptTypeName',
          needTotal: true,
          filterMultiple: true,
          filters: [
            { text: '全部', value: '' },
            { text: '未签收', value: '1' },
            { text: '已签收', value: '2' },
            { text: '已登记', value: '3' },
            { text: '已寄出', value: '4' },
            { text: '货主签收', value: '5' }
          ],
          scopedSlots: {
            customRender: 'waybillStatus'
          }
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
          dataIndex: 'totalValue'
          // scopedSlots: { customRender: 'totalValue' }
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
        this.queryParam.settlementObjectType = 2 // 结算对象 1:客户 2：承运商 3：司机 4：服务商
        if (parameter.receiptTypeName) {
          parameter.receiptType = parameter.receiptTypeName.toString()
          delete parameter.receiptTypeName
        }
        let params = {
          settlementObjectType: 2
        }
        params.settlementStyle = this.queryParam.settlementStyle
        if (this.queryParam.settlementType) {
          params.settlementType = String(this.queryParam.settlementType).charAt(1)
        }
        if (this.queryParam.partnerId) {
          params.commonCarrierId = this.queryParam.partnerId
        } else {
          params.commonCarrierName = this.queryParam.partnerName
        }
        return getCostCheckList(Object.assign(parameter, params)).then(
          res => {
            console.log('res data==', res)
            this.allPageList = res.data.records
            return res.data
          }
        )
      },
      tableData: []
    }
  },
  created () {

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
    showModal () {
      this.visible = true
      this.$set(this.queryParam, 'documentId', this.queryParamData.documentId)
      this.$set(this.queryParam, 'settlementStyle', this.queryParamData.payPeriod)
      console.log('this.queryParamData.settlementType', this.queryParamData.settlementType)
      let settlementType = this.queryParamData.settlementType + ''
      let type = settlementType.substr(0, 2) + '0'
      this.$set(this.queryParam, 'settlementType', parseFloat(type))
      // this.$set(this.queryParam, 'settlementType', settlementType.charAt(1))
      this.$set(this.queryParam, 'partnerId', this.queryParamData.partnerId)
      this.$set(this.queryParam, 'partnerName', this.queryParamData.partnerName)
      this.allPageList = []
      this.getAllPartnerList() // 获取客户名称信息
      this.getAllCarriersList() // 获取承运商信息
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
          this.allPageList.forEach(row => {
            if (row.settleId === v) {
              varibaleAmount = wmath.add(varibaleAmount, row.settlementFee)
            }
          })
          settleIds += `${v},`
        })
        console.log('查看value了e', this.selectedRowKeys, this.allPageList)
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
    // 获取承运方列表
    getAllCarriersList () {
      getAllPartners({ partnerTypes: 2 }).then(res => {
        let arr = []
        if (res.data && res.data.length) {
          res.data.forEach((item, index) => {
            arr.push({
              ...item,
              value: item.partnerId,
              text: item.partnerName
            })
          })
        }
        this.allCarriersList = arr
      })
    },
    // 过滤承运方列表
    filterCarrierOption (input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },
    // 结算方式change
    settlementStyleChange (val) {
      if (this.queryParam.settlementType !== 220 && val === 3) {
        this.queryParam.settlementStyle = 1
        this.$message.error('赔偿费用与索赔费用不支持到付方式！')
      }
    },
    // 费用类型change
    settlementTypeChange (val) {
      if (val !== 220 && this.queryParam.settlementStyle === 3) {
        this.queryParam.settlementType = 220
        this.$message.error('赔偿费用与索赔费用不支持到付方式！')
      }
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
    handleReset () {
      this.queryParam.waybillCode = undefined
      this.queryParam.regionIds = undefined
      this.defaultDate = moment()
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
