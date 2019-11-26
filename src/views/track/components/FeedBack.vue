<template>
  <div class="site-addr-form-layout form-layout-body">
    <a-modal :title="title" :width="600" :visible="visible" :maskClosable="false"
      @ok="handleadd" :confirmLoading="confirmLoading" @cancel="handleaddCancel" class="feedback">
      <a-spin :spinning="confirmLoading">
        <a-form :form="form">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="日期：">
           <a-date-picker showTime format="YYYY-MM-DD HH:mm:ss" @change="onChange" placeholder="请选择发生日期"/>
          </a-form-item>
           <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="位置：">
            <a-input v-decorator="['address']"/>
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperColimg" label='上传图片' hasFeedback >
            <a-upload class="myUpload" :action="uploadPictureUrl" listType="picture-card" :fileList="fileList"  @preview="handlePreview"
                :headers="headers" @change="handleChange"  >
              <div v-if="fileList.length < 9">
                <a-icon type="plus" />
                <div class="ant-upload-text">上传图片</div>
              </div>
            </a-upload>
            <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancelimg">
              <img alt="example" style="width: 100%" :src="previewImage">
            </a-modal>
          </a-form-item>
           <a-form-item label='说明：' hasFeedback >
            <a-textarea :rows="5" placeholder="最多可输入50个汉字" v-decorator="['nodeContent']"/>
          </a-form-item>
          <a-form-item>
            <h3 style="font-weight:bold;margin-top:20px;">历史在途信息</h3>
          </a-form-item>
           <a-form-item>
            <template>
              <a-steps :current="steps.length - 1" progressDot>
                <a-step v-for="item in steps" :key="item.index">
                  <template slot="title">
                    <div style="height:24px;overflow:hidden">{{item.address ? item.address : ''}}</div>
                    <div style="height:48px">{{item.nodeDate}}</div>
                    <div>跟踪人员：{{item.createAccountName}}</div>
                  </template>
                </a-step>
              </a-steps>
            </template>
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
import { feedback } from '@/api/track/track.js'
export default {
  name: 'FeedBack',
  mixins: [fileBase],
  props: {
    payType: {
      type: String,
      default: 'waybill'
    }
  },
  data () {
    return {
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
      nowTimes: '',
      dataSource: [],
      info: {},
      trackNode: [],
      steps: [],
      queryParam: {
        nodeDate: '',
        address: '',
        nodeContent: '',
        picJson: ''
      }
    }
  },
  mounted () {
  },
  watch: {
    trackNode: {
      deep: true,
      handler: function (val) {
        console.log(val)
        console.log('trackNode 》watch-val', val, this.payType)
        this.$nextTick(() => {
          // if (val.length > 0) {
          //   debugger
          //   let reqData = (val[0].dispatchId) ? { dispatchId: val[0].dispatchId } : undefined
          //   !reqData && (reqData = (val[0].waybillId) ? { waybillId: val[0].waybillId } : undefined)
          //   reqData && getDispatchTrackNodes(reqData).then(res => {
          //     this.steps = res.data
          //   })
          // }

          // 调度单跟踪  -- 在途 -- 历史在途信息
          // val.length > 0 && waybillTrackNodes({
          //   waybillId: val[0].waybillId,
          //   page: 1,
          //   pageSize: 30
          // }).then(res => {
          //   this.dataList = res.data.records
          // })
        })
      }
    }
  },
  computed: {
    title () {
      return `在途反馈`
    }
  },
  methods: {
    add (rows) {
      this.steps = rows[0].feedBack ? rows[0].feedBack : []
      console.log(this.steps)
      if (this.steps && this.steps.length > 3) {
        this.steps = this.steps.splice(this.steps.length - 4, 4)
      }
      this.trackNode = rows
      this.visible = true
    },
    onChange (date, dateString) {
      this.queryParam.nodeDate = dateString
    },
    handleadd (e, isRefresh) {
      if (this.isSubmit) return
      e.preventDefault()
      this.form.validateFields((err, values) => {
        // console.log(values)
        if (!err) {
          if (values.address && values.address.length > 8) {
            this.$message.info('反馈的位置不可超过八个字符')
            return false
          }
          this.queryParam.address = values.address
          this.queryParam.nodeContent = values.nodeContent
          this.confirmLoading = true
          const loadImg = []
          this.fileList.forEach(function (item, i) {
            loadImg.push(item.response.data)
          })
          this.queryParam.picJson = loadImg.length === 0 ? null : JSON.stringify(loadImg)
          this.payType === 'dispatch' && (this.queryParam.dispatchId = this.trackNode[0].dispatchId)
          if (this.payType === 'waybill') {
            this.queryParam.waybillId = this.trackNode[0].waybillId
            this.queryParam.waybillStatus = this.trackNode[0].waybillStatus
          }
          // this.queryParam.tracks = JSON.stringify(this.trackNode)
          this.confirmLoading = true
          this.isSubmit = true
          feedback(this.queryParam).then(res => {
            this.confirmLoading = false
            // console.log(res)
            if (res.code === 0) {
              this.$message.success('操作成功')
              this.$emit('hideForm', isRefresh)
            } else {
              this.$message.fail(res.message)
            }
            this.info = {}
            this.queryParam.nodeDate = undefined
            this.fileList = []
            this.visible = false
            this.form.resetFields()
          }).finally(() => {
            this.confirmLoading = false
            this.isSubmit = false
          })
        }
      })
    },
    handleaddCancel (isRefresh) {
      this.info = {}
      this.visible = false
      this.fileList = []
      this.queryParam.nodeDate = undefined
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
<style lang="less">
.feedback .ant-form-item-label{
    text-align: left
  }
</style>
