<template>
  <div class="form-layout-body">
    <a-modal :visible="visible"
             :title="heading"
             @cancel="$emit('onCancel',visible)"
             :maskClosable="false">
      <template slot="footer">
        <a-button key="back"
                  @click="$emit('onCancel',visible)">取消</a-button>
        <a-button key="submit"
                  type="primary"
                  :loading="loading"
                  @click="onOkForSubmit">提交</a-button>
      </template>
      <a-form :form="form">
        <a-row class="form-row">
          <h3>请{{uploadName}}</h3>
        </a-row>
        <a-row class="form-row">
          <a-form-item>
            <a-input type="hidden"
                     v-decorator="['certUrl']" />
          </a-form-item>
          <!-- <a-upload class="myUpload"
                      :action="uploadPictureUrl"
                      listType="picture-card"
                      :fileList="fileList"
                      @change="handleChange"
                      :beforeUpload="beforeUpload"
                      :headers="headers"
                      @preview="handlePreview">
              <div v-if="fileList.length < 1">
                <a-icon type="plus" />
                <div class="ant-upload-text">上传营业执照</div>
              </div>
            </a-upload> -->
          <a-upload :action="uploadPictureUrl"
                    class="myUpload2"
                    listType="picture-card"
                    :showUploadList="false"
                    :beforeUpload="beforeUpload"
                    :headers="headers"
                    @change="handleChange">
            <img :src="previewImage"
                 class="codeimg" />
            <!-- <a-button>
                <a-icon type="plus" /> 上传营业执照
              </a-button> -->
            <div v-if="!previewImage">
              <a-icon type="plus" />
              <div class="ant-upload-text">上传营业执照</div>
            </div>
          </a-upload>
          <a-modal :visible="previewVisible"
                   :footer="null"
                   @cancel="handleCancel">
            <img alt="example"
                 style="width: 100%"
                 :src="previewImage">
          </a-modal>
        </a-row>
        <a-row class="form-row">{{tipMessage}}
        </a-row>
        <a-row class="form-row">只能上传jpg、png、bmp格式且不大于4M的图片
        </a-row>
      </a-form>
    </a-modal>
  </div>

  <!-- <a-row class="form-row">
          <a-col :lg="12" :md="12" :sm="24"></a-col>

          <a-col :lg="12" :md="12" :sm="24"></a-col>
  </a-row>-->
</template>
<script>
import fileBase from '@views/mixins/file_base'
import { companyCertification } from '@/api/account'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import axios from 'axios'
import { getUploadPictureUrl } from '@/api/common'
import Compressor from 'compressorjs'

export default {
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
  mixins: [fileBase],
  data () {
    return {
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
    init () { },
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
    onOkForSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        console.log('this.loginMobile', this.loginMobile)
        if (!err) {
          const certUrl = values.certUrl
          if (certUrl) {
            companyCertification({
              certUrl: certUrl,
              mobile: this.userinfo.loginMobile
            }).then(
              res => {
                console.log('res', res)
                if (res.code === 0) {
                  this.$emit('onOkForSubmit', certUrl)
                } else {
                  this.$message.error(res.message)
                }
              },
              error => {
                this.$message.error(error || '提交失败！')
                console.log(error)
              }
            )
          } else {
            this.tipMessage = ''
            this.$message.error('上传图片失败！')
          }
        } else {
          return false
        }
      })
    },
    handleChange ({ file, fileList }) {
      const isJPG =
        ['image/jpeg', 'image/png', 'image/bmp'].indexOf(file.type) > -1
      if (!isJPG) {
        this.tipMessage = '只能上传jpg、png、bmp格式的图片!'
      }
      const isLt2M = file.size / 1024 / 1024 < 5
      if (!isLt2M) {
        this.tipMessage = '上传图片不能大于5M!'
      }
      if (isJPG && isLt2M) {
        let that = this
        let upinfo = new Compressor(file, {
          quality: 0.8,
          maxWidth: 2000,
          maxHeight: 2000,
          success (result) {
            const formData = new FormData()
            formData.append('file', result, result.name)
            axios.post(getUploadPictureUrl(), formData).then((res) => {
              that.previewImage = res.data.data
              fileList.push(res.data.data)
              that.form.setFieldsValue({
                'certUrl': res.data.data
              })
            })
          },
          error (err) {
            console.log(err.message)
          }
        })
        console.log('upinfo', upinfo)
      }
    },
    beforeUpload () {
      return false
    }
  }
}
</script>

<style scoped>
.danger {
  color: red;
}
.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
.codeimg {
  width: 100%;
}
</style>
<style lang="less">
body {
  .ant-upload-select-picture-card {
    margin: 0 auto !important;
  }
  .ant-modal-body {
    text-align: center !important;
  }
}
</style>
