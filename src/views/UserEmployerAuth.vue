<template>
  <div class="form-layout-body">
    <!-- <a-modal
      :visible="visible"
      :title="heading"
      @cancel="$emit('onCancel',visible)"
      :maskClosable="false"
    >-->
    <a-modal
      :visible="true"
      title="导入订单"
      @cancel="$emit('onCancel',visible)"
      :maskClosable="false"
      width="650px"
    >
      <template slot="footer">
        <a-button key="back" @click="$emit('onCancel',visible)">取消</a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="doImport">导入</a-button>
      </template>
      <a-form :form="form">
        <a-row class="form-row">
          <a-col :offset="4" :lg="16" :md="16" :sm="16">
            <span>
              您需要先下载模板，填好后再次上传
              <a
                class="ClassForDownloadTemplateFile"
                href="http://192.168.1.101:9527/assets/templates/test.xlsx"
              >
                <span>点击下载模板文件</span>
              </a>
            </span>
          </a-col>
        </a-row>
        <br>
        <a-row class="form-row">
          <a-col :offset="4" :lg="16" :md="16" :sm="16">
            <a-upload-dragger
              name="file"
              action="//jsonplaceholder.typicode.com/posts/"
              :fileList="fileList"
              @change="handleChange"
            >
              <p class="ant-upload-drag-icon">
                <a-icon type="inbox"/>
              </p>
              <p class="ant-upload-text">点击或将文件拖拽到这里上传，单次只能上传一个文件</p>
              <p class="ant-upload-hint">支持扩展名：.xls,.xlsx</p>
            </a-upload-dragger>
          </a-col>
        </a-row>
        <a-row class="form-row">
          <a-col :offset="4" :lg="16" :md="16" :sm="16">
            共导入10条：成功5条，失败5条。
            <a>下载错误报告</a>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>

  <!-- <a-row class="form-row">
          <a-col :lg="12" :md="12" :sm="24"></a-col>
  </a-row>-->
</template>
<script>
import fileBase from '@views/mixins/file_base'
// import { companyCertification } from '@/api/account'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'

import { getUploadPictureUrl } from '@/api/common'

export default {
  mixins: [fileBase],
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    visible: {
      type: Boolean,
      default: false
    },
    heading: {
      type: String,
      default: ''
    },
    userinfo: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      // fileurl,
      uploadName: '上传营业执照',
      myVisible: this.visible,
      form: this.$form.createForm(this),
      tipMessage: '',
      headers: {
        authorization: Vue.ls.get(ACCESS_TOKEN)
      },
      fileList: [],
      uploadPictureUrl: getUploadPictureUrl(), // 上传图片
      previewVisible: false,
      previewImage: ''
    }
  },
  created () {
    // alert(process.env.NODE_ENV)
  },
  mounted () {
    this.init()
  },
  watch: {
    employerAuthRecord: {
      deep: true,
      handler: function (val) {
        console.log('watch-val', val)
        this.$nextTick(() => {
          this.form.setFieldsValue(val)
        })
      }
    }
  },
  methods: {
    init () {},
    // 窗口关闭
    handleclose (e) {
      this.form.resetFields()
    },
    // 上传图片相关
    handleCancel () {
      this.previewVisible = false
    },
    handlePreview (file) {
      this.previewImage = file.url || file.thumbUrl
      this.previewVisible = true
    },
    doImport (e) {
      // import logic here
    },
    handleChange ({ file, fileList }) {
      console.log(file, fileList)

      this.fileChange(file, fileList, 'certUrl', 'fileList')
    },
    setFileUrl (detail = {}) {
      const { certUrl } = detail
      // setFileList方法在mixin中
      this.setFileList('certUrl', certUrl, 'fileList')
    },
    beforeUpload (file) {
      console.log('file', file)
      const isUploadable =
        this.isUploadable(file.name, '.xls') ||
        this.isUploadable(file.name, '.xlsx')
      if (!isUploadable) {
        this.$message.error('只能上传.xls|.xlsx格式的文件!')
        return false
      }
      // const isLt4M = file.size / 1024 / 1024 < 4
      // if (!isLt4M) {
      //   this.$message.error('上传文件不能大于4M!')
      // }
      return isUploadable // && isLt4M
    },
    isUploadable (fileName, fileExt) {
      return fileName.lastIndexOf(fileExt) + fileExt.length === fileName.length
    }
  }
}
</script>

<style scoped>
.ClassForDownloadTemplateFile {
  border-bottom: 1px solid;
  padding-bottom: 1%;
  text-decoration: none;
}
</style>
