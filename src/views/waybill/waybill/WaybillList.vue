<template>
  <div class="page-container">
    <a-card :bordered="false"
            @keyup.enter="$refs.roleTable.refresh()"
            class="card-container">
      <div class="table-page-search-wrapper">
        <a-form layout="inline" :form="form">
          <a-row :gutter="24">
            <a-col :md="6" :sm="24">
              <a-form-item label="客户名称">
                <a-select showSearch
                          allowClear
                          placeholder="请选择客户名称"
                          optionFilterProp="children"
                          @change="clientNameChange"
                          v-model="queryParam.partnerId"
                          :filterOption="filterOption">
                  <a-select-option v-for="partner in allPartnerList"
                                   :key="partner.partnerId">{{partner.partnerName}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="运单号">
                <a-input v-model="queryParam.waybillCode"
                         placeholder="请输入运单号" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="下单时间：">
                <a-range-picker v-decorator="['waybillDate']"
                                :format="'YYYY-MM-DD'"
                                @change="dateOnChange" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24" v-if="!advanced">
              <span class="table-page-search-submitButtons">
                <a-button @click="duSearch('1')"
                          type="primary">查询</a-button>
                <a-button @click="duSearch('2')" class="margin-left-10"
                type="primary">重置</a-button>
                <span @click="advanced=!advanced" style="color:#1890FF;cursor:pointer;"> 展开<a-icon type="down" /></span>
              </span>
            </a-col>
          </a-row>
          <a-row :gutter="24" v-if="advanced">
            <a-col :md="9" :sm="24">
              <a-form-item label="收货方地址：">
                <a-input v-model="queryParam.rvAddress"
                         placeholder="请输入收货方地址" />
              </a-form-item>
            </a-col>
            <a-col :md="9" :sm="24">
              <a-form-item label="收货方名称：">
                <a-input v-model="queryParam.rvName"
                         placeholder="请输入收货方名称" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button @click="duSearch('1')"
                          type="primary">查询</a-button>
                <a-button @click="duSearch('2')" class="margin-left-10"
                type="primary">重置</a-button>
                <span @click="advanced=!advanced" style="color:#1890FF;cursor:pointer;"> 收起<a-icon type="up" /></span>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-card>
    <a-card :bordered="false"
            style="margin-top: 10px"
            class="card-container">
      <div class="table-page-option-wrapper">
        <a-row :gutter="24">
          <a-col :md="16" :sm="24">
            <a-button type="primary" @click="$router.push({ name: 'WaybillAdd' })">
              新建运单
            </a-button>
            <a-button type="primary" style="margin-left:10px;" @click="importWaybill">
              导入运单
            </a-button>
            <a-button type="primary" style="margin-left:10px;" @click="waybillActive">
              提交调度
            </a-button>
            <a-button type="primary" style="margin-left:10px;" @click="printData" :loading="printLoading">
              打印
            </a-button>
          </a-col>
          <a-col :md="8">
            <a-button style="margin-left:12px; float:right;" @click="exportTem">
              导出
            </a-button>
          </a-col>
        </a-row>
      </div>
      <s-table ref="roleTable"
               size="default"
               :columns="selectedColumns"
               :data="loadData"
               @tableData="getTableData"
               rowKey="waybillId"
               :loading="loading"
               :scroll="{ x: 2600}" bordered
               :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }">
        <!-- <span slot="serial" slot-scope="text, record, index">
          {{rowIndex(index)}}
        </span> -->
        <span slot="waybillId"
              slot-scope="text, record">
          <a @click="goDetail(record)">{{text}}</a>
        </span>
        <span slot="action"
              slot-scope="text, record">
          <a @click="waybilledit(record)">修改</a>
          <a-divider type="vertical" />
          <a @click="handleRoleDelete(record)">删除</a>
        </span>
      </s-table>
    </a-card>
    <!--       :moduleType = "1" -->
    <import-template
      ref="importTemplate"
      :moduleType = "1"
      :templateType="templateType"
      :templateSubType="templateSubType"
      :descriptionArr="waybillImportDescArr"
      :allPartnerList="allPartnerList"
      :title="title">
    </import-template>
    <!-- 打印模板 -->
    <a-modal
      title="打印模板"
      v-model="visibleData"
      @ok="contractSubmit"
      okText="确认"
      cancelText="取消"
      width="380px"
      class="tem-modal"
    >
      <a-table
      :rowSelection="{ selectedRowKeys: selectedRowKeyArr, onChange: onTemplateChange }"
      :columns="columned"
      :dataSource="templatedList"
      :pagination="false"
      bordered
      rowKey="orderId"/>
    </a-modal>
    <!-- 导出弹框 -->
    <a-modal
      title="导出"
      :visible="visibleTem"
      @ok="exportOk"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
      width="440px"
      class="export"
      :destroyOnClose="true"
    >
      <span class="export-item">选择模板：</span>
      <a-select
        showSearch
        placeholder="请输入模版名称"
        optionFilterProp="children"
        style="width: 200px"
        @change="handleChange"
        :filterOption="exportFilterOption"
      >
        <a-select-option v-for="item in expTmpList" :key="item.tmpId" :value="item.tmpId">{{item.tmpName}}</a-select-option>
      </a-select>
      <a href="javascript:" class="export-setting" @click="exportSetting">设置</a>
    </a-modal>
    <export-template
      v-if="showExportTemplate"
      v-model="exportVis"
      :tmplateSubType="1"
      :tmplateType="1"
      :waybillId="exportWaybillId"
      :queryParam="clickSearch ? queryParam : {}"></export-template>
    <print-dialog ref="PrintDialogRef" :store="$store" title="运单打印" @success="printLoading=false" :printmenuId="1"></print-dialog>
  </div>
</template>
<script>
import { throttle, trim } from 'lodash'
import moment from 'moment'
import STable from '@/components/table/'
import ImportTemplate from '@/components/ImportTemplate/'

// import RoleModal from '@views/order/components/RoleModal'
// import PartModal from '@views/order/components/PartModal'
// import CheckboxMulty from '@/components/CheckboxMulty'
import { waybillSelectByPage, waybillDelete, waybillActive } from '@/api/waybill/waybill'
import { getExpTmpList } from '@api/export/export'
import { getAllPartners } from '@/api/resource/partner'
import { PrintDialog } from 'dj_print'
export default {
  name: 'WaybillList',
  components: {
    STable,
    ImportTemplate,
    PrintDialog,
    exportTemplate: () => import('@/components/exportTemplate')
    // RoleModal,
    // PartModal,
    // CheckboxMulty
    // CheckboxMulty
  },
  data () {
    return {
      // 是否点击查询（默认false，查询了 true，重置了false）
      clickSearch: false,
      expTmpList: [], // 模板列
      form: this.$form.createForm(this),
      loading: false,
      templateType: 2,
      templateSubType: 1,
      title: '导入运单',
      printLoading: false,
      waybillImportDescArr: [
        '1.单次只能上传一个文件，仅支持扩展名：.xls,xlsx。',
        '2.系统标红字段为必填项。',
        '3.数据表第一行为列头名称，第二行开始为数据。',
        '4.数据表不能有合并单元格，不支持EXCEL公式。',
        '5.客户名称、项目、客户单号、发货方信息、收货方信息一致自动合并运单。'
      ],
      partnerId: '',
      visible: false,
      mdl: {},
      scrollX: '',
      // 高级搜索 展开/关闭
      advanced: false,
      allPartnerList: [], // 客户名称列表
      clientNameMap: [],
      // 查询参数
      queryParam: {
        partnerId: undefined,
        waybillId: '',
        orderEnd: '',
        orderStart: '',
        rvName: '',
        rvAddress: '',
        // page: '1',
        // pageSize: '10',
        waybillCode: ''
      },
      // 表头
      columns: [
        // {
        //   title: '序号',
        //   scopedSlots: { customRender: 'serial' }
        // },
        // {
        //   title: '序号',
        //   render:(text,record,index)=>`${index+1}`,
        // },
        {
          title: '运单号',
          dataIndex: 'waybillCode',
          key: 'waybillCode',
          width: 150,
          fixed: 'left',
          scopedSlots: { customRender: 'waybillId' }
        },
        {
          title: '客户名称',
          dataIndex: 'partnerName',
          key: 'partnerName',
          width: 200
        },
        {
          title: '客户单号',
          dataIndex: 'clientCode',
          key: 'clientCode',
          width: 150
        },
        {
          title: '发货区域',
          dataIndex: 'sdAddressArea',
          key: 'sdAddressArea',
          width: 150
        },
        {
          title: '发货方名称',
          dataIndex: 'sdName',
          key: 'sdName',
          width: 150
        },
        {
          title: '收货区域',
          dataIndex: 'rvAddressArea',
          key: 'rvAddressArea',
          width: 150
        },
        {
          title: '收货方名称',
          dataIndex: 'rvName',
          key: 'rvName',
          width: 150
        },
        {
          title: '收货方地址',
          dataIndex: 'rvAddress',
          key: 'rvAddress',
          width: 150
        },
        {
          title: '运单状态',
          dataIndex: 'waybillStatusName',
          key: 'waybillStatusName',
          width: 150
        },
        {
          title: '件数',
          dataIndex: 'totalAmount',
          key: 'totalAmount',
          width: 150
        },
        {
          title: '重量(kg)',
          dataIndex: 'totalTargetWeight',
          key: 'totalTargetWeight',
          width: 150
        },
        {
          title: '体积(m³)',
          dataIndex: 'totalTargetVolume',
          key: 'totalTargetVolume',
          width: 180
        },
        {
          title: '要求提货时间',
          dataIndex: 'reqDeliveryDate',
          key: 'reqDeliveryDate',
          width: 180
        },
        {
          title: '要求送达时间',
          dataIndex: 'reqArrivalDate',
          key: 'reqArrivalDate',
          width: 180
        },
        {
          title: '回单份数',
          dataIndex: 'receiptAmount',
          key: 'receiptAmount',
          width: 180
        },
        {
          title: '备注',
          dataIndex: 'remark',
          key: 'remark',
          width: 180
        },
        {
          title: '操作',
          width: 110,
          dataIndex: 'action',
          key: 'action',
          fixed: 'right',
          scopedSlots: { customRender: 'action' }
        }
      ],
      selectedColumns: [],
      // 加载数据方法 必须为 Promise 对象
      loadData: params => {
        this.selectedRowKeys = []
        this.selectedRows = []
        // console.log(parameter, 'queryParam=', this.queryParam)
        // this.queryParam.partnerId = this.tenantId
        return waybillSelectByPage(Object.assign(params, this.queryParam)).then(
          res => {
            return res.data
          }
        )
      },
      selectedRowKeys: [], // 选中行运单 [id]
      selectedRows: [], // 选中行整条数据 [obj]
      visibleData: false,
      columned: [{
        title: '模板名称',
        dataIndex: 'name',
        key: 'name',
        width: 310
      }],
      templatedList: [
        {
          name: '模板1'
        }
      ],
      selectedRowKeyArr: [], // 选中的打印模板编号
      visibleTem: false, // 导出弹框
      confirmLoading: false,
      exportCurr: '',
      showExportTemplate: false,
      exportVis: false,
      exportWaybillId: [], // 传递给导出模块的 运单id
      tableData: [] // table数据
    }
  },
  watch: {
    exportVis (val, oldVal) {
      if (oldVal !== val && !val) {
        this.showExportTemplate = false
      }
    }
  },
  created () {
    this.selectedColumns = this.columns.slice(0)
    this.queryParam.orderStart = this.getFirstDay()
    this.queryParam.orderEnd = this.getLastDay()
    this.$nextTick(() => {
      this.form.setFieldsValue({ waybillDate: [moment(this.getFirstDay(), 'YYYY-MM-DD'), moment(this.getLastDay(), 'YYYY-MM-DD')] })
    })
  },
  computed: {
    columnsOption () {
      return this.columns.map(function (item) {
        // console.log(item)
        // console.log({ label: item.title, value: item.key, disabled: item.fixed });
        // return { label: item.title, value: item.key, disabled: item.fixed }，
        return { label: item.title, value: item.key }
      })
    },
    defaultCheckList () {
      return this.columns.map(function (item) {
        return item.key
      })
    }
  },
  mounted () {
    this.getAllPartnerList() // 获取客户名称信息
    this.init()
  },
  methods: {
    // 2019年05月01日18:53:15 新增
    // 点击查询 1， 查询  2 重置
    duSearch (type) {
      if (type === '1') {
        this.clickSearch = true
        this.$refs.roleTable.refresh()
      } else if (type === '2') {
        this.clickSearch = false
        this.resetData()
      }
    },
    moment,
    // dusearch () {
    //   console.log('dusearch')
    // },
    init () {
      getAllPartners({ partnerTypes: 1 }).then(res => {
        const datas = res.data || []
        this.clientNameList = res.data
        // 用于级联的下拉列表的显示只能是如下格式
        let source = []
        datas.forEach((val) => {
          source.push({ value: val.partnerId, text: val.partnerName })
        })
        this.clientNameMap = source
      })
    },
    ClientNameChange: throttle(async function (v) {
      // console.log(v)
      if (v === '') {
        this.init()
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
        await getAllPartners({ partnerName: key, partnerTypes: 1 }).then((res) => {
          const datas = res.data || []
          self.clientNameList = res.data
          // 用于级联的下拉列表的显示只能是如下格式
          let source = []
          datas.forEach((val) => {
            source.push({ value: val.partnerId, text: val.partnerName })
          })
          self.clientNameMap = source
        })
      }
    }, 500),
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
    },
    // 客户名称选择框事件处理方法
    clientNameChange (value) {
      // console.log(`selected ${value}`)
      this.queryParam.partnerId = value
    },
    getAllPartnerList () {
      getAllPartners({ partnerTypes: 1 }).then(res => {
        this.allPartnerList = res.data
      })
    },
    waybillStatusChange (value) {
      value = value === 0 ? '' : value
      this.queryParam.waybillStatus = value
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },
    dateOnChange (date, dateString) {
      // console.log('time', date)
      // console.log('aa', dateString)
      this.queryParam.orderStart = dateString[0]
      this.queryParam.orderEnd = dateString[1]
    },
    // 修改订单
    waybilledit (record) {
      if (record.waybillStatus === 1) {
        this.$router.push({
          name: 'WaybillEdit',
          params: { id: record.waybillId }
        })
      } else {
        this.$message.error('不能修改订单')
      }
    },
    // 订单详情页
    goDetail (record) {
      // console.log('____detail', record)
      // console.log('aa', record.waybillId)
      this.$router.push({
        name: 'WaybillDetail',
        params: { id: record.waybillId }
      })
    },
    handleCheked (checkList) {
      // 过滤
      this.selectedColumns = this.columns.filter(function (item) {
        if (checkList.includes(item.key)) {
          // 在免登录白名单，直接进入
          return item
        }
      })
    },
    rowIndex (index) {
      const { current, pageSize } = this.$refs.roleTable.localPagination
      return (current - 1) * pageSize + index
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handleRoleDelete (record) {
      const that = this
      if (record.waybillStatus === 1) {
        this.$confirm({
          title: '提示',
          content: `确定要删除${record.waybillCode}吗 ?`,
          onOk () {
            return waybillDelete({ waybillId: record.waybillId }).then(res => {
              that.$refs.roleTable.refresh()
            })
          }
        })
      } else {
        this.$message.error('状态不符，不允许删除')
        return false
      }
    },
    onChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    waybillActive () {
      const { selectedRowKeys, selectedRows } = this
      // 校验选择的运单
      if (!selectedRowKeys.length) {
        this.$message.error('请选择运单')
        return false
      }
      var ids = ''
      selectedRows.forEach(function (item, i) {
        if (item.waybillStatus === 1) {
          if (selectedRows.length === i + 1) {
            ids += item.waybillId
          } else {
            ids += item.waybillId + ','
          }
        } else {
          this.$message.error('运单号：[' + item.waybillId + ']状态不符，不可提交调度')
          return false
        }
      })
      const that = this
      this.$confirm({
        title: '提示',
        content: `确定要提交调度吗 ?`,
        onOk () {
          return waybillActive({ waybillIds: ids }).then(res => {
            that.$refs.roleTable.refresh()
          })
        }
      })
    },
    importWaybill () {
      this.$refs.importTemplate.showModal()
    },
    /**
     * @Description: 重置按钮
     * @param : null
     * @return: null
     */
    resetData () {
      // 更改数据 为默认值
      this.queryParam = {
        partnerId: undefined,
        waybillId: '',
        orderEnd: '',
        orderStart: '',
        rvName: '',
        rvAddress: '',
        waybillCode: ''
      }
      this.form.setFieldsValue({ waybillDate: [moment(this.getFirstDay(), 'YYYY-MM-DD'), moment(this.getLastDay(), 'YYYY-MM-DD')] })
      // 强制刷新
      this.$refs.roleTable.refresh()
    },
    /**
     * @Description: 打印-点击
     * @param : null
     * @return: null
     */
    printData () {
      // 判断勾选对象是否为空
      if (!this.selectedRowKeys.length) {
        this.$message.error('请勾选要打印的订单')
        return false
      }
      // 把勾选对象发送后台
      // this.selectedRowKeys
      this.printLoading = true
      this.$refs.PrintDialogRef.print(this.selectedRows)
    },
    /**
     * @Description: 打印-弹框确定按钮
     * @param : null
     * @return: null
     */
    contractSubmit () {},
    /**
     * @Description: 打印-数据选中回调
     * @param : null
     * @return: null
     */
    onTemplateChange (selectedRowKeys) {
      this.selectedRowKeyArr = selectedRowKeys
    },
    getTableData (data) {
      this.tableData = data
    },
    // 导出-设置按钮
    exportSetting () {
      // console.log(this.exportWaybillId)
      this.visibleTem = false
      this.showExportTemplate = true
      this.exportVis = true
    },
    /**
     * @Description: 导出
     * @param : null
     * @return: null
     */
    exportTem () {
      // 先判断有没有选择运单
      // console.log(this.selectedRowKeyArr)
      if (this.selectedRowKeys.length) {
        // 这个是有id的情况，有id只传id就可以了
        // 2019年05月01日18:49:55
        this.exportWaybillId = this.selectedRowKeys
      } else {
        this.exportWaybillId = []
        // // 获取所有的运单id
        // for (let item of this.tableData) {
        //   item.waybillId && this.exportWaybillId.push(item.waybillId)
        // }
      }
      // 请求模板数据
      getExpTmpList({}).then(res => {
        if (res.data) {
          this.expTmpList = res.data
          if (this.expTmpList.length > 0) {
            // this.exportCurr = this.expTmpList[0].tmpName
          }
        }
      })
      this.visibleTem = true
    },
    exportOk () {
      if (trim(this.exportCurr).length <= 0) {
        this.$message.error('请选中导出模板')
        return
      }
      console.log(this.$store.state.user)
      // 把选中行标识发给接口
      let hosturl = '/api/dataio/export/exportByExpTmpId?'
      let parmas = `expTmpId=${this.exportCurr}&ids=${this.exportWaybillId.join(',')}&tmplateSubType=1&tmplateType=1`
      if (this.clickSearch) {
        // 时间急，没来得及做换行
        parmas = parmas + `&partnerId=${this.queryParam.partnerId}&waybillId=${this.queryParam.waybillId}&orderEnd=${this.queryParam.orderEnd}&orderStart=${this.queryParam.orderStart}&rvName=${this.queryParam.rvName}&rvAddress=${this.queryParam.rvAddress}&waybillCode=${this.queryParam.waybillCode}`
      }
      window.open(hosturl + parmas)
      this.visibleTem = false
      this.exportCurr = ''
    },
    handleCancel () {
      // 取消列选中
      this.expTmpList = []
      this.visibleTem = false
      this.exportCurr = ''
    },
    /**
     * @Description: 导出-下拉选中模板
     * @param : null
     * @return: null
     */
    handleChange (value, obj) {
      this.exportCurr = obj.data.key
    },
    exportFilterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
  }
}
</script>
<style lang="less">
  .margin-left-10 {
    margin-left: 10px;
  }
  .tem-modal {
    // .ant-modal-body {
    //   padding: 20px 0 0 0;
    // }
    .ant-modal-footer {
      border: none;
    }
    .ant-table-bordered .ant-table-body > table {
      border: none;
    }
  }
  .export {
    .export-item {
      margin-left: 25px;
    }
    .export-setting {
      margin-left: 20px;
    }
  }
</style>
