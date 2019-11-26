<template>
  <div class="site-addr-form-layout form-layout-body">
    <a-modal :title="title" :width="600" :visible="visible" :maskClosable="false"
      @ok="handleadd" :confirmLoading="confirmLoading" @cancel="handleaddCancel">
      <a-spin :spinning="confirmLoading">
        <a-form :form="form">
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
import { uploadReceiptMail } from '@/api/receipt/receipt.js'
export default {
  name: 'FeedBack',
  mixins: [fileBase],
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
      dataSource: [],
      info: {},
      trackNode: [],
      steps: [],
      nowTimes: '',
      queryParam: {
        waybillId: '',
        picJson: ''
      }
    }
  },
  mounted () {
  },
  watch: {
  },
  computed: {
    title () {
      return `上传回单`
    }
  },
  methods: {
    add (waybillId) {
      // console.log(waybillId)
      this.queryParam.waybillId = waybillId
      this.visible = true
      this.fileList = []
    },
    handleadd (e, isRefresh) {
      if (this.isSubmit) return
      e.preventDefault()
      this.form.validateFields((err, values) => {
        console.log(err)
        this.confirmLoading = true
        const loadImg = []
        this.fileList.forEach(function (item, i) {
          loadImg.push(item.response.data)
        })
        // console.log(loadImg)
        this.queryParam.picJson = JSON.stringify(loadImg)
        uploadReceiptMail(this.queryParam).then(res => {
          this.confirmLoading = false
          // console.log(res)
          if (res.code === 0) {
            this.$message.success('操作成功')
            this.fileList = []
            this.$emit('hideForm', isRefresh)
          } else {
            this.$message.fail(res.message)
          }
          this.info = {}
          this.visible = false
          this.form.resetFields()
        }).catch(error => {
          this.confirmLoading = false
          this.$message.fail(error)
        })
      })
    },
    handleaddCancel (isRefresh) {
      this.info = {}
      this.visible = false
      this.form.resetFields()
      // this.$emit('hideForm', isRefresh)
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
