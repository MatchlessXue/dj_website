<template>
  <div class="page-container">
    <a-card :bordered="false" class="card-container">
      <div class="table-page-search-wrapper">
        <a-form  layout="inline">
          <a-row :gutter="24">
            <a-col :md="6" :sm="24">
              <a-form-item label="费用名称：">
                <a-auto-complete :dataSource="SfeeName" v-model="queryParam.expenseName"
                 placeholder="请输入费用名称" :filterOption="filterOption" :allowClear="true"/>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" @click="handleQuery">查询</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-card>
    <a-card :bordered="false" style="margin-top: 10px" class="card-container">
      <div class="table-page-option-wrapper">
        <a-row>
          <a-col :md="{span: 12}" :sm="12">
            <a-button type="primary" @click="handleAdd">新增费用</a-button>
          </a-col>
          <a-col style="text-align: right;" :md="{span: 12}" :sm="12">
            <import-export/>
          </a-col>
        </a-row>
      </div>
      <s-table ref="table" size="default" :columns="columns" :data="loadData" :showAlertInfo="false" rowKey="expenseId">
        <span slot="action" slot-scope="text,record">
          <span v-if="record.enableRename === 1"> <a @click="handleEdit(record)">修改</a> </span>
        </span>
      </s-table>
    </a-card>
    <fee-form-modal :visible="isModalShow" :isAdd="isAddForModal" :feeRecord="feeRecordForModal" :heading="modalHeading" ref="feeForm"
                    @onCancel="modalCancel($event)" @onOkForAdd="modalAddConfirm($event)"  @onOkForEdit="modalEditConfirm($event)">
    </fee-form-modal>
  </div>
</template>

<script>
import STable from '@/components/table/'
import ImportExport from '@/components/ImportExport'
import { selectByPage, saveFee, updateFee, feeList } from '@/api/admin/feeManagement/index'
import FeeFormModal from '@/views/admin/feeManagement/FeeFormModal'
import feeBase from '@/views/admin/feeManagement/mixins/fee_base'

export default {
  name: 'FeeList',
  mixins: [feeBase],
  components: {
    STable,
    ImportExport,
    FeeFormModal
  },
  data () {
    return {
      visible: false,
      labelCol: { span: 5 },
      isSubmitForAdd: false,
      isSubmitForEdit: false,
      wrapperCol: { span: 8 },
      mdl: {},
      // 高级搜索 展开/关闭
      advanced: false,
      isFindDriverShow: false,
      currentDispatchId: '',
      isModalShow: false,
      modalHeading: '',
      isAddForModal: true,
      isDetailModalShow: false,
      feeRecordForModal: {},
      queryForm: this.$form.createForm(this),
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '费用名称',
          width: '50%',
          dataIndex: 'expenseSysName'
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      pagination: {},
      SfeeName: [],
      // 加载数据方法 必须为 Promise 对象
      loadData: params => {
        return selectByPage(Object.assign(params, this.queryParam)).then(res => {
          return res.data || []
        })
      }
    }
  },
  created () {
    feeList().then(res => {
      // console.log('res data==', res)
      const _this = this
      res.data.forEach(function (item, i) {
        if (item.expenseSysName !== '' && item.expenseSysName !== null) {
          _this.SfeeName.push(item.expenseSysName)
        }
      })
      _this.SfeeName = this.unique(this.SfeeName)
    })
  },
  methods: {
    unique (arr) {
      return Array.from(new Set(arr))
    },
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toUpperCase().indexOf(input.toUpperCase()) >= 0
    },
    getIndex (index) {
      return ((this.$refs.table.localPagination.current - 1) * this.$refs.table.localPagination.pageSize) + (index + 1)
    },
    handleAdd () {
      this.modalHeading = '新增费用'
      this.isAddForModal = true
      this.isModalShow = true
    },
    handleEdit (record) {
      // console.log('handleEdit(record):', record)
      this.modalHeading = '修改费用'
      this.isAddForModal = false
      this.isModalShow = true
      this.feeRecordForModal = record
    },
    // 提交
    handleQuery () {
      this.$refs.table.refresh()
    },
    modalCancel (e) {
      console.log('modalCancel', e)
      this.isModalShow = false // 关闭浮层
      // 清空表单信息
      this.$refs.feeForm.handleclose()
      this.feeRecordForModal = {}
    },
    modalAddConfirm (record) {
      if (this.isSubmitForAdd) return
      // console.log('新添费用', record)
      this.isSubmitForAdd = true
      saveFee(record).then(
        res => {
          console.log(res)
          if (res.code === 0) {
            this.$refs.feeForm.handleclose()
            this.feeRecordForModal = {}
            this.$refs.table.refresh()
            this.$message.success(res.message)
            this.isModalShow = false
          } else {
            this.$message.error(res.message)
          }
        }
      ).finally(() => {
        this.isSubmitForAdd = false
      })
    },
    modalEditConfirm (record) {
      if (this.isSubmitForEdit) return
      // console.log('修改费用', record)
      this.isSubmitForEdit = true
      updateFee(record).then(
        res => {
          // console.log(res)
          if (res.code === 0) {
            this.$refs.feeForm.handleclose()
            this.$refs.table.refresh()
            this.$message.success(res.message)
            this.isModalShow = false
          } else {
            this.$message.error(res.message)
          }
        }
      ).finally(() => {
        this.isSubmitForEdit = false
      })
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    }
  }
}
</script>

<style lang="less" scoped>
</style>
