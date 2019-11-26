<template>
  <a-form :form="form" class="form">
    <a-input type="hidden" v-decorator="['coopCompanyId']"></a-input>
    <a-row class="form-row" :gutter="16">
      <a-col :lg="12" :md="12" :sm="24">
        <a-form-item label="公司名称" :labelCol="{ span: 4 }" :wrapperCol="wrapperCol">
         {{detail.coopCompanyName}}
        </a-form-item>
      </a-col>
      <a-col :lg="12" :md="12" :sm="24">
        <a-form-item label="统一社会信用代码" :labelCol="{ span: 10 }" :wrapperCol="wrapperCol">
          {{detail.creditCode}}
        </a-form-item>
      </a-col>
    </a-row>
    <a-row class="form-row" :gutter="16">
      <a-col :lg="12" :md="24" :sm="24">
        <a-form-item
          label="上传证件"
          :labelCol="{ span: 4 }"
          :wrapperCol="{ span: 12 }">
          <a-row>
            <a-col :md="12" :sm="24">
              <a-upload
                class="myUpload"
                name="avatar"
                listType="picture-card"
                :fileList="fileList"
                :showUploadList="{ showRemoveIcon: false }"
                @preview="handlePreview"
              >
              </a-upload>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-upload
                class="myUpload"
                name="avatar"
                listType="picture-card"
                :fileList="fileList2"
                :showUploadList="{ showRemoveIcon: false }"
                @preview="handlePreview"
              >
              </a-upload>
            </a-col>
            <a-col :md="12" :sm="24">
              <a-upload
                class="myUpload"
                name="avatar"
                listType="picture-card"
                :fileList="fileList3"
                :showUploadList="{ showRemoveIcon: false }"
                @preview="handlePreview"
              >
              </a-upload>
            </a-col>
          </a-row>
          <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
            <img alt="example" style="width: 100%" :src="previewImage" />
          </a-modal>
        </a-form-item>
      </a-col>

    </a-row>
  </a-form>
</template>

<script>
import fileBase from '@views/mixins/file_base'

export default {
  name: 'ComponyDetail',
  mixins: [fileBase],
  props: {
    detail: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      componeyList: [],
      selectCompony: {},
      dataSource: [],
      form: this.$form.createForm(this),
      labelCol: { span: 8 },
      wrapperCol: { span: 12, offset: 1 },
      // 上传图片
      previewVisible: false,
      previewImage: '',
      fileList: [],
      fileList2: [],
      fileList3: []
    }
  },
  watch: {
    detail: {
      deep: true,
      handler: function (val) {
        this.$nextTick(() => {
          this.form.setFieldsValue(val)
          this.setCertUrl(val)
        })
      }
    },
    selectCompony (val) {
      this.resetSelComponyForm()
    }
  },
  computed: {
  },
  created () {
  },
  methods: {
    // 上传图片相关
    handleCancel () {
      this.previewVisible = false
    },
    handlePreview (file) {
      this.previewImage = file.url || file.thumbUrl
      this.previewVisible = true
    },
    setCertUrl (compony = {}) {
      const { companyChartered = '', roadTransport = '', otherCertificates = '' } = compony
      this.setFileList('companyChartered', companyChartered, 'fileList')
      this.setFileList('roadTransport', roadTransport, 'fileList2')
      this.setFileList('otherCertificates', otherCertificates, 'fileList3')
    }
  }
}
</script>

<style scoped>

</style>
