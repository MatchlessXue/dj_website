<template>
  <div class="page-container">
    <div style="background:#fff" :bordered="false" class="card-container tabbar-container">
      <top-nav :items='tabItems'></top-nav>
    </div>
    <a-card :bordered="false" @keyup.enter="$refs.table.refresh()" class="card-container">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :md="6" :sm="24">
              <a-form-item :label="'项目名称'">
                <a-input v-model="queryParam.projectName" :placeholder="`请输入项目名称`"/>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item :label="'客户名称'">
                <a-input v-model="queryParam.partnerName" :placeholder="`请输入客户名称`"/>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" @click="$refs.table.refresh()">查询</a-button>&nbsp;&nbsp;&nbsp;&nbsp;
                <a-button @click="handleReset">重置</a-button>
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
            <a-button type="primary" icon="plus" @click="handleAdd">新建项目</a-button>
          </a-col>
        </a-row>
      </div>
      <s-table ref="table" bordered :scroll="{x:1000}" size="default" :columns="columns" :data="loadData" :showAlertInfo="false"
               :rowKey="record => record.projectId" :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
               @change="handleChange" @onSelect="onChange">

        <span slot="bizStatus" slot-scope="text, record">
          <a-badge :status="record.bizStatus === djConsts.ENABLE_STATUS_CONST.DISABLED ? 'default' : 'success'"/>
          {{ djConsts.ENABLE_STATUS_CONST[text] }}
        </span>
        <span slot="accountListName" slot-scope="text, record">
          <span v-if="record.accountListName">{{text}}</span>
          <span v-else>全部</span>
        </span>
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">修改</a>
          <a-divider type="vertical"/>

          <a @click="handleStatus(record)">
            {{ djConsts.ENABLE_STATUS_CONST.getToggleName(record.bizStatus) }}</a>
          <a-divider type="vertical"/>
          <a @click="$refs.congifModal.edit(record)">配置人员</a>
          <a-divider type="vertical"/>
          <a @click="openLinkbatching(record)">设置合并计费规则</a>
        </span>
      </s-table>
      <project-form :visible="isModalShow"
                    :isAdd="isAddForModal"
                    :projectRecord="RecordForModal"
                    :heading="modalHeading"
                    ref="prjectForm"
                    @onCancel="modalCancel($event)"
                    @onOkForAdd="modalAddConfirm($event)"
                    @onOkForEdit="modalEditConfirm($event)"></project-form>
      <config-model ref="congifModal" @ok="handleOk"></config-model>
    </a-card>
  </div>

</template>

<script>
import STable from '@/components/table'

// import { getPartnerList, setPartnerStatus } from '@/api/resource/partner'
import { getListByTenantId, ProjectSave, setStatus } from '@api/resource/project'
import { globalMap, getAllStatusFilter } from '@/api/global'
import ProjectForm from '@/views/resource/project/ProjectForm'
import ConfigModel from '@/views/resource/project/components/ConfigModel'
import TopNav from '@/components/tabs/'
import base from '@/views/resource/mixins/base'
import { mapGetters } from 'vuex'

export default {
  name: 'ProjectList',
  mixins: [ base ],
  components: {
    STable,
    TopNav,
    ProjectForm,
    ConfigModel
  },
  data () {
    return {
      isModalShow: false,
      modalHeading: '',
      isAddForModal: true,
      RecordForModal: {},
      statusEnable: globalMap.statusEnable, // 启用状态
      visible: false,
      pagination: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      },
      form: null,
      mdl: {},
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '项目名称',
          dataIndex: 'projectName'
        },
        {
          title: '客户名称',
          dataIndex: 'partnerName'
        },
        {
          title: '人员',
          dataIndex: 'accountListName',
          scopedSlots: {
            customRender: 'accountListName'
          }
        },
        {
          title: '状态',
          dataIndex: 'bizStatus',
          needTotal: true,
          filterMultiple: false,
          filters: getAllStatusFilter(),
          scopedSlots: {
            customRender: 'bizStatus'
          }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '300px',
          fixed: 'right',
          scopedSlots: {
            customRender: 'action'
          }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getListByTenantId(
          Object.assign(parameter, this.queryParam)
        ).then(res => {
          console.log('res data==', res)
          return res.data
        })
      },

      selectedRowKeys: [],
      selectedRows: []
    }
  },
  computed: {
    ...mapGetters(['tenantId'])
  },
  created () {
    console.log('columns', this.columns)
  },
  methods: {
    handleReset () {
      this.queryParam = {}
    },
    handleOk () {
      // 配置人员成功时，重载列表
      this.$refs.table.refresh()
    },
    handleAdd () {
      console.log('新建')
      this.modalHeading = '新建项目'
      this.isAddForModal = true
      this.isModalShow = true
    },
    handleEdit (record) {
      this.modalHeading = '修改名称'
      this.isAddForModal = false
      this.isModalShow = true
      this.RecordForModal = record
    },
    modalCancel (e) {
      this.isModalShow = false // 关闭浮层
      // 清空表单信息
      this.$refs.prjectForm.handleclose()
      this.RecordForModal = {}
    },
    modalAddConfirm (record) {
      console.log('modalAddConfirm(record):', record)
      ProjectSave(record).then(
        res => {
          console.log(res)
          if (res.code === 0) {
            this.$refs.table.refresh()
            this.$message.success(res.message)
            this.$refs.prjectForm.handleclose()
            this.RecordForModal = {}
            this.isModalShow = false
          } else {
            this.$message.error(res.message)
          }
        }
      )
    },
    modalEditConfirm (record) {
      console.log('modalEditConfirm', record)
      ProjectSave(record).then(
        res => {
          console.log(res)
          if (res.code === 0) {
            this.$refs.table.refresh()
            this.$message.success(res.message)
            this.isModalShow = false
          } else {
            this.$message.error(res.message)
          }
        }
      )
    },
    // 启用 停用
    handleStatus (record) {
      console.log('handleStatus.record.', record)
      setStatus({ projectId: record.projectId }).then(res => {
        if (res.code === 0) {
          this.$message.success('操作成功')
          this.$refs.table.refresh()
        } else {
          this.$message.error('操作失败')
        }
      })
    },
    handleChange (pagination, filters, sorter) {
      console.log('Various parameters', pagination, filters, sorter)
      this.filteredInfo = filters
      this.sortedInfo = sorter
    },
    onChange (row) {
      this.selectedRowKeys = row.selectedRowKeys
      this.selectedRows = row.selectedRows
    },
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    resetSearchForm () {
      this.queryParam = {
        // date: moment(new Date())
      }
    },
    openLinkbatching (record) {
      location.href = '/resources/#/batching/batchingView/' + record.projectId
    }
  }
}
</script>

<style lang="less" scoped>
</style>
