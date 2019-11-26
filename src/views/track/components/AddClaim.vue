<template>
  <div class="site-addr-form-layout form-layout-body">
    <a-modal :title="title" :width="760" :visible="visible" :maskClosable="false" :destroyOnClose="true"
      @ok="handleadd" :confirmLoading="confirmLoading" @cancel="handleaddCancel" class="addClaim">
      <a-spin :spinning="confirmLoading">
        <a-form :form="form">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="发生日期：">
            <a-date-picker @change="onChange"  placeholder="请选择发生日期"/>
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label='异常类型：'>
            <a-select allowClear :defaultValue="defaultName.expenses" @change="typeChange1">
              <a-select-option v-for="expense in expenses" :key="expense.id">{{expense.name }}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label='运输环节：'>
           <a-select allowClear :defaultValue="defaultName.transports" @change="typeChange2">
             <a-select-option v-for="transport in transports" :key="transport.id">{{transport.name }}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperColimg" label='上传图片' hasFeedback >
            <a-upload class="myUpload" v-if="visible" :action="uploadPictureUrl" listType="picture-card" :fileList="fileList"  @preview="handlePreview"
                :headers="headers" @change="handleChange"  >
              <div v-if="fileList.length < 9">
                <a-icon type="plus" />
                <div class="ant-upload-text">上传图片</div>
              </div>
            </a-upload>
            <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancelimg" :destroyOnClose="true">
              <img alt="example" style="width: 100%" :src="previewImage">
            </a-modal>
          </a-form-item>
          <a-form-item label='说明：' :labelCol="{ span: 24 }" :wrapperCol="{ span: 16 }">
            <a-textarea :rows="4" placeholder="最多可输入50个汉字" v-decorator="['nodeContent']"/>
          </a-form-item>
          <a-form-item>
            <h3 style="font-weight:bold;margin-top:20px;">历史异常信息</h3>
          </a-form-item>
          <a-form-item >
            <a-table :columns="columnsList" :scroll="{ x: 630 }" :dataSource="dataList" bordered :pagination="false"></a-table>
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
import { exceptionType, transportationLink, addTrackException, getHistoryExceptionList, dispatchTrackException } from '@/api/track/track.js'
export default {
  name: 'AddDamage',
  mixins: [fileBase],
  data () {
    return {
      columnsList: [
        {
          title: '异常类型',
          width: 100,
          dataIndex: 'nodeTypeName'
        },
        {
          title: '发生日期',
          width: 120,
          dataIndex: 'nodeDate'
        },
        {
          title: '运输环节',
          width: 100,
          dataIndex: 'transportTypeName'
        },
        {
          title: '说明',
          width: 150,
          dataIndex: 'nodeContent'
        },
        {
          title: '异常编号',
          width: 80,
          dataIndex: 'exceptionCode'
        },
        {
          title: '处理状态',
          width: 100,
          dataIndex: 'bizStatusName'
        }
      ],
      dataList: [],
      expenses: [],
      transports: [],
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      isSubmit: false,
      labelCol: { span: 3 },
      wrapperCol: { span: 8 },
      wrapperColimg: { span: 21 },
      headers: {
        authorization: Vue.ls.get(ACCESS_TOKEN)
      },
      previewVisible: false,
      previewImage: '',
      fileList: [],
      uploadPictureUrl: getUploadPictureUrl(), // 上传图片
      documentId: '',
      invoiceId: '',
      imgurl: '',
      dataSource: [],
      info: {},
      trackNode: [],
      defaultName: {
        expenses: '',
        transports: ''
      },
      queryParam: {
        nodeType: 1,
        transportType: 1,
        nodeDate: '',
        nodeContent: '',
        picJson: ''
      }
    }
  },
  mounted () {
    exceptionType({ flag: 0 }).then(res => {
      for (var i in res.data) {
        this.expenses.push({ name: res.data[i], id: i })
      }
      this.defaultName.expenses = this.expenses[0].name
    })
    transportationLink({}).then(res => {
      for (var i in res.data) {
        this.transports.push({ name: res.data[i], id: i })
      }
      this.defaultName.transports = this.transports[0].name
    })
  },
  watch: {
    trackNode: {
      deep: true,
      handler: function (val) {
        console.log('trackNode 》watch-val', val)
        this.$nextTick(() => {
          //  -- 运单跟踪，异常列表
          val[0].waybillCode && val.length > 0 && getHistoryExceptionList({
            relCode: val[0].waybillCode,
            page: 1,
            pageSize: 30
          }).then(res => {
            console.log('运单跟踪')
            this.dataList = res.data.records
          })

          // 调度单跟踪  -- 异常列表
          val[0].dispatchId && val.length > 0 && dispatchTrackException({
            dispatchId: val[0].dispatchId,
            page: 1,
            pageSize: 30
          }).then(res => {
            console.log('调度单跟踪')
            this.dataList = res.data
          })
        })
      }
    }
  },
  computed: {
    title () {
      return `上报异常`
    }
  },
  methods: {
    add (rows) {
      this.trackNode = rows
      this.visible = true
    },
    // 选择发生日期
    onChange (date, dateString) {
      console.log('发生日期 = ', dateString)
      this.queryParam.nodeDate = dateString
    },
    typeChange1 (value) {
      this.queryParam.nodeType = value
    },
    typeChange2 (value) {
      this.queryParam.transportType = value
    },
    // 上传异常处理
    handleadd (e) {
      if (this.isSubmit) return
      e.preventDefault()
      this.form.validateFields((err, values) => {
        console.log(err)
        // console.log(values)
        this.queryParam.nodeContent = values.nodeContent
        this.confirmLoading = true
        const loadImg = []
        this.fileList.forEach(function (item, i) {
          loadImg.push(item.response.data)
        })

        this.queryParam.picJson = loadImg.length === 0 ? null : JSON.stringify(loadImg)
        this.queryParam.waybillId = this.trackNode[0].waybillId
        this.queryParam.dispatchId = this.trackNode[0].dispatchId
        // this.queryParam.tracks = JSON.stringify(this.trackNode)
        this.isSubmit = true
        this.fileList = []
        addTrackException(this.queryParam).then(res => {
          this.confirmLoading = false
          // console.log(res)
          if (res.code === 0) {
            this.$message.success('操作成功')
          } else {
            this.$message.fail(res.message)
          }
          this.info = {}
          this.visible = false
          this.form.resetFields()
          this.fileList = []
        }).finally(() => {
          this.isSubmit = false
          this.confirmLoading = false
        })
      })
    },
    handleaddCancel (isRefresh) {
      this.info = {}
      this.visible = false
      this.form.resetFields()
      this.fileList = []
      this.$emit('hideForm', isRefresh)
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
</style>
<style  >
  .addClaim .ant-table-thead > tr > th, .addClaim .ant-table-tbody > tr > td{
    padding: 10px
  }
  .addClaim .ant-form-item-label{
    text-align: left
  }
</style>
