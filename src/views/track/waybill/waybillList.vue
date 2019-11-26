<template>
  <div class="page-container">
    <a-card :bordered="false" class="card-container">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :md="6" :sm="24">
              <a-form-item label="运单号：">
                <a-auto-complete :dataSource="SwaybillCode" v-model="queryParam.waybillCode"
                 placeholder="请输入运单号" :filterOption="filterOption" :allowClear="true"/>
              </a-form-item>
            </a-col>
            <a-col :md="7" :sm="24">
              <a-form-item label="项目名称：">
                <a-auto-complete :dataSource="SprojectName" v-model="queryParam.projectName"
                 placeholder="请输入项目名称" :filterOption="filterOption" :allowClear="true"/>
              </a-form-item>
            </a-col>
            <a-col :md="7" :sm="24">
              <a-form-item label="客户名称：">
                <a-auto-complete :dataSource="SpartnerName" v-model="queryParam.partnerName"
                 placeholder="请输入客户名称" :filterOption="filterOption" :allowClear="true"/>
              </a-form-item>
            </a-col>
          </a-row>
           <a-row :gutter="24">
            <a-col :md="6" :sm="24">
              <a-form-item label="客户单号：">
                <a-auto-complete :dataSource="SclientCode" v-model="queryParam.clientCode"
                 placeholder="请输入客户单号" :filterOption="filterOption" :allowClear="true"/>
              </a-form-item>
            </a-col>
            <a-col :md="7" :sm="24">
              <a-form-item label="要求提货时间：">
                <a-range-picker v-model="sDate" :placeholder="['提货开始时间', '提货结束时间']"/>
              </a-form-item>
            </a-col>
            <a-col :md="7" :sm="24">
              <a-form-item label="要求送达时间：">
                <a-range-picker v-model="eDate" :placeholder="['送达开始时间', '送达结束时间']"/>
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="24" class="operation">
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
            <a-button @click="showModal(2)" type="primary" style="margin-left:10px;">确认签收</a-button>
          </a-col>
          <a-col :md="8" :sm="24" style="text-align: right;">
            <a-dropdown :trigger="['click']" placement="bottomRight">
              <a-button>自定义列</a-button>
              <a-menu @change="onChange" slot="overlay" :style="{ width: '450px', paddingLeft: '20px', paddingTop: '20px' }">
                <a-row :key="index" v-for="(arow, index) in arows">
                  <a-col :key="index" v-for="(item, index) in arow" :span="8" :style="{ marginBottom: '15px' }">
                    <a-checkbox :disabled="item.disabled" :defaultChecked="!item.hidden" :value="item.data.dataIndex">{{item.data.title}}</a-checkbox>
                  </a-col>
                </a-row>
              </a-menu>
            </a-dropdown>
          </a-col>
        </a-row>
      </div>
      <s-table :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange,getCheckboxProps: getCheckboxProps}"
      :columns="columns" :data="loadData" ref="table" bordered :showAlertInfo="false" :scroll="{ x: scrollX }" :rowKey='record => record.waybillId'>
        <a slot="waybillCode" slot-scope="text, record" @click="handleDetail(record)">{{text}}</a>
        <span slot="waybillStatus" slot-scope="text, record">{{record.waybillStatusName}}</span>
        <template slot="feedbackname" slot-scope="text">
            <span>{{text}}</span>
        </template>
          <span slot="action" slot-scope="text, record">
            <a @click="expendCharge(3, record)">在途</a>
            <a-divider type="vertical" />
            <a @click="expendCharge(1, record)">特殊费</a>
             <a-divider type="vertical" />
            <a @click="expendCharge(2, record)">异常</a>
          </span>
      </s-table>
      <a-modal :title="modaltitle" :width="700" :visible="visible" :confirmLoading="confirmLoading" @ok="handleOk"  @cancel="handleCancel(1)" :destroyOnClose="true">
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
              <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancelimg" :destroyOnClose="true">
                <img alt="example" style="width: 100%" :src="previewImage">
              </a-modal>
            </a-form-item>
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label='备注' hasFeedback >
              <a-textarea v-model="signer" :rows="5" placeholder="最多可输入50个汉字" />
            </a-form-item>
          </a-form>
        </a-spin>
      </a-modal>
      <add-damage ref="AddDamage" @hideForm="$refs.table.refresh()" payType="waybill"></add-damage>
      <add-claim ref="AddClaim" @hideForm="$refs.table.refresh()" payType="waybill"></add-claim>
      <feed-back ref="FeedBack" @hideForm="$refs.table.refresh()" payType="waybill"></feed-back>
      <dispatch-infor ref="dispatchInfor" @hideForm="$refs.table.refresh()"></dispatch-infor>
    </a-card>
  </div>
</template>
<script>
import fileBase from '@views/mixins/file_base'
import { getReceiptList1, batchArrival, batchDelivery, waybillStatus, checkWaybillDispatchRel } from '@/api/track/track.js'
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
import dispatchInfor from '@views/track/components/dispatchInfor'

const data = []
export default {
  name: 'AbnormalList',
  components: {
    STable,
    AddDamage,
    AddClaim,
    FeedBack,
    dispatchInfor
  },
  mixins: [fileBase],
  data () {
    return {
      id: this.$route.query.id,
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
        waybillCode: '',
        partnerName: '',
        clientCode: '',
        projectName: ''
      },
      sDate: undefined,
      eDate: undefined,
      waybillStatusFilter: [],
      columns: [],
      SwaybillCode: [],
      SdispatchCode: [],
      SclientCode: [],
      SprojectName: [],
      SpartnerName: [],
      data,
      loadData: parameter => {
        if (this.eDate && this.eDate.length > 0) {
          this.queryParam.arrivalStart = this.eDate[0].format('YYYY-MM-DD')
          this.queryParam.arrivalEnd = this.eDate[1].format('YYYY-MM-DD')
        } else {
          this.queryParam.arrivalStart = undefined
          this.queryParam.arrivalEnd = undefined
        }
        if (this.sDate && this.sDate.length > 0) {
          this.queryParam.deliveryStart = this.sDate[0].format('YYYY-MM-DD')
          this.queryParam.deliveryEnd = this.sDate[1].format('YYYY-MM-DD')
        } else {
          this.queryParam.deliveryStart = undefined
          this.queryParam.deliveryEnd = undefined
        }
        this.queryParam.timer = new Date().getTime()
        this.selectedRowKeys = []
        this.SwaybillCode = []
        this.SdispatchCode = []
        this.SclientCode = []
        this.SprojectName = []
        this.SpartnerName = []
        const _this = this
        if (this.id !== undefined) {
          this.queryParam.globalSearch = this.id
        }
        return getReceiptList1(Object.assign(parameter, this.queryParam)).then(res => {
          // console.log(res.data)
          res.data.records.forEach(function (item, i) {
            _this.SwaybillCode.push(item.waybillCode)
            _this.SdispatchCode.push(item.dispatchCode)
            if (item.clientCode !== '' && item.clientCode !== null) {
              _this.SclientCode.push(item.clientCode)
            }
            if (item.projectName !== '' && item.projectName !== null) {
              _this.SprojectName.push(item.projectName)
            }
            if (item.partnerName !== '' && item.partnerName !== null) {
              _this.SpartnerName.push(item.partnerName)
            }
            item.waybillStatus = String(item.waybillStatus)
            item.feedbackname = item.feedBack.length === 0 ? '暂无' : item.feedBack[item.feedBack.length - 1].address
          })
          this.SwaybillCode = this.unique(this.SwaybillCode)
          this.SdispatchCode = this.unique(this.SdispatchCode)
          this.SclientCode = this.unique(this.SclientCode)
          this.SprojectName = this.unique(this.SprojectName)
          this.SpartnerName = this.unique(this.SpartnerName)

          this.data = res.data.records
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
      // bizStatus: [],
      trackNode: [],
      cloumnsChange: [
        {
          hidden: false,
          disabled: true,
          data: {
            title: '运单号',
            width: 180,
            dataIndex: 'waybillCode',
            scopedSlots: { customRender: 'waybillCode' }
          }
        },
        {
          hidden: false,
          disabled: true,
          data: {
            title: '运单状态',
            width: 120,
            dataIndex: 'waybillStatus',
            key: 'waybillStatus',
            scopedSlots: { customRender: 'waybillStatus' },
            filters: this.waybillStatusFilter,
            onFilter: (value, record) => record.waybillStatus === value
          }
        },
        {
          hidden: false,
          disabled: true,
          data: {
            title: '客户名称',
            width: 120,
            dataIndex: 'partnerName'
          }
        },
        {
          hidden: false,
          disabled: true,
          data: {
            title: '客户单号',
            width: 150,
            dataIndex: 'clientCode'
          }
        },
        {
          hidden: false,
          disabled: true,
          data: {
            title: '项目名称',
            width: 120,
            dataIndex: 'projectName'
          }
        },
        {
          hidden: false,
          disabled: false,
          data: {
            title: '在途反馈',
            width: 120,
            dataIndex: 'feedbackname',
            scopedSlots: { customRender: 'feedbackname' }
          }
        },
        {
          hidden: true,
          disabled: false,
          data: {
            title: '发货城市',
            width: 120,
            dataIndex: 'sdAddressArea'
          }
        },
        {
          hidden: true,
          disabled: false,
          data: {
            title: '发货方地址',
            width: 120,
            dataIndex: 'sdAddress'
          }
        },
        {
          hidden: false,
          disabled: false,
          data: {
            title: '发货方联系人',
            width: 130,
            dataIndex: 'sdContact'
          }

        },
        {
          hidden: false,
          disabled: false,
          data: {
            title: '发货方手机号',
            width: 130,
            dataIndex: 'sdMobile'
          }
        },
        {
          hidden: true,
          disabled: false,
          data: {
            title: '收货城市',
            width: 120,
            dataIndex: 'rvAddressArea'
          }
        },
        {
          hidden: true,
          disabled: false,
          data: {
            title: '收货方地址',
            width: 120,
            dataIndex: 'rvAddress'
          }
        },
        {
          hidden: false,
          disabled: false,
          data: {
            title: '收货方联系人',
            width: 130,
            dataIndex: 'rvContact'
          }

        },
        {
          hidden: false,
          disabled: false,
          data: {
            title: '收货方手机号',
            width: 130,
            dataIndex: 'rvMobile'
          }
        },
        {
          hidden: true,
          disabled: false,
          data: {
            title: '件数',
            width: 90,
            dataIndex: 'totalAmount'
          }
        },
        {
          hidden: true,
          disabled: false,
          data: {
            title: '重量（kg）',
            width: 110,
            dataIndex: 'totalWeight'
          }
        },
        {
          hidden: true,
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
            dataIndex: 'reqDeliveryDate'
          }
        },
        {
          hidden: false,
          disabled: false,
          data: {
            title: '要求送达时间',
            width: 180,
            dataIndex: 'reqArrivalDate'
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
      ],
      arows: []
    }
  },
  created () {
    let cols = this.$ls.get('TrackWaybillSelectedCols')
    let arrows = this.$ls.get('TrackWaybillArrows')
    console.log('查看缓存的cols forTrackWaybillSelectedCols', typeof cols, cols)
    if (cols && cols.length) {
      this.columns = cols
      this.arows = arrows
    } else {
      this.createCloumns()
    }

    this.selectedColumns = this.columns.slice(0)
    console.log('查看selectedColumns', this.selectedColumns)

    this.scrollX = countCollumnsWidth(this.columns)
    // console.log('waybill router', this.$route)
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
      waybillStatus({}).then(res => {
        for (var i in res.data) {
          this.waybillStatusFilter.push({ text: res.data[i], value: String(i) })
        }
      })
      this.changeColumns()
    },
    changeColumns (value) {
      let arrow1 = []
      let arrow2 = []
      let arrow3 = []
      let arrow4 = []
      this.columns = []
      this.cloumnsChange.forEach((item, i) => {
        if (item.data.dataIndex === value) {
          item.hidden = !item.hidden
        }
        if (item.hidden === false) {
          this.columns.push(item.data)
        }
        if (i <= 4) { arrow1.push(item) }
        if (i > 5 && i <= 9) { arrow2.push(item) }
        if (i > 9 && i <= 13) { arrow3.push(item) }
        if (i > 13) { arrow4.push(item) }
      })
      this.scrollX = countCollumnsWidth(this.columns)
      this.arows[0] = arrow1
      this.arows[1] = arrow2
      this.arows[2] = arrow3
      this.arows[3] = arrow4

      this.$ls.set('TrackWaybillSelectedCols', this.columns)
      this.$ls.set('TrackWaybillArrows', this.arows)
    },
    onChange (e) {
      this.changeColumns(e.target.value)
    },
    handleReset (pageOne) {
      this.sDate = undefined
      this.eDate = undefined
      this.queryParam = {
        waybillCode: '',
        partnerName: '',
        clientCode: '',
        projectName: ''
      }
      this.$refs.table.refresh(pageOne)
    },
    expendCharge (type, record) {
      // console.log(record)
      this.trackNode = []
      this.trackNode.push(record)
      // if (this.trackNode.length === 0) {
      //   this.$message.info('请选择处理的运单')
      // } else {
      switch (type) {
        case 1: // 特殊费
          this.$refs.AddDamage.add(this.trackNode)
          break
        case 2: // 异常
          this.$refs.AddClaim.add(this.trackNode)
          break
        case 3: // 在途
          this.$refs.FeedBack.add(this.trackNode)
          break
        default:
          break
      }
      // }
    },
    handleCancelimg () {
      this.previewVisible = false
    },
    handlePreview (file) {
      this.previewImage = file.url || file.thumbUrl
      this.previewVisible = true
    },
    handleChange ({ file, fileList }) {
      console.log('上传完成')
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
      // this.bizStatuss = []
      this.waybillStatuss = []
      this.trackNode = []
      let _this = this
      this.selectedRowKeys = selectedRowKeys
      selectedRowKeys.forEach(function (item1, i) {
        const item = _this.data.findIndex(track => track.waybillId === item1)
        _this.waybillStatuss.push(_this.data[item].waybillStatus)
        _this.waybillIds.push(_this.data[item].waybillId)
        _this.dispatchIds.push(_this.data[item].dispatchId)
        _this.bizStatusNames.push(_this.data[item].bizStatusNames)
      })
    },
    getCheckboxProps: record => ({
      // props: {
      //   disabled: record.waybillStatus === 1
      // }
    }),
    waybillStatusChange (value) {
      value = value === 0 ? '' : value
      this.queryParam.waybillStatus = value
    },
    // 查看详情
    handleDetail (record) {
      // console.log('运单详情', record)
      window.location.href = `/waybill/#/waybill/detail/${record.waybillId}`
      //
      // this.$router.push({"6542307922415714307"
      //   name: 'WaybillDetail',
      //   params: { id: record.waybillId }
      // })
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
        this.waybillStatuss.forEach(function (item, i) {
          if ((type === 1 && Number(item) !== 5) || (type === 2 && Number(item) !== 6)) {
            canrequest = false
          }
        })
        if (canrequest === false) {
          if (type === 1) {
            _this.$message.info('当前选择的运单中存在不是待提货状态运单，无法进行确认提货操作，请重新选择。')
          } else {
            _this.$message.info('当前选择的运单中存在不是运输中状态运单，无法进行确认签收操作，请重新选择。')
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
      this.visible = false
      switch (type) {
        case 1:
          console.log('this.waybillIds515', this.waybillIds)
          this.waybillIds.length && checkWaybillDispatchRel({ waybillIds: this.waybillIds }).then(res => {
            console.log('waybillIds>res', this.waybillIds, res)
            this.visible = true
          })
          this.modaltitle = '提货确认'
          this.labeltext = '提货时间'
          break
        case 2:
          this.visible = true
          this.modaltitle = '签收确认'
          this.labeltext = '签收时间'
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
      let _this = this
      this.fileList.forEach(function (item, i) {
        _this.uploadImages.push(item.response.data)
      })
      this.confirmLoading = true
      console.log('this.uploadImages', this.uploadImages)
      const images = this.uploadImages.length > 0 ? JSON.stringify(this.uploadImages) : undefined
      console.log('this.images', images)
      let tmpValues = { waybillIds: this.waybillIds, dispatchIds: this.dispatchIds, deliveryData: this.signDate, remark: this.signer }
      tmpValues = images ? Object.assign(tmpValues, { images: images }) : tmpValues
      this.modaltype === 1 ? this.batchDeliveryFun(tmpValues) : this.batchArrivalFun(tmpValues)
    },
    batchDeliveryFun (tmpValues) {
      batchDelivery(tmpValues).then(res => {
        // console.log(res)
        this.issuccess(res.code)
      }).finally(() => {
        this.confirmLoading = false
        this.uploadImages = []
      })
    },
    batchArrivalFun (tmpValues) {
      batchArrival(tmpValues).then(res => {
        // console.log(res)
        this.issuccess(res.code)
      }).finally(() => {
        this.confirmLoading = false
        this.uploadImages = []
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
