<template>
  <div class="page-container">
    <a-card :bordered="false"
            @keyup.enter="handleQuery"
            class="card-container">
      <div class="table-page-search-wrapper">
        <a-form layout="inline"
                :form="form">
          <a-row :gutter="24">
            <a-col :md="6"
                   :sm="24">
              <a-form-item label="合同名称">
                <a-input v-decorator="['contractName']"
                         placeholder="请输入合同名称" />
              </a-form-item>
            </a-col>
            <a-col :md="6"
                   :sm="24">
              <a-form-item label="合同类型 ">
                <a-select placeholder="请选择合同类型"
                          :allowClear="true"
                          allowClear
                          @change="changePartnerType"
                          v-decorator="['contractType']">
                  <a-select-option v-for="value in ContractTypeData"
                                   :key="value.value">{{value.text}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6"
                   :sm="24">
              <a-form-item label="合作伙伴">
                <a-select placeholder="请选择合作伙伴"
                          showSearch
                          allowClear
                          :filterOption="filterOption"
                          :allowClear="true"
                          :disabled="comdisabled"
                          v-decorator="['partnerId']">
                  <a-select-option v-for="value in partnerDataMap"
                                   :key="value.partnerId">{{value.partnerName}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6"
                   :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" @click="handleQuery">查询</a-button>&nbsp;&nbsp;&nbsp;&nbsp;
                <a-button @click="handleReset">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-card>
    <a-card :bordered="false"
            style="margin-top: 10px"
            class="card-container">
      <div class="table-page-option-wrapper">
        <a-row>
          <a-col :sm="12">
            <a-button type="primary"
                      icon="plus"
                      @click="handleAdd()">新建合同</a-button>
          </a-col>
          <a-col style="text-align: right;"
                 :sm="12">
            <import-export />
          </a-col>
        </a-row>
      </div>
      <s-table ref="table" bordered
               size="default"
               :columns="columns"
               :data="loadData"
               :showAlertInfo="false"
               :rowKey="record => record.contractId"
               v-if="isready">
        <span slot="bizStatus" slot-scope="text,record">
           <a-switch checkedChildren="启用" unCheckedChildren="停用" @change="handleUpdateStatus(record, $event)"
                     :checked="text === djConsts.ENABLE_STATUS_CONST.ENABLED"/>
        </span>
        <a slot="contractName"
           slot-scope="text, record"
           @click="handleDetail(record)">{{text}}</a>
        <span
          slot="action"
          slot-scope="text, record"
        >
          <a @click="handleEdit(record)">修改</a>
          <span v-if="record.bizStatus === djConsts.ENABLE_STATUS_CONST.DISABLED /*停用显示删除按钮*/">
            <a-divider type="vertical" />
            <a @click="handleDel(record)">删除</a>
          </span>
        </span>
      </s-table>
    </a-card>
  </div>
</template>

<script>
// import { getBrandId } from '@/api/libraries'
import STable from '@/components/table'
import ImportExport from '@/components/ImportExport'
import AInput from 'ant-design-vue/es/input/Input'
import { getContractType } from '@/api/libraries'
// import ConfirmInfo from '@/components/ConfirmInfo'
import {
  querylist,
  updatestatus,
  contractdelete
} from '@/api/resource/contract'
import { getAllByPrivilege } from '@/api/resource/gps'
// import { globalMap } from '@/api/global'
import contractBase from '@views/resource/contract/mixins/contract_base'

export default {
  name: 'contractList',
  mixins: [contractBase],
  components: {
    AInput,
    STable,
    ImportExport
  },
  data () {
    return {
      partnerDataMap: [],
      ContractTypeData: [], // 合同类型
      contractApproveStatus: [], // 合同审批状态
      // 表头
      columns: [],
      isready: false,
      contractid: null,
      refuseContract: null,
      confirmLoading: false,
      pagination: {},
      viewdata: {}, // 查看
      statusEnable: this.djConsts.ENABLE_STATUS_CONST.ENABLED, // 启用状态
      comdisabled: true, // 合作公司下拉是否启用
      isShowAddModal: false, // 新增修改框是否展示
      isShowViewModal: false, // 查看框是否展示
      form: this.$form.createForm(this),
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      contractData: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return querylist(Object.assign(parameter, this.queryParam)).then(
          res => {
            return res.data
          }
        )
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  created () {
    // 获取合同类型
    this.getContractTypeMap()
    this.form.setFieldsValue(this.queryParam)
  },
  methods: {
    handleReset () {
      this.form.resetFields()
    },
    // 列表筛选列初始化
    createColumns () {
      this.columns = [
        {
          title: '合同名称',
          dataIndex: 'contractName',
          scopedSlots: { customRender: 'contractName' }
        },
        {
          title: '合同类型',
          dataIndex: 'contractTypeName'
        },
        {
          title: '合作伙伴',
          dataIndex: 'partnerName'
        },
        {
          title: '运输类型',
          dataIndex: 'transportTypeName'
        },
        {
          title: '项目',
          dataIndex: 'projectName'
        },
        {
          title: '状态',
          dataIndex: 'bizStatus',
          scopedSlots: { customRender: 'bizStatus' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '200px',
          fixed: 'right',
          scopedSlots: { customRender: 'action' }
        }
      ]
    },
    handleQuery () {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.queryParam = values
          console.log(this.queryParam)
          this.$refs.table.refresh()
        }
      })
    },
    // 切换类型
    changePartnerType (value) {
      console.log(value)
      if (value === '') {
        return
      }
      this.form.setFieldsValue({ partnerId: null })
      if (Number(value) === 1 || Number(value) === 2) {
        this.getAllByPrivilegeMap(value)
        this.comdisabled = false
      } else {
        this.partnerDataMap = []
        this.comdisabled = true
      }
    },
    // 新增按钮事件
    handleAdd () {
      this.$router.push({
        name: 'ContractDetail',
        params: { id: this.getBase64IdPack('', false, false, '') }
      })
    },
    // 编辑合同信息
    handleEdit (record) {
      console.log('handleEdit.record.', record)
      this.$router.push({
        name: 'ContractDetail',
        params: { id: this.getBase64IdPack(record.contractId, false, false, '') }
      })

      this.mdl = Object.assign({}, record)
      console.log(this.mdl)
    },
    // 查看详情
    handleDetail (record) {
      console.log('contractId', record.contractId)
      this.$router.push({
        name: 'ContractDetail',
        params: { id: this.getBase64IdPack(record.contractId, true, false, '') }
      })
    },
    // 删除
    handleDel (record) {
      contractdelete({ contractId: record.contractId }).then(res => {
        if (res.code === 0) {
          this.$message.success('操作成功')
          // 刷新列表
          this.$refs.table.refresh()
        } else {
          this.$message.error('操作失败')
        }
      })
    },
    // 操作修改状态
    handleUpdateStatus (record, contractStatus) {
      updatestatus({
        contractId: record.contractId,
        contractStatus: contractStatus
      }).then(res => {
        if (res.code === 0) {
          this.$message.success('操作成功')
          // 刷新列表
          this.$refs.table.refresh()
        } else {
          this.$message.error('操作失败')
        }
      })
    },
    /**
     * 获取合作伙伴-客户名称列表
     */
    getAllByPrivilegeMap (value) {
      console.log('getAllByPrivilegeMap', value)
      if (!value || value === '') {
        return []
      }
      return getAllByPrivilege({ partnerTypes: value }).then(res => {
        console.log('getAllByPrivilege', res)
        this.partnerDataMap = res.data
      })
    },
    /**
     * 获取合同类型
     */
    getContractTypeMap () {
      return getContractType().then(res => {
        var temp = []
        res.data.forEach(function (item, i) {
          temp.push({
            text: item.dictName + '',
            value: item.dictId + ''
          })
        })
        this.ContractTypeData = temp
        this.createColumns()
        this.isready = true
      })
    }
  },
  watch: {}
}
</script>

<style lang="less" scoped>
</style>
