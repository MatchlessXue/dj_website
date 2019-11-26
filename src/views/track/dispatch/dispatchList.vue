<template>
  <div class="page-container">
    <a-card :bordered="false" class="card-container">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :md="8" :sm="24">
              <a-form-item label="调度单号：">
                <a-auto-complete :dataSource="SdispatchCode" v-model="queryParam.dispatchCode"
                 placeholder="请输入调度单号" :filterOption="filterOption" :allowClear="true"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="承运方：">
                <a-auto-complete :dataSource="ScarrierName" v-model="queryParam.carrierName"
                 placeholder="请输入项目名称" :filterOption="filterOption" :allowClear="true"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="要求提货时间：">
                <a-range-picker v-model="sDate" :placeholder="['提货开始时间', '提货结束时间']"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="要求送达时间：">
                <a-range-picker v-model="eDate" :placeholder="['送达开始时间', '送达结束时间']"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24" class="operation">
              <span style="margin-right:10px">
                <a-button @click="getReceiptList()" type="primary">查询</a-button>
              </span>
              <a-button @click="handleReset">重置</a-button>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-card>
    <a-card :bordered="false" style="margin-top:10px" class="card-container">
      <div class="table-page-option-wrapper">
        <a-row :gutter="24">
          <a-col :md="16" :sm="24">
            <a-button @click="showModal(1)" type="primary">确认提货</a-button>
            <a-button @click="showModal(2)" type="primary" style="margin-left:10px;">确认送达</a-button>
          </a-col>
        </a-row>
      </div>
      <s-table :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      :columns="columns" :data="loadData" ref="table" bordered :showAlertInfo="false" :scroll="{ x: scrollX }" rowKey="dispatchId">
        <a slot="dispatchCode" slot-scope="text, record" @click="handleDetaild(record)">{{text}}</a>
        <span slot="waybillStatus" slot-scope="text, record">{{record.waybillStatusName}}</span>
        <span slot="bizStatus" slot-scope="text, record">{{record.bizStatusName}}</span>
          <span slot="action" slot-scope="text, record">
            <a @click="expendCharge(3, record)">在途</a>
            <a-divider type="vertical" />
            <a @click="expendCharge(1, record)">特殊费</a>
             <a-divider type="vertical" />
            <a @click="expendCharge(2, record)">异常</a>
          </span>
      </s-table>
      <a-modal :title="modaltitle" :width="700" :visible="visible" :confirmLoading="confirmLoading" @ok="handleOk"  @cancel="handleCancel(1)">
        <a-spin :spinning="confirmLoading">
          <a-form :form="form">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" :label='labeltext' hasFeedback >
              <a-date-picker showTime format="YYYY-MM-DD HH:mm:ss"  v-model="signer1time"  @change="onChanged1" />
            </a-form-item>
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label='上传图片' hasFeedback >
              <a-upload
                class="myUpload"
                :action="uploadPictureUrl" listType="picture-card" :fileList="fileList" @preview="handlePreview"
                :headers="headers" @change="handleChange">
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
      <add-damage ref="AddDamage" @hideForm="$refs.table.refresh()" payType="dispatch"></add-damage>
      <add-claim ref="AddClaim" @hideForm="$refs.table.refresh()" payType="dispatch"></add-claim>
      <feed-back ref="FeedBack" @hideForm="$refs.table.refresh()" payType="dispatch"></feed-back>
    </a-card>
  </div>
</template>
<script>
import fileBase from '@views/mixins/file_base'
import { getReceiptList2, dispatchBizStatus, dispatchTrackConfirmGoods } from '@/api/track/track.js'
import { mapGetters } from 'vuex'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { getUploadPictureUrl } from '@/api/common'
import moment from 'moment'
import STable from '@/components/table'
import { countCollumnsWidth } from '@/utils/util'

import AddDamage from '@views/track/components/AddDamage'
import AddClaim from '@views/track/components/AddClaim'
import FeedBack from '@views/track/components/FeedBack'

const data = []
export default {
  name: 'dispatchList',
  components: {
    STable,
    AddDamage,
    AddClaim,
    FeedBack
  },
  mixins: [fileBase],
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
      visible: false,
      confirmLoading: false,
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
      // 查询参数
      queryParam: {
        timer: '',
        dispatchCode: '',
        carrierName: ''
      },
      sDate: undefined,
      eDate: undefined,
      waybillStatusFilter: [],
      columns: [],
      SwaybillCode: [],
      SdispatchCode: [],
      ScarrierName: [],
      data,
      loadData: parameter => {
        if (this.eDate && this.eDate.length > 0) {
          this.queryParam.stReqArrivalDate = this.eDate[0].format('YYYY-MM-DD') + ' 00:00:00'
          this.queryParam.edReqArrivalDate = this.eDate[1].format('YYYY-MM-DD') + ' 23:59:59'
        } else {
          this.queryParam.stReqArrivalDate = ''
          this.queryParam.edReqArrivalDate = ''
        }
        if (this.sDate && this.sDate.length > 0) {
          this.queryParam.stReqDeliveryDate = this.sDate[0].format('YYYY-MM-DD') + ' 00:00:00'
          this.queryParam.edReqDeliveryDate = this.sDate[1].format('YYYY-MM-DD') + ' 23:59:59'
        } else {
          this.queryParam.stReqDeliveryDate = ''
          this.queryParam.edReqDeliveryDate = ''
        }
        this.queryParam.timer = new Date().getTime()
        this.selectedRowKeys = []
        // this.SwaybillCode = []
        this.SdispatchCode = []
        this.SclientCode = []
        this.ScarrierName = []
        const _this = this
        return getReceiptList2(Object.assign(parameter, this.queryParam)).then(res => {
          console.log(res.data)
          res.data.records.forEach(function (item, i) {
            // _this.SwaybillCode.push(item.waybillCode)
            _this.SdispatchCode.push(item.dispatchCode)
            if (item.carrierName !== '' && item.carrierName !== null) {
              _this.ScarrierName.push(item.carrierName)
            }
            item.waybillStatus = String(item.waybillStatus)
            // item.feedbackname = item.feedBack.length === 0 ? '暂无' : item.feedBack[item.feedBack.length - 1].address
          })
          // this.SwaybillCode = this.unique(this.SwaybillCode)
          this.SdispatchCode = this.unique(this.SdispatchCode)
          this.ScarrierName = this.unique(this.ScarrierName)
          this.data = res.data.records
          console.log(this.data)
          return res.data
        })
      },
      selectedColumns: [],
      selectedRowKeys: [],
      selectedRows: [],
      dispatchIds: [],
      waybillIds: [],
      bizStatusNames: [],
      uploadImages: [],
      bizStatus: [],
      trackNode: [],
      cloumnsChange: [],
      arows: []
    }
  },
  created () {
    this.createCloumns()
    this.selectedColumns = this.columns.slice(0)
    this.scrollX = countCollumnsWidth(this.columns)
  },
  computed: {
    ...mapGetters(['tenantId'])
  },
  methods: {
    moment,
    unique (arr) {
      return Array.from(new Set(arr))
    },
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toUpperCase().indexOf(input.toUpperCase()) >= 0
    },
    createCloumns () {
      dispatchBizStatus({}).then(res => {
        console.log(res)
        for (var i in res.data) {
          this.waybillStatusFilter.push({ text: res.data[i], value: String(i) })
        }
      })
      this.cloumnsChange = [
        {
          hidden: false,
          disabled: true,
          data: {
            title: '调度单号',
            width: 180,
            dataIndex: 'dispatchCode',
            scopedSlots: { customRender: 'dispatchCode' }
          }
        },
        {
          hidden: false,
          disabled: true,
          data: {
            title: '承运方',
            width: 120,
            dataIndex: 'carrierName'
          }
        },
        {
          hidden: false,
          disabled: true,
          data: {
            title: '联系人',
            width: 120,
            dataIndex: 'contact'
          }
        },
        {
          hidden: false,
          disabled: true,
          data: {
            title: '手机号',
            width: 120,
            dataIndex: 'contactMobile'
          }
        },
        {
          hidden: false,
          disabled: true,
          data: {
            title: '状态',
            width: 120,
            dataIndex: 'bizStatus',
            key: 'bizStatus',
            scopedSlots: { customRender: 'bizStatus' },
            filters: this.waybillStatusFilter
            // onFilter: (value, record) => record.waybillStatus === value
          }
        },
        {
          hidden: false,
          disabled: true,
          data: {
            title: '运输方式',
            width: 120,
            dataIndex: 'transportTypeName'
          }
        },
        {
          hidden: false,
          disabled: false,
          data: {
            title: '件数',
            width: 90,
            dataIndex: 'totalAmount'
          }
        },
        {
          hidden: false,
          disabled: false,
          data: {
            title: '重量',
            width: 110,
            dataIndex: 'totalWeight'
          }
        },
        {
          hidden: false,
          disabled: false,
          data: {
            title: '体积',
            width: 90,
            dataIndex: 'totalVolume'
          }
        },
        {
          hidden: false,
          disabled: false,
          data: {
            title: '要求提货时间',
            width: 180,
            dataIndex: 'pickupTime'
          }
        },
        {
          hidden: false,
          disabled: false,
          data: {
            title: '要求送达时间',
            width: 180,
            dataIndex: 'arrivalTime'
          }
        },
        {
          hidden: false,
          disabled: false,
          data: {
            title: '操作',
            width: 180,
            fixed: 'right',
            dataIndex: 'action',
            scopedSlots: { customRender: 'action' }
          }
        }
      ]
      this.cloumnsChange.forEach((item, i) => {
        if (item.hidden === false) {
          this.columns.push(item.data)
        }
      })
      this.scrollX = countCollumnsWidth(this.columns)
    },
    handleReset (pageOne) {
      this.sDate = undefined
      this.eDate = undefined
      this.queryParam = {
        waybillCode: '',
        carrierName: '',
        clientCode: '',
        projectName: ''
      }
      this.$refs.table.refresh(pageOne)
    },
    expendCharge (type, record) {
      this.trackNode = []
      this.trackNode.push(record)
      switch (type) {
        case 1:
          this.$refs.AddDamage.add(this.trackNode)
          break
        case 2:
          this.$refs.AddClaim.add(this.trackNode)
          break
        case 3:
          this.$refs.FeedBack.add(this.trackNode)
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
      const isJPG =
        ['image/jpeg', 'image/png', 'image/bmp', 'application/pdf'].indexOf(file.type) > -1
      if (!isJPG) {
        this.$message.info('只支持jpg.png.bmp.pdf格式!')
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
      this.bizStatuss = []
      this.waybillStatuss = []
      this.trackNode = []
      let _this = this
      this.selectedRowKeys = selectedRowKeys
      selectedRowKeys.forEach(function (item1, i) {
        const item = _this.data.findIndex(track => track.dispatchId === item1)
        _this.bizStatuss.push(_this.data[item].bizStatus)
        _this.waybillStatuss.push(_this.data[item].waybillStatus)
        _this.waybillIds.push(_this.data[item].waybillId)
        _this.dispatchIds.push(_this.data[item].dispatchId)
        _this.bizStatusNames.push(_this.data[item].bizStatusNames)
      })
    },
    waybillStatusChange (value) {
      value = value === 0 ? '' : value
      this.queryParam.waybillStatus = value
    },
    handleDetaild (record) {
      // console.log('调度单详情' + record)
      let toRoute = { name: 'dispatchDetail' }
      if (record.carrierName) toRoute.name = 'shopDetail'
      if (record.dispatchId) { toRoute.params = { dispatchId: record.dispatchId } }
      this.$router.push(toRoute)
    },
    getReceiptList (type) {
      this.$refs.table.refresh()
    },
    onChanged1 (date, dateString) {
      this.signDate = dateString
    },
    showModal (type, waybillId, dispatchId) {
      if (!waybillId) {
        if (this.selectedRowKeys.length <= 0) {
          this.$message.info('请选择运单')
          return false
        }
        let _this = this
        let canrequest = true
        this.bizStatuss.forEach(function (item, i) {
          if ((type === 1 && Number(item) !== 1) || (type === 2 && Number(item) !== 2)) {
            canrequest = false
          }
        })
        if (canrequest === false) {
          if (type === 1) {
            _this.$message.info('当前选择的运单中存在不是待提货状态运单，无法进行确认提货操作，请重新选择。')
          } else {
            _this.$message.info('当前选择的运单中存在不是运输中状态运单，无法进行确认送达操作，请重新选择。')
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
      let tmpValues = { dispatchIds: this.dispatchIds, images: this.uploadImages, operationTime: this.signDate, remark: this.signer, operationType: this.modaltype }
      this.dispatchTrackConfirmGoods(tmpValues)
    },
    dispatchTrackConfirmGoods (tmpValues) {
      dispatchTrackConfirmGoods(tmpValues).then(res => {
        console.log(res)
        this.issuccess(res.code)
      }).finally(() => {
        this.confirmLoading = false
        this.uploadImages = []
      })
    },
    // batchDeliveryFun (tmpValues) {
    //   batchDelivery(tmpValues).then(res => {
    //     // console.log(res)
    //     this.issuccess(res.code)
    //   }).catch(error => {
    //     this.confirmLoading = false
    //     this.$message.fail(error)
    //   })
    // },
    // batchArrivalFun (tmpValues) {
    //   batchArrival(tmpValues).then(res => {
    //     // console.log(res)
    //     this.issuccess(res.code)
    //   }).catch(error => {
    //     this.confirmLoading = false
    //     this.$message.fail(error)
    //   })
    // },
    handleCancel (type) {
      this.visible = false
      this.signer = ''
      this.signer1time = null
      this.fileList = []
    }
  }
}
</script>
<style lang="less" scoped>
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
<style>
  .ant-timeline-item-last .ant-timeline-item-content{
    min-height: 20px;
  }
</style>
