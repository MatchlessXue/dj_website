<template>
  <div class="page-container">
    <a-card :bordered="false"
            class="card-container">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :md="6"
                   :sm="12">
              <a-form-item label="申请人">
                <a-auto-complete v-model="queryParam.tel"
                                 placeholder="请输入手机号"
                                 :allowClear="true" />
              </a-form-item>
            </a-col>
            <a-col :md="6"
                   :sm="12">
              <span class="table-page-search-submitButtons">
                <a-button type="primary"
                          @click="handleQuery">查询</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-card>
    <a-card :bordered="false"
            class="content-layout">
      <s-table ref="table"
               size="default"
               :columns="columns"
               :data="loadData"
               :showAlertInfo="false"
               :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
               @onSelect="onChange">
        <span slot="businessType">企业认证</span>
        <span slot="verifiedStatus"
              slot-scope="text">{{GetApproveStatusDes(text)}}</span>
        <span slot="action"
              slot-scope="text, record">
          <a @click="handleApprove(record)"
             v-if="record.verifiedStatus===2">审批</a>
          <a @click="handleApproveView(record)"
             v-if="record.verifiedStatus!==2">查看</a>
        </span>
      </s-table>
      <approve-form-modal :visible="isModalShow"
                          :approveRecord="approveRecordForModal"
                          :heading="modalHeading"
                          ref="approveForm"
                          @onCancel="modalCancel($event)"
                          @onOkForReject="modalRejectConfirm($event)"
                          @onOkForPass="modalPassConfirm($event)"></approve-form-modal>
      <approve-form-views-modal :visible="isModalShow2"
                                :approveRecord="approveRecordForViewModal"
                                :heading="modalHeading"
                                ref="approveFormviews"
                                @onCancel="modalCancel($event)"></approve-form-views-modal>
    </a-card>
  </div>
</template>

<script>
import STable from '@/components/table/'
// import { queryCompanysByPage, companyAudit, companyReject } from '@/api/account'
import { queryCompanysByPage, companyAudit, companyAuditReject } from '@/api/account'
import EmployerApproveFormModal from '@/views/account/employerapprove/EmployerApproveFormModal'
import EmployerApproveViewsModal from '@/views/account/employerapprove/EmployerApproveViewsModal'
import { getInfo } from '@/api/login'
import EmployerAuthBus from '@/mixins/account/employerAuthBus'
export default {
  name: 'ApproveList',
  components: {
    STable,
    ApproveFormModal: EmployerApproveFormModal,
    ApproveFormViewsModal: EmployerApproveViewsModal
  },
  data () {
    return {
      isModalShow: false,
      isModalShow2: false,
      modalHeading: '',
      approveRecordForModal: {},
      approveRecordForViewModal: {},
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '业务类型',
          dataIndex: 'businessType',
          scopedSlots: { customRender: 'businessType' }
        },
        {
          title: '提交时间',
          dataIndex: 'recTime'
        },
        {
          title: '状态',
          dataIndex: 'verifiedStatus',
          scopedSlots: { customRender: 'verifiedStatus' },
          filters: [
            { text: '待审核', value: '2' },
            { text: '审批通过', value: '3' },
            { text: '审核驳回', value: '4' }
          ]
        },
        {
          title: '申请人',
          dataIndex: 'tel'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '200px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        // console.log('queryParam', this.queryParam)
        console.log('parameter', parameter)
        var tempverifiedStatus = []
        if (parameter && parameter.verifiedStatus) {
          parameter.verifiedStatus.forEach((val) => {
            tempverifiedStatus.push(parseInt(val))
          })
          parameter.verifiedStatus = tempverifiedStatus
        }
        return queryCompanysByPage(
          Object.assign(parameter, this.queryParam)
        ).then(res => {
          // console.log('loadData———res data==', res)
          return res.data || []
        })
      },

      selectedRowKeys: [],
      selectedRows: []
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () { },
    handleQuery () {
      this.$refs.table && this.$refs.table.refresh()
    },
    GetApproveStatusDes (text) {
      switch (text) {
        case 1: // 去认证
          return '去认证'
        case 2: // 审核中
          return '待审核'
        case 3: //
          return '审批通过'
        case 4:
          return '审核驳回'
        default:
          return text
      }
    },
    onChange (row) {
      this.selectedRowKeys = row.selectedRowKeys
      this.selectedRows = row.selectedRows

      // console.log(this.$refs.table)
    },
    onSelectChange (selectedRowKeys) {
      // console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    //
    // resetSearchForm () {
    //   this.queryParam = {
    //     date: moment(new Date())
    //   }
    // },
    handleApprove (record) {
      // console.log('handleApprove(record):', record)
      this.modalHeading = '认证审批'
      this.isModalShow = true
      this.approveRecordForModal = record
    },
    handleApproveView (record) {
      // console.log('handleApprove(record):', record)
      this.modalHeading = '查看审批'
      this.isModalShow2 = true
      this.approveRecordForViewModal = record
    },
    modalCancel (e) {
      // console.log('modalCancel', e)
      this.isModalShow = false // 关闭浮层
      this.isModalShow2 = false // 关闭浮层
      // 清空表单信息
      this.$refs.approveForm.handleclose()
      this.approveRecordForModal = {}
    },
    modalRejectConfirm (record) {
      // console.log('modalRejectConfirm(record):', record)
      record.verifiedStatus = 4
      companyAudit(record).then(res => {
        console.log(res)
        if (res.code === 0) {
          this.$refs.table.refresh()
          this.$message.success(res.message)
          this.isModalShow = false
          this.getInfoMap()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    modalPassConfirm (record) {
      // console.log('modalPassConfirm(record):', record)
      record.verifiedStatus = 3
      companyAudit(record).then(res => {
        // console.log(res)
        if (res.code === 0) {
          this.$refs.table.refresh()
          this.$message.success(res.message)
          this.isModalShow = false
          this.getInfoMap()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    getInfoMap () {
      return getInfo().then(res => {
        const userinfo = res.data
        EmployerAuthBus.$emit('userinfoForCenter', userinfo)
        EmployerAuthBus.$emit('userinfoForSetting', userinfo)
      })
    }
  }
}
</script>

<style lang="less">
.content-layout {
  background: rgba(240, 242, 245, 1);
  .ant-card-body {
    padding: 0;
  }
  .table-page-search-wrapper {
    margin-bottom: 10px;
    padding: 20px 10px 0;
    background: #fff;

    .table-page-search-wrapper .table-page-search-submitButtons {
      margin: 0;
    }
  }

  .ant-table-wrapper {
    background: #fff;
  }
}
</style>
