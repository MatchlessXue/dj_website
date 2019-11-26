<template>
  <div class="site-addr-form-layout form-layout-body">
    <a-modal :title="title" :width="1100" :visible="visible" :maskClosable="false"
      @ok="handleadd" :confirmLoading="confirmLoading" @cancel="handleaddCancel">
      <a-spin :spinning="confirmLoading">
        <a-form layout="inline">
        <a-row :gutter="16">
          <a-col :xs='6'>
            <a-form-item label="异常编号">{{infor.exceptionCode}} </a-form-item>
          </a-col>
          <a-col :xs='6'>
            <a-form-item label="关联类型：">{{infor.relationType}}</a-form-item>
          </a-col>
          <a-col :xs='6'>
            <a-form-item label="关联单号：">{{infor.relCode}}</a-form-item>
          </a-col>
          <a-col :xs="6">
            <a-form-item label="异常类型：">{{infor.nodeTypeName}}</a-form-item>
          </a-col>
          <a-col :xs="6">
            <a-form-item label="运输环节：">{{infor.transportTypeName}}</a-form-item>
          </a-col>
          <a-col :xs='6'>
            <a-form-item label="发生日期：">{{infor.nodeDate}} </a-form-item>
          </a-col>
          <a-col :xs='6'>
            <a-form-item label="信息来源：">{{infor.settlementObjName}} </a-form-item>
          </a-col>
          <a-col :xs='6'>
            <a-form-item label="异常提交人：">{{infor.createAccountName}} </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :xs='24'>
            <a-form-item label="备注  ：">{{infor.nodeContent}} </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :xs='24'>
            <a-form-item label="特殊费图片：">
              <img style="width:100px;height:100px;margin-right:15px" v-for="(item, index) in fileLists" :src="item" :key="index" alt="" @click="handlePreview1(item)">
              <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancelimg">
                <img alt="example" style="width: 100%" :src="previewImage">
              </a-modal>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <h3 style="margin-top:20px;font-weight:bold">处理信息</h3>
        <a-form :form="form">
          <a-form-item :labelCol="{ span: 2 }" :wrapperCol="{ span: 22 }" label='上传图片' hasFeedback >
            <a-upload class="myUpload" :action="uploadPictureUrl" listType="picture-card" :fileList="fileList"  @preview="handlePreview"   :headers="headers" @change="handleChange1">
              <div v-if="fileList.length < 9">
                <a-icon type="plus" />
                <div class="ant-upload-text">上传图片</div>
              </div>
            </a-upload>
          </a-form-item>
          <a-form-item label='处理意见：' :labelCol="{ span: 24 }" :wrapperCol="{ span: 12 }" hasFeedback >
            <a-textarea :rows="5" placeholder="最多可输入50个汉字" v-decorator="['remark']"/>
          </a-form-item>
          <a-form-item  label='添加费用：' >
            <payment-modal ref="paymentModal" v-if="hackReset" payType="addfee" :trackData='infor'></payment-modal>
          </a-form-item>
          <!-- <a-form-item  label='历史记录：' >
            <a-table :columns="columnsList" :scroll="{ x: 650 }" :dataSource="dataList" bordered :pagination="false"></a-table>
          </a-form-item> -->
        </a-form>
      </a-spin>
    </a-modal>
  </div>
</template>
<script>
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { getUploadPictureUrl } from '@/api/common'
import fileBase from '@views/mixins/file_base'
import { costType, settlementObject, getExpenseInfo, handlingException, addTrackExpense } from '@/api/track/track.js'
import PaymentModal from '../different/AddFee'
import { mapGetters } from 'vuex'
const columns = [
  {
    title: '类型',
    width: 120,
    dataIndex: 'nodeType'
  },
  {
    title: '金额',
    width: 100,
    dataIndex: 'price'
  },
  {
    title: '结算对象',
    width: 120,
    dataIndex: 'settlementObj'
  },
  {
    title: '结算方式',
    width: 120,
    dataIndex: 'settlementType'
  },
  {
    title: '分摊方式',
    width: 120,
    dataIndex: 'relevance'
  },
  {
    title: '备注',
    width: 150,
    dataIndex: 'remark'
  },
  {
    title: '操作',
    width: 100,
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' }
  }
]
export default {
  name: 'ExceptionHandler',
  mixins: [fileBase],
  components: {
    PaymentModal
  },
  data () {
    return {
      cols: ['nodeType', 'price', 'settlementObj', 'settlementObj_2', 'settlementType', 'relevance', 'remark', 'operation'],
      data: [],
      columns,
      columnsList: [
        {
          title: '类型',
          width: 80,
          dataIndex: 'nodeType'
        },
        {
          title: '金额',
          width: 80,
          dataIndex: 'price'
        },
        {
          title: '结算对象',
          width: 80,
          dataIndex: 'settlementObj'
        },
        {
          title: '结算方式',
          width: 80,
          dataIndex: 'settlementType'
        },
        {
          title: '事件编号',
          width: 80,
          dataIndex: 'number'
        },
        {
          title: '备注',
          width: 150,
          dataIndex: 'remark'
        },
        {
          title: '审批状态',
          width: 100,
          dataIndex: 'status'
        }
      ],
      dataList: [{ nodeType: '赔偿费', price: '600', settlementObj: '司机', settlementType: '现付', number: 'SP20190418', remark: 'status', status: '待提交' }],
      previewVisible: false,
      previewImage: '',
      fileList: [],
      headers: {
        authorization: Vue.ls.get(ACCESS_TOKEN)
      },
      fileLists: [],
      uploadPictureUrl: getUploadPictureUrl(), // 上传图片
      expenses: [],
      settlements: [],
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      isSubmit: false,
      // labelCol: { span: 10 },
      // wrapperCol: { span: 14 },
      labelCol: { span: 2 },
      wrapperCol: { span: 8 },
      wrapperColimg: { span: 22 },
      documentId: '',
      invoiceId: '',
      imgurl: '',
      feeListIndex: 1,
      dataSource: [],
      feeList: [],
      trakeNode: [],
      trackExpenses: [],
      queryParam: {
        exceptionId: '',
        remark: ''
      },
      hackReset: false,
      infor: {}

    }
  },
  mounted () {
    costType({ tenantId: this.tenantId }).then(res => {
      for (var i in res.data) {
        this.expenses.push({ name: res.data[i], id: i })
      }
    })
    settlementObject({}).then(res => {
      for (var i in res.data) {
        this.settlements.push({ name: res.data[i], id: i })
      }
    })
  },
  watch: {
  },
  computed: {
    ...mapGetters(['tenantId']),
    ...mapGetters('track',
      ['getPaymentList']
    ),
    title () {
      return `异常处理`
    }
  },
  methods: {
    add (trakeNode) {
      this.queryParam = trakeNode[0]
      getExpenseInfo({ exceptionId: this.queryParam.exceptionId }).then(res => {
        this.infor = res.data
      })
      this.trakeNode = trakeNode
      let imgList = this.queryParam.picJson
      if (imgList !== null) {
        imgList = JSON.parse(imgList)
        if (typeof imgList === 'string') {
          imgList = JSON.parse(imgList)
        }
        this.fileLists = imgList
      }
      this.visible = true
      this.hackReset = false
      this.$nextTick(() => {
        this.hackReset = true
      })
    },
    handlePreview1 (file) {
      this.previewImage = file
      this.previewVisible = true
    },
    handleadd (e, isRefresh) {
      let getExpenseType = (id) => {
        console.log(id)
        let ClaimNoteType = this.$refs.paymentModal.ClaimNoteType

        // return ClaimNoteType.filter(v=>v.id===id)[0].dictId
      }
      if (this.isSubmit) return
      e.preventDefault()
      this.form.validateFields((err, values) => {
        console.log(this.$refs.paymentModal.data, 'wpw11111111111', err)
        let expenses = this.$refs.paymentModal.data.map(v => {
          return {
            dispatchId: this.infor.relationType == 2 ? this.infor.dispatchId : '', // 结算对象选出的值
            equalizationMethod: v.relevance,
            exceptionCode: this.infor.exceptionCode,
            expenseType: getExpenseType(v.ClaimNoteType),
            nodeType: v.ClaimNoteType,
            price: v.price,
            relationType: this.infor.relationType,
            remark: v.remark,
            settlementObj: v.settlementObj, // 结算类型
            settlementObjId: '"3165a78866b34ef783104eedcd5957e8"', // 结算对象选出的值
            settlementName: '物流公司1', // 根据结算对象筛选
            settlementType: v.settlementType,
            sourceType: '1',
            transportType: this.infor.transportType
          }
        })
        console.log(expenses)
        // values.remark = values.remark === undefined ? '' : values.remark
        // if (this.feeListIndex > 1) {
        //   if (this.feeList[this.feeListIndex - 2].price === null) {
        //     this.$message.info('请输入金额')
        //     return false
        //   }
        //   this.queryParam.remark = `已处理，有费用。`
        //   const _this = this
        //   this.feeList.forEach(function (item, i) {
        //     const feeType = _this.expenses[item.nodeType - 1].name
        //     const setObj = _this.settlements[item.settlementObj - 1].name
        //     _this.queryParam.remark += `费用金额：${item.price}元，费用类型：${feeType}，结算对象：${setObj}。${values.remark}`
        //   })
        // } else {
        //   this.queryParam.remark = `已处理，无费用。${values.remark}`
        // }
        const loadImg = []
        this.fileList.forEach(function (item, i) {
          loadImg.push(item.response.data)
        })
        const submitData = {
          waybillId: this.queryParam.waybillId,
          picJson: loadImg.length === 0 ? null : JSON.stringify(loadImg),
          // feeLists: this.getPaymentList.paylistsF,
          remark: values.remark,
          exceptionId: this.infor.exceptionId,
          expenses: expenses,
          relationType: this.infor.relationType,
          dispatchId: this.infor.relationType == 2 ? this.infor.dispatchId : '',
          waybillId: this.infor.relationType == 1 ? this.infor.waybillId : ''
        }
        this.confirmLoading = true
        handlingException(submitData).then(res => {
          console.log(res, 'wpw3232434343444433')
          this.confirmLoading = false
          // if (res.code === 0) {
          //   this.$message.success('操作成功')
          //   if (this.feeList.length > 0) {
          //     addTrackExpense({ trackExpense: JSON.stringify(this.feeList), tracks: JSON.stringify(this.trakeNode) }).then(res => {})
          //   }
          //   this.$emit('hideForm', isRefresh)
          // } else {
          //   this.$message.fail(res.message)
          // }
          // this.visible = false
          // this.form.resetFields()
        }).catch(error => {
          this.confirmLoading = false
          this.$message.fail(error)
        })
      })
    },
    handleaddCancel (isRefresh) {
      this.visible = false
      this.form.resetFields()
      this.$emit('hideForm', isRefresh)
    },
    handleCancelimg () {
      this.previewVisible = false
    },
    handlePreview (file) {
      this.previewImage = file.url || file.thumbUrl
      this.previewVisible = true
    },
    handleChange1 ({ file, fileList }) {
      fileList.forEach(f => {
        if (f.type === 'application/pdf') {
          f.thumbUrl = require('@/assets/pdf.png')
        }
      })
      this.fileChange(file, fileList, 'certUrl', 'fileList')
      // console.log(fileList)
      // if (fileList.length > 0) {
      //   this.imgurl = fileList[0].response.data
      // } else {
      //   this.imgurl = ''
      // }
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
    chknum (value) {
      const reg = /^(-)*(\d+)\.(\d\d).*$/
      if (typeof value === 'string') {
        return !isNaN(Number(value)) ? value.replace(reg, '$1$2.$3') : ''
      } else if (typeof value === 'number') {
        return !isNaN(value) ? String(value).replace(reg, '$1$2.$3') : ''
      } else {
        if (value !== undefined && value != null && !isNaN(value)) { return (parseFloat(value)).toFixed(2) }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.site-addr-form-layout {
  .get-map {
    display: inline;
    cursor: pointer;
  }
}
.ant-form-item {
  margin-bottom: 10px;
}
.operationDiv {
  color: #1890ff;
  line-height: 39px;
  .addbtn {
    margin-right: 10px;
    cursor: default;
  }
}
</style>
