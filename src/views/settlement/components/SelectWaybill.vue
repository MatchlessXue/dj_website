<template>
  <div class="total">
    <a-modal
      :visible="visible"
      :maskClosable="false"
      :centered="true"
      @ok="handleadd"
      @cancel="handleaddCancel"
      :title="title"
    >
      <a-card :bordered="false"
            class="card-container" style="margin-top:10px;">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :md="6"
                   :sm="24">
              <a-form-item label="运单号：">
                <a-input v-model="queryParam.waybillCode" placeholder="请输入运单号" />
              </a-form-item>
            </a-col>
            <a-col :md="6"
                   :sm="24">
              <a-form-item label="调度单号：">
                <a-input v-model="queryParam.dispatchCode" placeholder="请输入调度单号" />
              </a-form-item>
            </a-col>
            <a-col :md="6"
                   :sm="24">
              <a-form-item label="客户名称：">
                <a-input v-model="queryParam.partnerName" placeholder="请输入客户名称" />
              </a-form-item>
            </a-col>
            <a-col :md="6"
                   :sm="24">
              <a-form-item label="承运商：">
                <a-input v-model="queryParam.carrierName" placeholder="请输入承运商名称" />
              </a-form-item>
            </a-col>
          </a-row>
           <a-row :gutter="24">
            <a-col :md="6"
                   :sm="24">
              <a-form-item label="司机：">
                <a-input v-model="queryParam.driverName" placeholder="请输入司机名称" />
              </a-form-item>
            </a-col>
            <a-col :md="6"
                   :sm="24">
              <a-form-item label="车牌号：">
                <a-input v-model="queryParam.plateNumber" placeholder="请输入车牌号" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label='运单状态：' hasFeedback >
                <a-select placeholder="不限" @change="waybillStatusChange">
                  <a-select-option :value="3">待提货</a-select-option>
                  <a-select-option :value="4">运输中</a-select-option>
                  <a-select-option :value="0">不限</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6"
                   :sm="24" class="operation">
              <span style="margin-right:10px">
                <a-button @click="getReceiptList(0)" type="primary">查询</a-button>
              </span>
              <span style="margin-right: 10px;">
                <a-button @click="deleteQuery" type="default">重置</a-button>
              </span>
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
            <a-button @click="showModal(1)" type="primary">批量提货</a-button>
            <a-button @click="showModal(2)" type="primary" style="margin-left:10px;">批量送达</a-button>
          </a-col>
          <a-col :md="8" :sm="24" style="text-align: right;">
            <a-button>导出</a-button>
            <template></template>
          </a-col>
        </a-row>

      </div>
      <a-table :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange,getCheckboxProps: getCheckboxProps}" :columns="columns" :dataSource="data" :loading="loading" bordered>
        <template slot="operation" slot-scope="text, record">
          <!-- <a-upload name="file" :multiple="true" action="//jsonplaceholder.typicode.com/posts/" @change="updateReceipt"> -->
            <a @click="showModal(record.waybillStatus,record.waybillId,record.dispatchId)" href="javascript:;">{{text}}</a>
          <!-- </a-upload> -->
        </template>
        <span slot="waybillCode" slot-scope="text, record" @click="handleDetail(record)">{{text}}</span>
        <span slot="waybillStatus" slot-scope="text, record">{{record.status}}
        </span>
      </a-table>
    <a-modal
      :title="modaltitle"
      :width="700"
      :visible="visible"
      :confirmLoading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel(1)"
    >
      <a-spin :spinning="confirmLoading">
        <a-form :form="form">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" :label='labeltext' hasFeedback >
            <a-date-picker showTime format="YYYY-MM-DD HH:mm:ss"  v-model="signer1time"  @change="onChanged1" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label='上传图片' hasFeedback >
            <a-upload
              class="myUpload"
              :action="uploadPictureUrl"
              listType="picture-card"
              :fileList="fileList"
              @preview="handlePreview"
              :headers="headers"
              @change="handleChange"  >
              <div v-if="fileList.length < 10">
                <a-icon type="plus" />
                <div class="ant-upload-text">上传图片</div>
              </div>
            </a-upload>
            <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancelimg">
              <img alt="example" style="width: 100%" :src="previewImage">
            </a-modal>
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label='备注' hasFeedback >
            <a-textarea v-model="signer" :rows="5" placeholder="最多可输入50个汉字" />
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>
    </a-card>
    </a-modal>
  </div>
</template>
<script>
import fileBase from '@views/mixins/file_base'
import { getReceiptList1, batchArrival, batchDelivery } from '@/api/track/track.js'
import { mapGetters } from 'vuex'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { getUploadPictureUrl } from '@/api/common'
import moment from 'moment'
import base from './mixins/base'

const columns = [
  {
    title: '运单号',
    dataIndex: 'waybillCode',
    scopedSlots: { customRender: 'waybillCode' }
  },
  {
    title: '调度单号',
    dataIndex: 'dispatchCode'
  },
  {
    title: '运单状态',
    dataIndex: 'waybillStatus',
    key: 'waybillStatus',
    scopedSlots: { customRender: 'waybillStatus' },
    filters: [
      { text: '待提货', value: '1' },
      { text: '运输中', value: '2' }
    ],
    onFilter: (value, record) => record.waybillStatus === value
  },
  {
    title: '客户名称',
    dataIndex: 'partnerName'
  },
  {
    title: '承运商',
    dataIndex: 'carrierName'
  },
  {
    title: '司机',
    dataIndex: 'driverName'
  },
  {
    title: '车牌号',
    dataIndex: 'plateNumber'
  },
  {
    title: '数量',
    dataIndex: 'totalAmount'
  },
  {
    title: '重量',
    dataIndex: 'totalWeight'
  },
  {
    title: '体积',
    dataIndex: 'totalVolume'
  },
  {
    title: '要求提货时间',
    dataIndex: 'recTime'
  },
  {
    title: '操作',
    width: 100,
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' }
  }
]

const data = []
export default {
  name: 'AbnormalList',
  components: {
    //  SendModal,
  },
  mixins: [fileBase, base],
  data () {
    return {
      headers: {
        authorization: Vue.ls.get(ACCESS_TOKEN)
      },
      modaltitle: '提货确认',
      labeltext: '提货时间',
      modaltype: 1,
      previewVisible: false,
      previewImage: '',
      fileList: [],
      form: this.$form.createForm(this),
      uploadPictureUrl: getUploadPictureUrl(), // 上传图片
      // previewVisible1: false,
      // previewImage1: '',
      loading: false,
      visible: false,
      confirmLoading: false,
      // visible2: false,
      // confirmLoading2: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      signer: '',
      signDate: '',
      signer1time: null,
      // signer2: '',
      // signDate2: '',
      // signer2time: null,
      mdl: {},
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {
        page: 1,
        pageSize: 10,
        waybillCode: '',
        dispatchCode: '',
        partnerName: '',
        carrierName: '',
        driverName: '',
        plateNumber: '',
        waybillStatus: ''
      },
      columns,
      data,
      selectedColumns: [],
      // 加载数据方法 必须为 Promise 对象

      selectedRowKeys: [],
      selectedRows: [],
      dispatchIds: [],
      waybillIds: [],
      uploadImages: [],
      waybillstatuss: [],
      startValue: null
    }
  },
  created () {
    this.selectedColumns = this.columns.slice(0)
    this.getReceiptList()
  },
  computed: {
    ...mapGetters(['tenantId'])
  },
  methods: {
    moment,
    handleCancelimg () {
      this.previewVisible = false
    },
    handlePreview (file) {
      this.previewImage = file.url || file.thumbUrl
      this.previewVisible = true
    },
    handleChange ({ file, fileList }) {
      // console.log(file, fileList)

      this.fileChange(file, fileList, 'certUrl', 'fileList')
    },
    // setFileUrl (detail = {}) {
    //   const { certUrl } = detail
    //   // setFileList方法在mixin中
    //   this.setFileList('certUrl', certUrl, 'fileList')
    // },
    beforeUpload (file) {
      const isJPG =
        ['image/jpeg', 'image/png', 'image/bmp'].indexOf(file.type) > -1
      if (!isJPG) {
        this.$message.info('只能上传jpg、png、bmp格式的图片!')
      }
      const isLt2M = file.size / 1024 / 1024 < 4
      if (!isLt2M) {
        this.$message.info('上传图片不能大于4M!')
      }
      return isJPG && isLt2M
    },
    onSelectChange (selectedRowKeys) {
      this.waybillIds = []
      this.dispatchIds = []
      this.waybillstatuss = []
      let _this = this
      this.selectedRowKeys = selectedRowKeys
      selectedRowKeys.forEach(function (item, i) {
        _this.waybillstatuss.push(_this.data[item].waybillStatus)
        _this.waybillIds.push(_this.data[item].waybillId)
        _this.dispatchIds.push(_this.data[item].dispatchId)
      })
      // console.log(this.selectedRows)
    },
    getCheckboxProps: record => ({
      props: {
        disabled: record.waybillStatus === 3
      }
    }),
    waybillStatusChange (value) {
      value = value === 0 ? '' : value
      this.queryParam.waybillStatus = value
    },
    // 查看详情
    handleDetail (record) {
      // console.log(record)
      // this.$router.push({
      //   name: 'receiptDetail',
      //   params: { id: record.waybillId }
      // })
    },
    getReceiptList (type) {
      this.loading = true
      getReceiptList1(this.queryParam).then(res => {
        res.data.records.forEach(function (item, i) {
          // item.waybillStatus = item.waybillList[0].waybillStatus
          item.status = item.waybillStatus === 1 ? '待提货' : (item.waybillStatus === 2 ? '运输中' : '已送达')
          item.operation = item.waybillStatus === 1 ? '提货' : (item.waybillStatus === 2 ? '送达' : '')
        })
        this.loading = false
        this.data = res.data.records
      })
    },
    deleteQuery () {
      this.queryParam.waybillCode = ''
      this.queryParam.dispatchCode = ''
      this.queryParam.partnerName = ''
      this.queryParam.carrierName = ''
      this.queryParam.driverName = ''
      this.queryParam.plateNumber = ''
      this.queryParam.waybillStatus = ''
    },
    onChanged1 (date, dateString) {
      this.signDate = dateString
      // console.log(date, dateString)
    },
    showModal (type, waybillId, dispatchId) {
      // console.log(type)
      // console.log(this.selectedRowKeys)
      if (!waybillId) {
        if (this.selectedRowKeys.length <= 0) {
          this.$message.info('请选择运单')
          return false
        }
        let _this = this
        let canrequest = true
        this.waybillstatuss.forEach(function (item, i) {
          if ((type === 1 && item === 2) || (type === 2 && item === 1)) {
            canrequest = false
          }
        })
        if (canrequest === false) {
          if (type === 1) {
            _this.$message.info('您选中的调度单中包含运输中状态')
          } else {
            _this.$message.info('您选中的调度单中包含待提货状态')
          }
          return false
        }
      } else {
        this.waybillIds = []
        this.waybillIds.push(waybillId)
        this.dispatchIds = []
        this.dispatchIds.push(dispatchId)
      }

      this.modaltype = type
      this.visible = true
      switch (type) {
        case 1:
          this.modaltitle = '提货确认'
          this.labeltext = '提货时间'
          break
        case 2:
          this.modaltitle = '送达确认'
          this.labeltext = '送达时间'
          break
        default:break
      }
    },
    issuccess (code) {
      if (code === 0) {
        this.$message.success('操作成功')
        this.getReceiptList()
      } else {
        this.$message.fail('操作失败')
      }
      this.confirmLoading = false
      this.visible = false
      this.fileList = []
      this.signer = ''
      this.signer1time = null
    },
    handleOk (e) {
      this.confirmLoading = true
      // console.log(this.fileList)
      let _this = this
      this.fileList.forEach(function (item, i) {
        _this.uploadImages.push(item.response.data)
      })
      // console.log(this.uploadImages)
      let tmpValues = { waybillIds: this.waybillIds, dispatchIds: this.dispatchIds, images: this.uploadImages, deliveryData: this.signDate, remark: this.signer }
      this.modaltype === 1 ? this.batchDeliveryFun(tmpValues) : this.batchArrivalFun(tmpValues)
    },
    batchDeliveryFun (tmpValues) {
      batchDelivery(tmpValues).then(res => {
        // console.log(res)
        this.issuccess(res.code)
      }).catch(error => {
        this.confirmLoading = false
        this.$message.fail(error)
      })
    },
    batchArrivalFun (tmpValues) {
      batchArrival(tmpValues).then(res => {
        console.log(res)
        this.issuccess(res.code)
      }).catch(error => {
        this.confirmLoading = false
        this.$message.fail(error)
      })
    },
    handleCancel (type) {
      this.visible = false
      this.signer = ''
      this.signer1time = null
      this.fileList = []
    }
  }
}
</script>
<style lang="less" scope>

</style>
