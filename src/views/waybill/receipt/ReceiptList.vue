<template>
  <div class="page-container">
    <div style="background:#fff" :bordered="false"
            class="card-container tabbar-container">
      <div class="table-page-search-wrapper">
        <a-menu v-model="current"
                mode="horizontal">
          <a-menu-item @click="getReceiptList(1)"
                       key="s_all">全部</a-menu-item>
          <a-menu-item @click="getReceiptList(2,true)"
                       key="s_register">待登记 {{nosign}}</a-menu-item>
          <a-menu-item @click="getReceiptList(3,true)"
                       key="s_send">待寄出 {{registered}}</a-menu-item>
          <a-menu-item @click="getReceiptList(4,true)"
                       key="s_sign">待签收 {{mailed}}</a-menu-item>
        </a-menu>
      </div>
    </div>
    <a-card :bordered="false"
            class="card-container"
            style="margin-top:10px;">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :md="5"
                   :sm="24">
              <a-form-item label="客户名称：">
                <a-auto-complete :dataSource="clientNameMap"
                                 @change="ClientNameChange"
                                 v-model="queryParam.partnerId"
                                 placeholder="请选择客户名称" />
              </a-form-item>
            </a-col>
            <a-col :md="5"
                   :sm="24">
              <a-form-item label="运单号：">
                <a-input v-model="queryParam.waybillCode"
                         placeholder="请输入运单号" />
              </a-form-item>
            </a-col>
            <a-col :md="7"
                   :sm="24">
              <a-form-item label="客户单号：">
                <a-input v-model="queryParam.clientCode"
                         placeholder="请输入客户单号" />
              </a-form-item>
            </a-col>
            <a-col v-if="!advanced"
                   :md="7"
                   :sm="24"
                   class="operation">
              <span style="margin-right:10px">
                <a-button @click="handleQueryBtnClick"
                          type="primary">查询</a-button>
              </span>
              <span style="margin-right:10px;">
                <a-button @click="deleteQuery"
                          type="default">重置</a-button>
              </span>
              <span @click="advanced=!advanced"
                    style="color:#1890FF;cursor:pointer;"> 展开
                <a-icon type="down" />
              </span>
            </a-col>
          </a-row>
          <div v-if="advanced">
            <a-row :gutter="24">
              <a-col :md="5"
                    :sm="24">
                <a-form-item label="调度单号：">
                  <a-input v-model="queryParam.dispatchCode"
                          placeholder="请输入调度单号" />
                </a-form-item>
              </a-col>
              <a-col :md="5"
                    :sm="24">
                <a-form-item label="开单时间：">
                  <a-range-picker v-model="orderDateRange" @change="onChangeDate" />
                </a-form-item>
              </a-col>
              <a-col :md="7"
                    :sm="24">
                <a-form-item label="托运日期：">
                  <a-range-picker v-model="transportDateRange"  @change="onChangeTransportDate" />
                </a-form-item>
              </a-col>
              </a-row>
            <a-row :gutter="24">
              <a-col :md="5"
                    :sm="24">
                <a-form-item label="收货方：">
                  <a-input v-model="queryParam.rvName"
                          placeholder="请输入收货方名称" />
                </a-form-item>
              </a-col>
              <a-col :md="5"
                    :sm="24">
                <a-form-item label="发货方：">
                  <a-input v-model="queryParam.sdName"
                          placeholder="请输入发货方名称" />
                </a-form-item>
              </a-col>
              <a-col :md="7"
                    :sm="24">
                <a-form-item label="承运方：">
                  <a-input v-model="queryParam.carrierName"
                          placeholder="请输入承运方名称" />
                </a-form-item>
              </a-col>
              </a-row>
            <a-row :gutter="24">
              <a-col :md="5"
                    :sm="24">
                <a-form-item label="要求返回时间：">
                  <a-range-picker v-model="returnDateRange" @change="onChangeReturnDate" />
                </a-form-item>
              </a-col>
              <a-col :md="7"
                    :sm="24"
                    class="operation">
                <span style="margin-right:10px">
                  <a-button @click="handleQueryBtnClick"
                            type="primary">查询</a-button>
                </span>
                <span style="margin-right: 10px;">
                  <a-button @click="deleteQuery"
                            type="default">重置</a-button>
                </span>
                <span @click="advanced=!advanced"
                      style="color:#1890FF;cursor:pointer;"> 收起
                  <a-icon type="down" />
                </span>
              </a-col>
            </a-row>
          </div>
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
            <a-button v-if="is_all"
                      @click="showModal(3)"
                      type="primary">登记</a-button>
            <a-button v-if="is_register"
                      @click="showModal(1)"
                      type="primary"
                      style="margin-left:10px;">收货人签收</a-button>
            <a-button v-if="is_send"
                      @click="showModal0"
                      type="primary"
                      style="margin-left:10px;">寄出</a-button>
            <a-button v-if="is_sign"
                      @click="showModal(2)"
                      type="primary"
                      style="margin-left:10px;">货主签收</a-button>
          </a-col>
          <a-col :md="8"
                 :sm="24"
                 style="text-align: right;">
            <!-- <import-export :needExport="true" @exportClick="handleExportClick"/> -->
            <template></template>
          </a-col>
        </a-row>
      </div>
      <s-table :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange,getCheckboxProps: getCheckboxProps}"
               :columns="columns"
               :data="loadData"
               ref="table"
               bordered
               :showAlertInfo="false"
               :scroll="{ x: scrollX }"
                @change="tableChange">
        <span slot="exceptionStatus"
              slot-scope="text, record">{{record.exceptionStatusName}}</span>
        <template slot="operation"
                  slot-scope="text, record">
          <a href="javascript:;"
             @click="$refs.UploadReceipt.add(record.waybillId)">上传回单</a>
        </template>
        <a slot="waybillCode"
           slot-scope="text, record"
           @click="handleDetail(record)">{{text}}</a>
        <span slot="recepitStatus"
              slot-scope="text, record">{{record.recepitStatusName}}</span>
      </s-table>
      <a-modal title="寄出回单"
               :width="600"
               :visible="visible"
               @ok="handleOk"
               :confirmLoading="confirmLoading"
               @cancel="handleCancel(0)">
        <a-spin :spinning="confirmLoading">
          <a-form :form="form">
            <a-form-item :labelCol="labelCol"
                         :wrapperCol="wrapperCol"
                         label='交接单号'
                         hasFeedback>
              <a-input v-model="send.mailCode"
                       placeholder='请输入交接单号'
                       disabled />
            </a-form-item>
            <a-form-item :labelCol="labelCol"
                         :wrapperCol="wrapperCol"
                         label='递送方式'
                         hasFeedback>
              <a-select defaultValue="快递"
                        @change="waybillStatusChange">
                <a-select-option :value="1">快递</a-select-option>
                <a-select-option :value="2">随车送</a-select-option>
                <a-select-option :value="3">其他</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item :labelCol="labelCol"
                         :wrapperCol="wrapperCol"
                         label='快递单位'
                         hasFeedback>
              <a-input v-model="send.expressName"
                       placeholder='请输入快递单位'
                       style="display: inline-block;" />
            </a-form-item>
            <a-form-item :labelCol="labelCol"
                         :wrapperCol="wrapperCol"
                         label='快递单号'
                         hasFeedback>
              <a-input v-model="send.expressCode"
                       placeholder='请输入快递单号' />
            </a-form-item>
            <a-form-item :labelCol="labelCol"
                         :wrapperCol="wrapperCol"
                         label='备注'
                         hasFeedback>
              <a-textarea v-model="send.remark"
                          :rows="5"
                          placeholder="最多可输入50个汉字" />
            </a-form-item>
          </a-form>
        </a-spin>
      </a-modal>
      <a-modal title="收货人签收"
               :width="480"
               :visible="visible1"
               @ok="handleOk1"
               :confirmLoading="confirmLoading1"
               @cancel="handleCancel(1)">
        <a-spin :spinning="confirmLoading1">
          <a-form :form="form">
            <a-form-item :labelCol="labelCol"
                         :wrapperCol="wrapperCol"
                         label='签收人'
                         hasFeedback>
              <a-input v-model="signer1"
                       placeholder='请输入签收人' />
            </a-form-item>
            <a-form-item :labelCol="labelCol"
                         :wrapperCol="wrapperCol"
                         label='签收时间'
                         hasFeedback>
              <a-date-picker showTime
                             format="YYYY-MM-DD HH:mm:ss"
                             v-model="signer1time"
                             @change="onChanged1" />
            </a-form-item>
          </a-form>
        </a-spin>
      </a-modal>
      <a-modal title="货主签收"
               :width="480"
               :visible="visible2"
               @ok="handleOk2"
               :confirmLoading="confirmLoading2"
               @cancel="handleCancel(2)">
        <a-spin :spinning="confirmLoading2">
          <a-form :form="form">
            <a-form-item :labelCol="labelCol"
                         :wrapperCol="wrapperCol"
                         label='签收人'
                         hasFeedback>
              <a-input v-model="signer2"
                       placeholder='请输入签收人' />
            </a-form-item>
            <a-form-item :labelCol="labelCol"
                         :wrapperCol="wrapperCol"
                         format="YYYY-MM-DD HH:mm:ss"
                         label='签收时间'
                         showTime
                         hasFeedback>
              <a-date-picker showTime
                             format="YYYY-MM-DD HH:mm:ss"
                             v-model="signer2time"
                             @change="onChanged2" />
            </a-form-item>
            <a-form-item :labelCol="labelCol"
                         :wrapperCol="wrapperColimg"
                         label='上传图片'
                         hasFeedback>
              <a-upload class="myUpload"
                        :action="uploadPictureUrl"
                        listType="picture-card"
                        :fileList="fileList"
                        @preview="handlePreview"
                        :headers="headers"
                        @change="handleChange">
                <div v-if="fileList.length < 9">
                  <a-icon type="plus" />
                  <div class="ant-upload-text">上传图片</div>
                </div>
              </a-upload>
              <a-modal :visible="previewVisible"
                       :footer="null"
                       @cancel="handleCancelimg">
                <img alt="example"
                     style="width: 100%"
                     :src="previewImage">
              </a-modal>
            </a-form-item>
          </a-form>
        </a-spin>
      </a-modal>
      <a-modal title="确认"
               :visible="visible3"
               @ok="handleOkchange"
               :confirmLoading="confirmLoading3"
               @cancel="handleCancel(3)">
        <p>您确认执行此操作吗？</p>
      </a-modal>
    </a-card>
    <upload-receipt ref="UploadReceipt"
                    @hideForm="$refs.table.refresh()"></upload-receipt>
  </div>
</template>
<script>
import { throttle, trim } from 'lodash'
import STable from '@/components/table'
import { countCollumnsWidth } from '@/utils/util'
import { getReceiptList1, changeReceiptStatus, receiptSend, genMailCode, getRecut } from '@/api/receipt/receipt.js'
import { getAllPartners } from '@/api/resource/partner'
import { mapGetters } from 'vuex'
import moment from 'moment'
import UploadReceipt from '@views/waybill/components/UploadReceipt'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { getUploadPictureUrl } from '@/api/common'
import fileBase from '@views/mixins/file_base'
// import ImportExport from '@/components/ImportExport'
import qs from 'qs'
const columns = [
  {
    title: '运单号',
    width: 180,
    dataIndex: 'waybillCode',
    scopedSlots: { customRender: 'waybillCode' }
  },
  {
    title: '客户名称',
    width: 100,
    dataIndex: 'partnerName'
  },
  {
    title: '客户单号',
    width: 140,
    dataIndex: 'clientCode'
  },
  {
    title: '手工单号',
    width: 140,
    dataIndex: 'manualCode'
  },
  {
    title: '回单状态',
    width: 120,
    dataIndex: 'recepitStatus',
    key: 'recepitStatus',
    scopedSlots: { customRender: 'recepitStatus' },
    filters: [
      { text: '待登记', value: '1' },
      { text: '待寄出', value: '3' },
      { text: '待确认', value: '4' },
      { text: '已确认', value: '5' }]
  },
  {
    title: '发货方名称',
    width: 140,
    dataIndex: 'sdName'
  },
  {
    title: '收货方名称',
    width: 140,
    dataIndex: 'rvName'
  },
  {
    title: '异常状态',
    width: 120,
    dataIndex: 'exceptionStatus',
    key: 'exceptionStatus',
    scopedSlots: { customRender: 'exceptionStatus' },
    filters: [
      { text: '是', value: '1' },
      { text: '否', value: '2' }
    ]
  },
  {
    title: '承运方',
    width: 100,
    dataIndex: 'carrierName'
  },
  {
    title: '回单份数',
    width: 100,
    dataIndex: 'receiptAmount'
  },
  {
    title: '上传份数',
    width: 100,
    dataIndex: 'updCut'
  },
  {
    title: '要求返回时间',
    width: 140,
    dataIndex: 'returnDate'
  },
  {
    title: '签收时间',
    width: 180,
    dataIndex: 'recepitDate'
  },
  {
    title: '件数',
    width: 80,
    dataIndex: 'totalAmount'
  },
  {
    title: '重量',
    width: 80,
    dataIndex: 'totalTargetWeight'
  },
  {
    title: '体积',
    width: 80,
    dataIndex: 'totalTargetVolume'
  },
  {
    title: '操作',
    width: 100,
    fixed: 'right',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' }
  }
]

const data = []
export default {
  name: 'ReceiptList',
  mixins: [fileBase],
  components: {
    STable,
    UploadReceipt
    // ImportExport
  },
  data () {
    const { externalType } = this.$route.params
    return {
      externalType,
      form: this.$form.createForm(this),
      headers: {
        authorization: Vue.ls.get(ACCESS_TOKEN)
      },
      previewVisible: false,
      previewImage: '',
      fileList: [],
      uploadPictureUrl: getUploadPictureUrl(), // 上传图片
      loading: false,
      visible: false,
      confirmLoading: false,
      visible1: false,
      confirmLoading1: false,
      visible2: false,
      confirmLoading2: false,
      visible3: false,
      confirmLoading3: false,
      nosign: 0,
      mailed: 0,
      registered: 0,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 10 }
      },
      wrapperColimg: { span: 16 },
      nowTimes: '',
      // form: null,
      current: ['s_all'],
      is_all: false,
      is_register: false,
      is_send: false,
      is_sign: false,
      signer1: '',
      signDate1: '',
      signer1time: null,
      signer2: '',
      signDate2: '',
      signer2time: null,
      orderDateRange: [moment(this.timeFormate(new Date(new Date() - 1000 * 60 * 60 * 24 * 30)), 'YYYY-MM-DD'), moment(this.timeFormate(new Date()), 'YYYY-MM-DD')],
      returnDateRange: [],
      transportDateRange: [],
      mdl: {},
      // 高级搜索 展开/关闭
      advanced: false,
      allPartnerList: [], // 客户名称列表
      clientNameMap: [],
      // 查询参数
      queryParam: {
        partnerId: '',
        orderStart: '',
        orderEnd: '',
        transportDateStart: '',
        transportDateEnd: '',
        returnDateStart: '',
        returnDateEnd: '',
        clientCode: '',
        dispatchCode: '',
        carrierName: '',
        partnerName: '',
        waybillCode: '',
        sdName: '',
        rvName: ''
        // recepitStatus: ''
      },
      // 寄出回单
      send: {
        mailCode: '',
        expressType: 1,
        expressName: '',
        expressCode: '',
        remark: '',
        bizStatus: 1
      },
      columns,
      data,
      loadData: parameter => {
        console.log('queryParam', this.queryParam)
        console.log('parameter', parameter)
        if (!this.queryParam.orderStart) {
          this.queryParam.orderStart = this.timeFormate(new Date(new Date() - 1000 * 60 * 60 * 24 * 30))
          this.queryParam.orderEnd = this.timeFormate(new Date())
        }
        // console.log(this.queryParam)

        /* 后端叫加上,表示回单 */
        const extraParam = { statusType: 1 }
        return getReceiptList1(Object.assign(parameter, this.queryParam, extraParam)).then(res => {
          this.data = res.data.records
          return res.data
        })
      },
      selectedColumns: [],
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  created () {
    this.selectedColumns = this.columns.slice(0)
    this.scrollX = countCollumnsWidth(columns)
    this.getReceiptList(1)
  },
  mounted () {
    this.getRecutdata()
    this.getAllPartnerList() // 获取客户名称信息
    this.init()
    console.log('externalType515', this.externalType)
    if (this.externalType) {
      this.current = ['s_register']
      this.getReceiptList(2, true)
    }
  },
  computed: {
    ...mapGetters(['tenantId'])
  },
  methods: {
    tableChange (pagination, filters, sorter) {
      for (let key in filters) {
        this.queryParam[key] = filters[key]
      }
    },
    handleQueryBtnClick () {
      const currentTab = this.current[0]
      switch (currentTab) {
        case 's_all':
          this.getReceiptList(0)
          break
        case 's_register':
          this.getReceiptList(2, true)
          break
        case 's_send':
          this.getReceiptList(3, true)
          break
        case 's_sign':
          this.getReceiptList(4, true)
          break
      }
    },
    moment,
    handleExportClick () {
      // exportProfitList(this.queryParam).then(res => {
      //   // console.log('handleExportClick>res', res)
      // })
      const url =
        `http://${document.location.host}/api/order/report/exportProfit?${qs.stringify(this.queryParam)}&Authorization=${Vue.ls.get(ACCESS_TOKEN)}`
      window.open(url)
    },
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
    onSelectChange (selectedRowKeys) {
      this.selectedRows = []
      let _this = this
      this.selectedRowKeys = selectedRowKeys
      selectedRowKeys.forEach(function (item, i) {
        _this.selectedRows.push(_this.data[item].waybillId)
      })
      // console.log(this.selectedRows)
    },
    getRecutdata () {
      if (!this.queryParam.orderStart) {
        this.queryParam.orderStart = this.timeFormate(new Date(new Date() - 1000 * 60 * 60 * 24 * 30))
        this.queryParam.orderEnd = this.timeFormate(new Date())
      }
      getRecut({ orderStart: this.queryParam.orderStart, orderEnd: this.queryParam.orderEnd }).then(res => {
        // console.log(res)
        this.registered = res.data.registered
        this.nosign = res.data.nosign
        this.mailed = res.data.mailed
      })
    },
    getCheckboxProps: record => ({
      props: {
        disabled: record.recepitStatus === 9 || record.recepitStatus === 10
      }
    }),
    updateReceipt (info) {
      // console.log('上传回单')
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (info.file.status === 'done') {
        this.$message.success(`${info.file.name} file uploaded successfully`)
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} file upload failed.`)
      }
    },
    waybillStatusChange (value) {
      this.send.expressType = value
    },
    // 查看详情
    handleDetail (record) {
      // console.log(record)
      window.location.href = `/waybill/#/waybill/detail/${record.waybillId}`
      // this.$router.push({
      //   name: 'WaybillDetail',
      //   params: { id: record.waybillId }
      // })
    },
    getReceiptList (type, isCloseFilters) {
      if (isCloseFilters === true) {
        this.columns.forEach(v => {
          if (v.dataIndex === 'recepitStatus') {
            v.filters = []
          }
        })
      } else {
        this.columns.forEach(v => {
          if (v.dataIndex === 'recepitStatus') {
            v.filters = [
              { text: '待登记', value: '1' },
              { text: '待寄出', value: '3' },
              { text: '待确认', value: '4' },
              { text: '已确认', value: '5' }]
          }
        })
      }
      // if (type !== 0) {
      //   this.selectedRowKeys = []
      //   this.deleteQuery()
      // }
      this.selectedRowKeys = []
      switch (type) {
        case 1:
          this.queryParam.recepitStatus = ''
          this.is_all = true
          this.is_register = false
          this.is_send = false
          this.is_sign = false
          break
        case 2:
          this.queryParam.recepitStatus = [1]
          this.is_all = true
          this.is_register = false
          this.is_send = false
          this.is_sign = false
          break
        case 3:
          this.queryParam.recepitStatus = [3]
          this.is_all = false
          this.is_register = false
          this.is_send = true
          this.is_sign = false
          break
        case 4:
          this.queryParam.recepitStatus = [4]
          this.is_all = false
          this.is_register = false
          this.is_send = false
          this.is_sign = true
          break
        default:
          this.queryParam.recepitStatus = ''
          break
      }
      this.getRecutdata()
      this.$refs.table.refresh()
    },
    deleteQuery () {
      this.queryParam = {
        partnerId: undefined,
        partnerName: '',
        waybillCode: '',
        // recepitStatus: '',
        sdName: '',
        rvName: ''
      }
      this.returnDateRange = []
      this.transportDateRange = []
      this.onChangeReturnDate(null, [undefined, undefined])
      this.onChangeTransportDate(null, [undefined, undefined])
      this.orderDateRange = [moment(this.timeFormate(new Date(new Date() - 1000 * 60 * 60 * 24 * 30)), 'YYYY-MM-DD'), moment(this.timeFormate(new Date()), 'YYYY-MM-DD')]
      this.$refs.table.refresh()
      // this.startValue = null
    },
    onChanged1 (date, dateString) {
      this.signDate1 = dateString
      // console.log(date, dateString)
    },
    onChanged2 (date, dateString) {
      this.signDate2 = dateString
      // console.log(date, dateString)
    },
    onChangeDate (dates, dateStrings) {
      this.queryParam.orderStart = dateStrings[0]
      this.queryParam.orderEnd = dateStrings[1]
      // console.log('From: ', dateStrings[0], ', to: ', dateStrings[1])
    },
    onChangeTransportDate (dates, dateStrings) {
      this.queryParam.transportDateStart = dateStrings[0]
      this.queryParam.transportDateEnd = dateStrings[1]
      // console.log('From: ', dateStrings[0], ', to: ', dateStrings[1])
    },
    onChangeReturnDate (dates, dateStrings) {
      this.queryParam.returnDateStart = dateStrings[0]
      this.queryParam.returnDateEnd = dateStrings[1]
    },
    showModal0 () {
      if (this.selectedRowKeys.length <= 0) {
        this.$message.info('请选择运单')
      } else {
        genMailCode({ tenantId: this.tenantId }).then(res => {
          // console.log(res)
          this.send.mailCode = res.data
          this.visible = true
        })
      }
    },
    showModal (type) {
      // console.log(this.selectedRowKeys)
      if (this.selectedRowKeys.length <= 0) {
        this.$message.info('请选择运单')
      } else {
        switch (type) {
          case 1:
            this.visible1 = true
            break
          case 2:
            this.visible2 = true
            break
          case 3:
            this.visible3 = true
            break
          default:
            break
        }
      }
    },
    handleOk (e) {
      if (this.send.remark.length > 50) {
        this.$message.info('备注最长可输入50个字')
        return false
      } else {
        this.confirmLoading = true
      }
      let tmpValues = { waybillIds: this.selectedRows, bizStatus: 4 }
      const sendObj = Object.assign(this.send, tmpValues)
      receiptSend(sendObj).then(res => {
        // console.log(res)
        if (res.code === 0) {
          let tmpValues = { waybillIds: this.selectedRows, status: 4 }
          changeReceiptStatus(tmpValues).then(res => {
            // console.log(res)
            this.$message.success('操作成功')
            this.getReceiptList(3, true)
          }).catch(error => {
            this.confirmLoading = false
            this.$message.fail(error)
          })
          // this.getReceiptList()
        } else {
          this.$message.fail('操作失败')
        }
        this.confirmLoading = false
        this.visible = false
        this.send.expressName = ''
        this.send.expressCode = ''
        this.send.remark = ''
      }).catch(error => {
        this.confirmLoading = false
        this.$message.fail(error)
      })
    },
    handleOk1 (e) {
      this.confirmLoading1 = true
      let tmpValues = { waybillIds: this.selectedRows, status: 2, receiver: this.signer1, recepitdate: this.signDate1 }
      console.log(tmpValues)
      changeReceiptStatus(tmpValues).then(res => {
        // console.log(res)
        this.getReceiptList(4, true)
        this.confirmLoading1 = false
        this.visible1 = false
        this.signer1 = ''
        this.signer1time = null
      }).catch(error => {
        this.confirmLoading1 = false
        this.$message.fail(error)
      })
    },
    handleOk2 (e) {
      this.confirmLoading2 = true

      const loadImg = []
      this.fileList.forEach(function (item, i) {
        loadImg.push(item.response.data)
      })
      let tmpValues = { waybillIds: this.selectedRows, status: 5, receiver: this.signer2, recepitdate: this.signDate2, images: loadImg && JSON.stringify(loadImg) }
      console.log('loadImg515', loadImg)
      console.log(tmpValues)
      // return false
      changeReceiptStatus(tmpValues).then(res => {
        // console.log(res)
        this.confirmLoading2 = false
        this.visible2 = false
        this.signer2 = ''
        this.signer2time = null
        this.fileList = []
        this.getReceiptList(4, true)
      }).catch(error => {
        this.confirmLoading2 = false
        this.$message.fail(error)
      })
      setTimeout(() => {
        this.visibl2 = false
        this.confirmLoading2 = false
      }, 2000)
    },
    handleOkchange (e) {
      this.confirmLoading3 = true
      // console.log(this.selectedRows)
      let tmpValues = { waybillIds: this.selectedRows, status: 3 }
      console.log(tmpValues)
      changeReceiptStatus(tmpValues).then(res => {
        // console.log(res)
        this.confirmLoading3 = false
        this.visible3 = false
        this.selectedRowKeys = []
        this.$refs.table.refresh()
        this.getReceiptList(2, true)
      }).catch(error => {
        this.confirmLoading3 = false
        this.$message.fail(error)
      })
    },
    handleCancel (type) {
      switch (type) {
        case 0:
          this.visible = false
          this.send.expressName = ''
          this.send.expressCode = ''
          this.send.remark = ''
          break
        case 1:
          this.visible1 = false
          this.signer1 = ''
          this.signer1time = null
          break
        case 2:
          this.visible2 = false
          this.fileList = []
          this.signer2 = ''
          this.signer2time = null
          break
        case 3:
          this.visible3 = false
          break
        default:
          break
      }
    },
    handleCancelimg () {
      this.previewVisible = false
    },
    handlePreview (file) {
      this.previewImage = file.url || file.thumbUrl
      this.previewVisible = true
    },
    handleChange ({ file, fileList }) {
      fileList.forEach(f => {
        if (f.type === 'application/pdf') {
          f.thumbUrl = require('@/assets/pdf.png')
        }
      })
      this.fileChange(file, fileList, 'certUrl', 'fileList')
    },
    beforeUpload (file) {
      let newtime = new Date().getTime()
      this.nowTimes = this.nowTimes ? this.nowTimes : newtime
      let leadtime = newtime - this.nowTimes
      this.nowTimes = newtime
      const isJPG =
        ['image/jpeg', 'image/png', 'image/bmp', 'application/pdf'].indexOf(file.type) > -1
      if (!isJPG && (leadtime > 100 || leadtime === 0)) {
        this.$message.info('只支持jpg.png.bmp.pdf格式!')
      }
      const isLt2M = file.size / 1024 / 1024 < 4
      if (!isLt2M && (leadtime > 100 || leadtime === 0)) {
        this.$message.info('上传图片不能大于4M!')
      }
      return isJPG && isLt2M
    },
    timeFormate (timeStamp) {
      let year = new Date(timeStamp).getFullYear()
      let month = new Date(timeStamp).getMonth() + 1 < 10 ? '0' + (new Date(timeStamp).getMonth() + 1) : new Date(timeStamp).getMonth() + 1
      let date = new Date(timeStamp).getDate() < 10 ? '0' + new Date(timeStamp).getDate() : new Date(timeStamp).getDate()
      this.nowTime = year + '-' + month + '-' + date
      return this.nowTime
    }
  }
}
</script>
<style lang="less" scoped>
.operation {
  margin-top: 10px;
}
.ant-menu-item {
  margin-right: 20px;
  line-height: 40px;
}
.ant-menu-horizontal {
  .ant-menu-item-active {
    border-bottom: 2px solid transparent;
  }
}
</style>
