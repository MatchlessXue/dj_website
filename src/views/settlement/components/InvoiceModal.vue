<template>
  <a-modal title="开票申请" :width="900" :visible="visible" :confirmLoading="confirmLoading" @cancel="handleCancel">
      <template slot="footer">
        <a-button key="back" @click="handleCancel">取消</a-button>
      </template>
    <a-spin :spinning="confirmLoading">
      <condition-modal v-if="hackReset"></condition-modal>
       <div class="table-page-option-wrapper" style="margin:30px 0 20px">
          <a-button @click="$refs.AddinvoiceModal.add(documentId,partnerId)" type="primary">添加开票信息</a-button>
      </div>
      <a-table :columns="columns" :dataSource="data" bordered :scroll="{x:1230, y: 200 }" :loading="loading">
        <span slot="operation" slot-scope="text, record">
          <a @click="$refs.AddinvoiceModal.add(documentId,partnerId,record.invoiceId)" style="margin-right:10px">修改</a>
          <!-- <a @click="deleteData(record)">删除</a> -->
          <a-popconfirm title='确定删除该条信息吗?' @confirm="() => deleteData(record)">
              <a>删除</a>
            </a-popconfirm>
        </span>
      </a-table>
      <addinvoice-modal
        ref="AddinvoiceModal"
        @ok="handleOk"
      ></addinvoice-modal>
    </a-spin>
  </a-modal>
</template>

<script>
import ConditionModal from './condition1'
import AddinvoiceModal from './AddinvoiceModal'
import { mapGetters, mapActions } from 'vuex'
import base from './mixins/base'

const columns = [
  {
    title: '发票类型',
    width: 120,
    dataIndex: 'invoiceTypeName'
  },
  {
    title: '公司名称',
    width: 100,
    dataIndex: 'coopCompanyName'
  },
  {
    title: '统一社会信用代码',
    width: 170,
    dataIndex: 'creditCode'
  },
  {
    title: '账号',
    width: 120,
    dataIndex: 'bankAccount'
  },
  {
    title: '开户行',
    width: 100,
    dataIndex: 'bankName'
  },
  {
    title: '开票金额',
    width: 100,
    dataIndex: 'invoiceMoney'
  },
  {
    title: '联系人',
    width: 100,
    dataIndex: 'contactName'
  },
  {
    title: '联系人电话',
    width: 140,
    dataIndex: 'mobile'
  },
  {
    title: '详细地址',
    width: 180,
    dataIndex: 'address'
  },
  {
    title: '操作',
    width: 100,
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' }
  }
]
export default {
  name: 'InvoiceModal',
  mixins: [base],
  components: {
    ConditionModal,
    AddinvoiceModal
  },
  data () {
    return {
      columns,
      data: [],
      visible: false,
      loading: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      documentId: '',
      partnerId: '',
      hackReset: false
    }
  },
  computed: {
    ...mapGetters(['tenantId']),
    ...mapGetters('settlement', ['getDocumentData']),
    listenshowpage1 () {
      return this.getDocumentData
    }
  },
  watch: {
    listenshowpage1: function (a, b) {
      this.data = a
    }
  },
  methods: {
    ...mapActions('settlement', [
      'setdocumentId'
    ]),
    deleteData (record) {
      this.pageConfig.openbankDetele({ invoiceId: record.invoiceId }).then(res => {
        // console.log(res)
        if (res.code === 0) {
          this.$message.success('删除成功')
          this.getInfo()
        } else {
          this.$message.fail(res.message)
        }
      })
    },
    add (documentId, partnerId) {
      console.log(partnerId)
      this.setdocumentId(documentId)
      this.visible = true
      this.documentId = documentId
      this.partnerId = partnerId
      this.hackReset = false
      this.$nextTick(() => {
        this.hackReset = true
      })
      this.getInfo()
    },
    getInfo () {
      this.loading = true
      this.data = this.getDocumentData
      this.pageConfig.openbankDetail({ documentId: this.documentId }).then(res => {
        // console.log(res)
        this.loading = false
        this.data = res.data.invoiceSimpleVoList
      })
    },
    handleOk () {
    },
    handleCancel () {
      this.visible = false
    }
  }
}
</script>

<style scoped>
</style>
