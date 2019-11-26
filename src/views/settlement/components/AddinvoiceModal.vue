<template>
  <div class="site-addr-form-layout form-layout-body">
    <a-modal :title="title" :visible="visible" :maskClosable="false"
      @ok="handleadd" :confirmLoading="confirmLoading" @cancel="handleaddCancel" >
      <a-form :form="form">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label='发票信息：'>
          <a-select placeholder="请选择发票类型" @change="typeChange" v-decorator="['invoiceType']">
            <a-select-option :value="1">普通发票</a-select-option>
            <a-select-option :value="2">增值税发票</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="公司名称：">
<!--          @change="handleChange1"-->
          <a-auto-complete :dataSource="dataSource" @change="handleSearch"
                           v-decorator="['coopCompanyId', {rules: [{ required: true, message: `最多可输入50个字符`, whitespace: true, max: 50}]}]"
                           placeholder="请输入公司名称" />
        </a-form-item>
         <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="统一社会信用代码：">
          <a-input v-decorator="['creditCode']" :placeholder="`请输入对方税号`"/>
        </a-form-item>
         <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="账号：">
          <a-input v-decorator="['bankAccount']" :placeholder="`请输入账号`"/>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="开户行：">
          <a-select showSearch placeholder="请选择开户行" optionFilterProp="children" @change="handleChange2"
            :filterOption="filterOption" v-decorator="['bankId']" >
            <a-select-option v-for="openbank in openBankList" :title="openbank.dictName" :key="openbank.dictId" :value="openbank.dictId" >{{openbank.dictName}}</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="开票金额：">
          <a-input type="number" v-model="info.invoiceMoney"  v-decorator="['invoiceMoney',
              {rules: [{ required: true, message: `开票金额不能为空` }]}]" :placeholder="`请输入开票金额 `" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="联系人：">
          <a-input placeholder="请输入联系人" v-decorator="['contactName']"/>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="联系人手机号：">
          <a-input v-decorator="['mobile']" :placeholder="`请输入联系人手机号`"/>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="详细地址：">
          <a-input v-decorator="['address']" :placeholder="`请输入详细地址`"/>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label='上传图片' hasFeedback >
            <a-upload class="myUpload" :action="uploadPictureUrl" listType="picture-card" :fileList="fileList" @preview="handlePreview"
                :headers="headers" @change="handleChange"  >
              <div v-if="fileList.length < 1">
                <a-icon type="plus" /><div class="ant-upload-text">上传图片</div>
              </div>
            </a-upload>
            <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancelimg">
              <img alt="example" style="width: 100%" :src="previewImage">
            </a-modal>
          </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import { getBankByDataStatus } from '@/api/libraries'
import { getAllByPartnerId, getInvoiceWithLike } from '@/api/resource/partner'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { getUploadPictureUrl } from '@/api/common'
import fileBase from '@views/mixins/file_base'
import base from './mixins/base'
import { mapActions } from 'vuex'
import { throttle, trim } from 'lodash'
const openBankList = []

export default {
  name: 'AddinvoiceModal',
  mixins: [fileBase, base],
  // mixins: [librariesBase, amapBase],
  data () {
    return {
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      isSubmit: false,
      labelCol: { span: 7 },
      wrapperCol: { span: 14 },
      coopCompanyName: '',
      bankName: '',
      allPartnerList: [], // 公司名称列表
      openBankList: openBankList, // 开户行列表
      headers: {
        authorization: Vue.ls.get(ACCESS_TOKEN)
      },
      previewVisible: false,
      previewImage: '',
      fileList: [],
      uploadPictureUrl: getUploadPictureUrl(), // 上传图片
      // documentId: 'a7f09f8d526e489fb4b493f225cbb116',
      documentId: '',
      invoiceId: '',
      imgurl: '',
      dataSource: [],
      info: {},

      componeyList: [],
      selectCompony: {}
    }
  },
  mounted () {
    this.init()
  },
  watch: {
    selectCompony (val) {
      // this.resetSelComponyForm()
    }
  },
  computed: {
    title () {
      return `添加开票信息`
    }
  },
  methods: {
    ...mapActions('settlement', [
      'setdocumentData'
    ]),
    // 查询公司级联列表
    handleSearch: throttle(async function (v) {
      const key = trim(v)
      // console.log('value==', v)
      let find = this.getSelCompony(v)
      if (find.infoId) this.coopCompanyName = find.companyName
      // 重置表单的值
      if (this.selectCompony && this.selectCompony.infoId) {
        this.selectCompony = { companyName: v }
      }
      // 查询级联列表
      if (!key) {
        this.dataSource = []
      } else {
        const self = this
        await getInvoiceWithLike({ name: key }).then((res) => {
          const datas = res.data || []
          self.componeyList = res.data
          // 用于级联的下拉列表的显示只能是如下格式
          let source = []
          datas.forEach((val) => {
            source.push({ value: val.infoId, text: val.companyName })
          })
          self.dataSource = source
          // console.log(self.dataSource)
        })
      }
    }, 500),
    onSelect (value) {
      this.selectCompony = this.getSelCompony(value)
    },
    getSelCompony (value) {
      const sel = this.componeyList.filter((val) => {
        return val.infoId === value
      })
      return sel[0] || {}
    },
    init () {
      this.getAllPartnerList()
    },
    add (documentId, partnerId, invoiceId) {
      // console.log('documentId:' + documentId)
      // console.log('invoiceId:' + invoiceId)
      this.documentId = documentId
      this.fileList = []
      if (invoiceId) {
        // console.log(11)
        this.invoiceId = invoiceId
        this.pageConfig.addDetail({ invoiceId: invoiceId }).then((res) => {
          // console.log('修改添加开票信息')
          // console.log(res)
          this.info = res.data
          this.bankName = res.data.bankName
          this.coopCompanyName = res.data.coopCompanyName
          this.info.coopCompanyId = res.data.coopCompanyName
          this.form.setFieldsValue(this.info)
          // if (this.info.invoiceUrl !== '') {
          //   this.fileList = [{
          //     uid: '-1',
          //     name: 'xxx.png',
          //     status: 'done',
          //     type: 'image/jpeg',
          //     size: 15815,
          //     url: this.info.invoiceUrl
          //   }]
          // }
        })
      } else {
        // console.log(22)
        getAllByPartnerId({ partnerId: partnerId }).then((res) => {
          // console.log(res)
          let partner = {}
          if (res.data.companies) {
            partner.coopCompanyId = res.data.companies.coopCompanyId
            partner.coopCompanyName = res.data.companies.coopCompanyName
            partner.creditCode = res.data.companies.creditCode
          }
          if (res.data.contacts) {
            partner.address = res.data.contacts.address
            partner.contactName = res.data.contacts.contactName
            partner.mobile = res.data.contacts.mobile
          }
          if (res.data.invoiceInfos) {
            partner.bankAccount = res.data.invoiceInfos.bankAccount
            partner.bankId = res.data.invoiceInfos.bankId
            partner.bankName = res.data.invoiceInfos.bankName
          }
          this.form.setFieldsValue(this.info)
        })
        this.invoiceId = ''
      }
      this.visible = true
    },
    // 新增浮层确认事件
    handleadd (e) {
      if (this.isSubmit) return
      e.preventDefault()
      this.form.validateFields((err, values) => {
        console.log(err)
        console.log(values)
        // if (values.bankId.key) values.bankId = values.bankId.key
        values.documentId = this.documentId
        values.invoiceUrl = this.imgurl
        values.coopCompanyName = this.coopCompanyName
        values.bankName = this.bankName
        if (values.coopCompanyId === undefined) {
          this.$message.info('开票公司不能为空')
          return false
        }
        if (values.invoiceMoney === undefined) {
          this.$message.info('开票金额不能为空')
          return false
        }
        if (values.invoiceMoney <= 0) {
          this.$message.info('开票金额必须大于0')
          return false
        }
        // console.log(this.invoiceId)
        if (this.invoiceId !== '') values.invoiceId = this.invoiceId
        this.confirmLoading = true
        this.pageConfig.openbankUpdate(values).then(res => {
          this.confirmLoading = false
          console.log(res)
          if (res.code === 0) {
            this.$message.success('操作成功')
            this.pageConfig.openbankDetail({ documentId: this.documentId }).then(res => {
              console.log(res)
              this.setdocumentData(res.data.invoiceSimpleVoList)
            })
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
    // 新增浮层关闭事件
    handleaddCancel (isRefresh) {
      this.info = {}
      this.visible = false
      this.form.resetFields()
      this.$emit('hideForm', isRefresh)
    },
    // 客户名称选择框
    handleChange1 (value) {
      // console.log(`客户名称`)
      // console.log(value)
      let find = this.dataSource.find(item => item.infoId === value)
      this.coopCompanyName = find.companyName
    },
    // 开户行
    handleChange2 (value, option) {
      console.log('开户行')
      this.bankName = option.componentOptions.propsData.title
    },
    typeChange (value) {
      console.log(`selected ${value}`)
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },
    getAllPartnerList () {
      console.log('调用')
      getBankByDataStatus().then((res) => {
        console.log(res)
        console.log('开户行模糊查询')
        this.openBankList = res.data
      })
    },
    handleCancelimg () {
      this.previewVisible = false
    },
    handlePreview (file) {
      this.previewImage = file.url || file.thumbUrl
      this.previewVisible = true
    },
    handleChange ({ file, fileList }) {
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
        ['image/jpeg', 'image/png', 'image/bmp'].indexOf(file.type) > -1
      if (!isJPG) {
        this.$message.info('只能上传jpg、png、bmp格式的图片!')
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
