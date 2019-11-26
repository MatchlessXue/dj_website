<template>
  <div>
      <div class="table-page-option-wrapper" style="margin:20px 0 10px;font-size:18px;"><span v-if="title">{{title}}</span></div>
      <a-table :columns="columns" :scroll="{ x: scrollX }" :dataSource="data" bordered :pagination="false" :loading="loading">
        <template v-for="(col, i) in cols" :slot="col" slot-scope="text, record" style="text-align: center">

          <a-select :key="col" :disabled="bizStatus>302" v-if="col === 'payMothod'" style="width: 126px" :value="text" :placeholder="columns[i].title"
                    @change="(value) => handleChange(value, record.key, col)">
                    <a-select-option v-for="openbank in paymothodList" :key="openbank.dictId" >{{openbank.dictName}}</a-select-option>
          </a-select>

          <a-input type="text" :disabled="bizStatus>302" :key="col" v-else-if="col === 'payMoney'" style="margin: -5px 0" :value="text" :placeholder="columns[i].title"
                   v-decorator="[ `${col}${record.key}`,{rules: [{ message: `请输入正确的金额`, whitespace: true, max: 10}]}]"
                   @change="e => handleChange(e.target.value, record.key, col)"
                   maxLength="10" />

          <a-input :key="col" :disabled="bizStatus>302" v-else-if="col === 'payerAccount'" style="margin: -5px 0" :value="text" :placeholder="columns[i].title"
          v-decorator="[ `${col}${record.key}`]" @change="e => handleChange(e.target.value, record.key, col)" maxLength="10" />

          <a-date-picker :key="col" :disabled="bizStatus>302" v-else-if="col === 'payDate'" showTime format="YYYY-MM-DD HH:mm:ss" :defaultValue="record.payDates"
          :placeholder="columns[i].title" v-decorator="[ `${col}${record.key}`]" @change="e => onChange(e, record.key)"/>

          <a-select :key="col" :disabled="bizStatus>302" v-else-if="col === 'payeeBankId'" style="width: 126px" :value="text" :placeholder="columns[i].title" @change="(value) => handleChange(value, record.key, col)">
            <a-select-option v-for="openbank in openBankList" :key="openbank.dictId" >{{openbank.dictName}}</a-select-option>
          </a-select>

          <a-input :key="col" :disabled="bizStatus>302" v-else-if="col === 'payeeCompany'" style="margin: -5px 0" :value="text" :placeholder="columns[i].title"
          v-decorator="[ `${col}${record.key}`]"  @change="e => handleChange(e.target.value, record.key, col)" maxLength="10" />

          <a-input :key="col" :disabled="bizStatus>302"  v-else-if="col === 'payee'" style="margin: -5px 0" :value="text" :placeholder="columns[i].title"
          v-decorator="[ `${col}${record.key}`]" @change="e => handleChange(e.target.value, record.key, col)" maxLength="10" />

          <a-input :key="col" :disabled="bizStatus>302" v-else-if="col === 'payRemark'" style="margin: -5px 0" :value="text"
          :placeholder="columns[i].title" v-decorator="[ `${col}${record.key}`]"  @change="e => handleChange(e.target.value, record.key, col)"
          maxLength="10" />
        </template>

        <span  v-if="bizStatus<=302" slot="operation" slot-scope="text, record">
          <span>
            <a-popconfirm title='确定删除该条信息吗?' @confirm="() => cancel(record.key)">
              <a>删除</a>
            </a-popconfirm>
          </span>
        </span>
      </a-table>
      <div class="addbtn"  @click="addData" v-if="bizStatus<=302">+ 新增{{title}}</div>
      <div>
        <a-form :form="form">
          <a-form-item :label="bizStatus>302?'附件明细':'上传图片'">
            <a-upload
              class="myUpload"
              :action="uploadPictureUrl"
              listType="picture-card"
              :fileList="fileList"
              @preview="handlePreview"
              :headers="headers"
              @change="handleChange1"  >
              <div v-if="fileList.length < 10 && bizStatus<=302" >
                <a-icon type="plus" />
                <div class="ant-upload-text">上传图片</div>
              </div>
            </a-upload>
            <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancelimg">
              <img alt="example" style="width: 100%" :src="previewImage">
            </a-modal>
          </a-form-item>
        </a-form>
      </div>
    </div>
</template>

<script>
import moment from 'moment'
// import { paymentDetail } from '@/api/invoice/invoice.js'
import { getUploadPictureUrl } from '@/api/common'
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { countCollumnsWidth } from '@/utils/util'

import { getBankByDataStatus, getpayMothod } from '@/api/libraries'
import base from './mixins/base'
import fileBase from '@views/mixins/file_base'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'PaymentModal',
  mixins: [base, fileBase],
  components: {
  },
  props: {
    payType: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      bizStatus: 0,
      columns: [],
      columns1: [
        {
          title: '支付方式',
          width: 200,
          dataIndex: 'payMothod',
          scopedSlots: { customRender: 'payMothod' }
        },
        {
          title: '支付金额',
          width: 180,
          dataIndex: 'payMoney',
          scopedSlots: { customRender: 'payMoney' }
        },
        {
          title: '支付账号',
          width: 240,
          dataIndex: 'payerAccount',
          scopedSlots: { customRender: 'payerAccount' }
        },
        {
          title: '要求付款时间',
          width: 300,
          dataIndex: 'payDate',
          scopedSlots: { customRender: 'payDate' }
        },
        {
          title: '收款银行',
          width: 260,
          dataIndex: 'payeeBankId',
          selectOptions: this.openBankList,
          scopedSlots: { customRender: 'payeeBankId' }
        },
        {
          title: '收款公司',
          width: 230,
          dataIndex: 'payeeCompany',
          scopedSlots: { customRender: 'payeeCompany' }
        },
        {
          title: '联系人',
          width: 200,
          dataIndex: 'payee',
          scopedSlots: { customRender: 'payee' }
        },
        {
          title: '备注',
          width: 200,
          dataIndex: 'payRemark',
          scopedSlots: { customRender: 'payRemark' }
        },
        {
          title: '操作',
          width: 100,
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      columns2: [
        {
          title: '结款类型',
          width: 200,
          dataIndex: 'payMothod',
          scopedSlots: { customRender: 'payMothod' }
        },
        {
          title: '结款金额',
          width: 180,
          dataIndex: 'payMoney',
          scopedSlots: { customRender: 'payMoney' }
        },
        {
          title: '收款时间',
          width: 300,
          dataIndex: 'payDate',
          scopedSlots: { customRender: 'payDate' }
        },
        {
          title: '备注',
          width: 200,
          dataIndex: 'payRemark',
          scopedSlots: { customRender: 'payRemark' }
        },
        {
          title: '操作',
          width: 100,
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      data: [],
      scrollX: 0,
      loading: false,
      confirmLoading: false,
      previewVisible: false,
      documentId: '',
      previewImage: '',
      fileList: [],
      urlList: [],
      openBankList: [],
      paymothodList: [],
      totalMoney: 0,
      headers: {
        authorization: Vue.ls.get(ACCESS_TOKEN)
      },
      form: this.$form.createForm(this),
      uploadPictureUrl: getUploadPictureUrl(), // 上传图片
      mdl: {},
      cols: [],
      cols1: ['payMothod', 'payMoney', 'payerAccount', 'payDate', 'payeeBankId', 'payeeCompany', 'payee', 'payRemark'],
      cols2: ['payMothod', 'payMoney', 'payDate', 'payRemark']
    }
  },
  computed: {
    ...mapGetters(['tenantId']),
    ...mapGetters('settlement',
      ['getDocumentId']
    ),
    title () {
      // type: 1：添加付款；2：添加结款；
      return this.payType === 1 ? '添加付款' : '添加结款'
    }
  },
  created () {
    this.columns = this.payType === 1 ? this.columns1 : this.columns2
    this.cols = this.payType === 1 ? this.cols1 : this.cols2
    this.scrollX = countCollumnsWidth(this.columns)
    console.log(this.scrollX)
    this.add()
  },
  methods: {
    ...mapActions('settlement', [
      'paymentList'
    ]),
    onChange (value, key, column) {
      this.data[ key - 1 ].payDate = value.format('YYYY-MM-DD HH:mm:ss')
    },
    handleadd () {
      let paylists = { documentId: this.documentId, invoiceVo: this.data, soucementDocumentPicVoList: this.urlList }
      this.paymentList({ totalMoney: this.totalMoney, paylists: paylists })
    },
    addData () {
      // console.log(this.data)
      if (!this.data) {
        this.data = []
      }
      this.data.push({ 'key': this.data.length + 1, editable: false })
      this.scrollX = countCollumnsWidth(this.columns)
      console.log(this.data)
    },
    handleCancelimg () {
      this.previewVisible = false
    },
    handlePreview (file) {
      this.previewImage = file.url || file.thumbUrl
      this.previewVisible = true
    },
    handleChange1 ({ file, fileList }) {
      this.fileChange(file, fileList, 'certUrl', 'fileList')
      // console.log(this.fileList)
      let url = []
      this.fileList.forEach(function (item, i) {
        url.push({ documentUrl: item.url || item.response.data })
      })
      this.urlList = url
      this.handleadd()
      // console.log(this.urlList)
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
    },
    handleChange (value, key, column) {
      const newData = [...this.data]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        target[column] = value
        this.data = newData
      }
      // console.log('数据修改')
      // console.log(key)
      this.handleadd()
    },
    save (key) {
      const newData = [...this.data]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        delete target.editable
        this.data = newData
      }
    },
    cancel (key) {
      const newData = [...this.data]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        delete target.editable
        this.data = newData.filter(item => key !== item.key)
      }
      this.handleadd()
    },
    onSelect (selectedKeys, info) {
    //   console.log('selectedKeys', selectedKeys)
    //   console.log('onSelect', info)
      this.selectedKeys = selectedKeys
    },
    add () {
      this.visible = true
      getBankByDataStatus().then((res) => {
        this.openBankList = res.data
      })
      getpayMothod().then((res) => {
        this.paymothodList = res.data
      })
      this.init()
    },
    init () {
      this.documentId = this.getDocumentId || ''
      this.getDetailList()
    },
    getDetailList () {
      if (!this.documentId) {
        this.data = []
        return
      }

      this.loading = true
      this.pageConfig.paymentDetail({ documentId: this.documentId }).then(res => {
        console.log('结算单详情')
        console.log(res)
        this.loading = false
        this.data = res.data.paymentSimpleVoList
        this.bizStatus = res.data.bizStatus
        this.totalMoney = res.data.totalMoney
        this.fileList = []
        this.data.forEach(function (item, i) {
          item.key = i + 1
          item.payDates = item.payDate === null ? moment() : moment(item.payDate, 'YYYY-MM-DD HH:mm:ss')
        })
        console.log(this.bizStatus)
        console.log(this.data)
        let imgurl = res.data.sourceDocumentPicVos
        this.urlList = imgurl.slice(0)
        let _this = this
        if (imgurl.length > 0) {
          imgurl.forEach(function (item, i) {
            _this.fileList.push({
              uid: item.picId,
              name: 'xxx.png',
              status: 'done',
              type: 'image/jpeg',
              size: 15815,
              url: item.documentUrl
            })
          })
        }
        // console.log(_this.fileList)
        this.totalMoney = res.data.totalMoney
        this.handleadd()
        // console.log(this.data)
      })
    },
    setbizStatus () {
      return this.bizStatus
    }
  }
}
</script>

<style scoped>
  .addbtn{
    margin: 10px 0 30px;
    height: 32px;
    line-height: 32px;
    color: #1890FF;
    font-size: 14px;
    border: 1px dotted #1890FF;
    border-radius: 4px;
    text-align: center;
    cursor: pointer;
  }
</style>
