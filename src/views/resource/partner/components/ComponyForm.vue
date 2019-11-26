<template>
  <a-form :form="form" class="form">
    <div style="height: 0">
    <a-form-item>
      <a-input type="hidden" v-decorator="['coopCompanyId']"></a-input>
      <a-input type="hidden" v-decorator="['companyCharteredId']"></a-input>
      <a-input type="hidden" v-decorator="['companyChartered']"></a-input>
      <a-input type="hidden" v-decorator="['roadTransportId']"></a-input>
      <a-input type="hidden" v-decorator="['roadTransport']"></a-input>
      <a-input type="hidden" v-decorator="['otherCertificatesId']"></a-input>
      <a-input type="hidden" v-decorator="['otherCertificates']"></a-input>
    </a-form-item>
    </div>
    <a-row class="form-row" :gutter="16">
      <a-col :xl="{span: 8}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
        <a-form-item
          label="公司名称">
          <!-- <a-input placeholder="请输入公司名称" v-decorator="[ 'name', {rules: [{ required: true, message: '请输入公司名称', whitespace: true}]} ]" /> -->
          <a-auto-complete
            :dataSource="dataSource"
            @select="onSelect"
            @search="handleSearch"
            v-decorator="['coopCompanyName', {rules: [{ message: `最多可输入50个字符`, whitespace: true, max: 50}]}]"
            placeholder="请输入公司名称"
          />
        </a-form-item>
      </a-col>
      <a-col :xl="{span: 7, offset: 1}" :lg="{span: 8}" :md="{span: 12}" :sm="24">
        <a-form-item
          label="统一社会信用代码">
          <a-input
            v-decorator="['creditCode', {rules: [{ validator: validateCreditCode }]}]"
            maxlength="18"
            placeholder="请输入统一社会信用代码或注册号"/>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row class="form-row" :gutter="24">
      <a-col :md="24" :sm="24">
        <a-form-item
          label="上传证件">
          <a-row class="form-row" :gutter="24">
          <a-col :md="12" :sm="24">
            <a-upload
              class="myUpload"
              name="file"
              :action="uploadPictureUrl"
              listType="picture-card"
              :fileList="fileList"
              @preview="handlePreview"
              :headers="headers"
              @change="handleChange"
            >
            <div v-if="fileList.length < 1">
              <a-icon type="plus" />
                <div class="ant-upload-text">上传营业执照</div>
              </div>
            </a-upload>
          </a-col>
          <a-col v-if="type === 'carrier'" :md="12" :sm="24">
            <a-upload
              class="myUpload"
              name="file"
              :action="uploadPictureUrl"
              :beforeUpload="beforeUpload"
              listType="picture-card"
              :fileList="fileList1"
              @preview="handlePreview"
              :headers="headers"
              @change="handleChange1"
            >
            <div v-if="fileList1.length < 1">
              <a-icon type="plus" />
                <div class="ant-upload-text">上传道路运输许可证</div>
              </div>
            </a-upload>
          </a-col>
          <a-col v-if="type === 'thirdServer'" :md="12" :sm="24">
            <a-upload
              class="myUpload"
              name="file"
              :action="uploadPictureUrl"
              :beforeUpload="beforeUpload"
              listType="picture-card"
              :fileList="fileList2"
              @preview="handlePreview"
              :headers="headers"
              @change="handleChange2"
            >
            <div v-if="fileList2.length < 1">
              <a-icon type="plus" />
                <div class="ant-upload-text">上传其他证件</div>
              </div>
            </a-upload>
          </a-col>
          <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
            <img alt="example" style="width: 100%" :src="previewImage" />
          </a-modal>
          </a-row>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<script>
import { getCompanyWithLike } from '@/api/resource/partner'
import { throttle, trim } from 'lodash'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'

import { getUploadPictureUrl } from '@/api/common'
import fileBase from '@views/mixins/file_base'
import { validateCreditCode } from '@/utils/validate'

export default {
  name: 'InvoiceForm',
  mixins: [fileBase],
  props: {
    info: {
      type: Object,
      default () {
        return {}
      }
    },
    type: {
      type: String,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      // 校验相关
      validateCreditCode,

      componeyList: [],
      selectCompony: {},
      dataSource: [],
      form: this.$form.createForm(this),
      // 上传图片
      uploadPictureUrl: getUploadPictureUrl(),
      headers: {
        authorization: Vue.ls.get(ACCESS_TOKEN)
      },
      previewVisible: false,
      previewImage: '',
      fileList: [],
      fileList1: [],
      fileList2: []
    }
  },
  watch: {
    info: {
      deep: true,
      handler: function (val) {
        console.log('data update....')
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
  created () {
  },
  methods: {
    // 查询公司级联列表
    handleSearch: throttle(async function (v) {
      const key = trim(v)
      // 重置表单的值
      this.selectCompony = { coopCompanyId: '', coopCompanyName: v }
      // 查询级联列表
      if (!key) {
        this.dataSource = []
      } else {
        const self = this
        await getCompanyWithLike({ name: key }).then((res) => {
          const datas = res.data || []
          self.componeyList = res.data
          // 用于级联的下拉列表的显示只能是如下格式
          let source = []
          datas.forEach((val) => {
            source.push({ value: val.coopCompanyId, text: val.coopCompanyName })
          })
          self.dataSource = source
        })
      }
    }, 500),
    onSelect (value) {
      console.log('onSelect', value)
      this.selectCompony = this.getSelCompony(value)
    },
    resetSelComponyForm () {
      const { coopCompanyId = '', coopCompanyName = '', creditCode = '' } = this.selectCompony
      this.setCertUrl(this.selectCompony)
      this.form.setFieldsValue({ coopCompanyId, coopCompanyName, creditCode })
    },
    getSelCompony (value) {
      const sel = this.componeyList.filter((val) => {
        return val.coopCompanyId === value
      })
      return sel[0] || { coopCompanyName: value }
    },
    // handleSubmit () {
    //   // e.preventDefault()
    //   this.form.validateFields((err, values) => {
    //     return values
    //   })
    // },
    // 上传图片相关
    handleCancel () {
      this.previewVisible = false
    },
    handlePreview (file) {
      this.previewImage = file.url || file.thumbUrl
      this.previewVisible = true
    },
    handleChange ({ file, fileList, e }) {
      this.fileChange(file, fileList, 'companyChartered', 'fileList')
    },
    handleChange1 ({ file, fileList, e }) {
      this.fileChange(file, fileList, 'roadTransport', 'fileList1')
    },
    handleChange2 ({ file, fileList, e }) {
      this.fileChange(file, fileList, 'otherCertificates', 'fileList2')
    },
    setCertUrl (compony = {}) {
      const { companyCharteredId = '', companyChartered = '', roadTransportId = '', roadTransport = '', otherCertificatesId = '', otherCertificates = '' } = compony
      this.form.setFieldsValue({ 'companyCharteredId': companyCharteredId })
      this.form.setFieldsValue({ 'roadTransportId': roadTransportId })
      this.form.setFieldsValue({ 'otherCertificatesId': otherCertificatesId })
      this.setFileList('companyChartered', companyChartered, 'fileList')
      this.setFileList('roadTransport', roadTransport, 'fileList1')
      this.setFileList('otherCertificates', otherCertificates, 'fileList2')
    }
  }
}
</script>

<style scoped>

</style>
