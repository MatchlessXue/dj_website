<template>
  <div class="site-addr-form-layout form-layout-body">
    <a-modal :title="title" :width="1100" :visible="visible" :maskClosable="false" @ok="handleadd" :confirmLoading="confirmLoading" @cancel="handleaddCancel">
      <a-spin :spinning="confirmLoading">
        <a-form layout="inline">
          <a-row :gutter="16">
            <a-col :xs='6'>
              <a-form-item label="异常编号">{{queryParam.exceptionCode}} </a-form-item>
            </a-col>
            <a-col :xs='6'>
              <a-form-item label="关联类型：">{{queryParam.relationType==1?'运单':'调度单'}}</a-form-item>
            </a-col>
            <a-col :xs='6'>
              <a-form-item label="关联单号：">{{queryParam.relCode}}</a-form-item>
            </a-col>
            <a-col :xs="6">
              <a-form-item label="异常类型：">{{queryParam.nodeTypeName}}</a-form-item>
            </a-col>
            <a-col :xs="6">
              <a-form-item label="运输环节：">{{queryParam.transportTypeName}}</a-form-item>
            </a-col>
            <a-col :xs='6'>
              <a-form-item label="发生日期：">{{queryParam.nodeDate}} </a-form-item>
            </a-col>
            <a-col :xs='6'>
              <a-form-item label="信息来源：">{{queryParam.sourceTypeName}} </a-form-item>
            </a-col>
            <a-col :xs='6'>
              <a-form-item label="异常提交人：">{{queryParam.createAccountName}} </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :xs='24'>
              <a-form-item label="备注  ：">{{queryParam.nodeContent}} </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :xs='24'>
              <a-form-item label="图片：">
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
          <a-form-item :labelCol="{ span: 2 }" :wrapperCol="{ span: 22 }" label='上传图片' hasFeedback>
            <a-upload class="myUpload" :action="uploadPictureUrl" listType="picture-card" :fileList="fileList" @preview="handlePreview" :headers="headers" @change="handleChange1">
              <div v-if="fileList.length < 9">
                <a-icon type="plus" />
                <div class="ant-upload-text">上传图片</div>
              </div>
            </a-upload>
          </a-form-item>
          <a-form-item label='处理意见：' :labelCol="{ span: 24 }" :wrapperCol="{ span: 12 }" hasFeedback>
            <a-textarea :rows="5" placeholder="最多可输入50个汉字" v-decorator="['remark']" />
          </a-form-item>
          <a-form-item label='添加费用：'>
            <payment-modal ref="paymentModal" v-if="hackReset" :trackData='queryParam'></payment-modal>
          </a-form-item>
          <a-form-item  label='历史记录：' >
            <a-table :columns="columnsList" :scroll="{ x: 650 }" :dataSource="dataList" bordered :pagination="false"></a-table>
          </a-form-item>
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
import { settlementObject, getExpenseInfo, handlingException } from '@/api/track/track.js'
import PaymentModal from './AddFee'
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
      columns,
      columnsList: [
        {
          title: '结算对象',
          width: 80,
          dataIndex: 'settlementObj'
        }, {
          title: '费用类型',
          width: 80,
          dataIndex: 'nodeType'
        },
        {
          title: '金额',
          width: 80,
          dataIndex: 'price'
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
      dataList: [],
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
      hackReset: false

    }
  },
  mounted () {
    settlementObject({}).then(res => {
      for (var i in res.data) {
        this.settlements.push({ name: res.data[i], id: i })
      }
    })
  },
  watch: {},
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
        this.dataList = res.data.expenses.map(v => {
          return {
            nodeType: v.nodeTypeName,
            price: v.price,
            settlementObj: v.settlementName,
            settlementType: v.settlementTypeName,
            number: v.expenseCode,
            remark: v.remark,
            status: v.bizStatusName
          }
        })
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
      e.preventDefault()
      if (this.isSubmit) return
      // 判断expenseType 必填
      let expenses = this.$refs.paymentModal.data.map(v => {
        const settlementObj2 = v.settlementObj2 && JSON.parse(v.settlementObj2)
        const nodeTypeObj = v.ClaimNoteType ? JSON.parse(v.ClaimNoteType) : {}
        return {
          dispatchId: this.queryParam.relationType === 2 ? this.queryParam.dispatchId : settlementObj2 && settlementObj2.dispatchId, // 结算对象选出的值
          equalizationMethod: v.equalizationMethod,
          exceptionCode: this.queryParam.exceptionCode,
          expenseType: nodeTypeObj.id,
          nodeType: nodeTypeObj.id,
          nodeTypeName: nodeTypeObj.name,
          price: v.price,
          relationType: this.queryParam.relationType,
          remark: v.remark,
          settlementObj: v.settlementObj, // 结算类型
          settlementObjId: settlementObj2 && settlementObj2.settlementObjId, // 结算对象选出的值
          settlementName: settlementObj2 && settlementObj2.settlementName, // 根据结算对象筛选
          settlementType: v.settlementType,
          sourceType: '1',
          transportType: this.queryParam.transportType
        }
      })
      const loadImg = []
      this.fileList.forEach(function (item, i) {
        loadImg.push(item.response.data)
      })
      const submitData = {
        handUrlJson: loadImg.length === 0 ? null : JSON.stringify(loadImg),
        // feeLists: this.getPaymentList.paylistsF,
        remark: '',
        exceptionId: this.queryParam.exceptionId,
        expenses: expenses,
        relationType: this.queryParam.relationType,
        dispatchId: this.queryParam.relationType === 2 ? this.queryParam.dispatchId : expenses.settlementObjId,
        waybillId: this.queryParam.relationType === 1 ? this.queryParam.waybillId : ''
      }
      this.confirmLoading = true
      console.log('submitData, expenses515', submitData, expenses)
      // 2019年05月09日17:44:06-分摊方式必选
      // let flag = submitData.expenses.every(item => {
      //   return item.settlementType
      // })

      // // if (!flag) {
      // //   this.confirmLoading = false
      // //   this.$message.error('请选择结算方式')
      // //   return
      // // }
      handlingException(submitData).then(res => {
        this.confirmLoading = false
        this.visible = false
        this.form.resetFields()
        this.$emit('handlingExceptionSuccess')
      }).catch(error => {
        this.confirmLoading = false
        this.$message.fail(error)
      })
    },
    handleaddCancel (isRefresh) {
      this.visible = false
      this.form.resetFields()
      this.fileList = []
      this.fileLists = []
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
