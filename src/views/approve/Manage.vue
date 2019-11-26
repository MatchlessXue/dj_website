<template>
  <div
    class="page-container">
    <a-card
      :bordered="false"
      class="card-container"
      style="margin-top:10px;">
      <div
        class="table-page-search-wrapper">
        <a-form
          layout="inline">
          <a-row
            :gutter="24">
            <a-col
              :md="5"
              :sm="24">
              <a-form-item
                label="审批类型">
                <a-select
                  showSearch
                  placeholder="请选择审批类型"
                  optionFilterProp="children"
                  :allowClear="true"
                  v-model="queryParam.approveTypeId"
                  :filterOption="filterOption">
                  <a-select-option
                    v-for="aType in approveTypeList"
                    :key="aType.approveTypeId">{{aType.approveTypeName}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col
              :md="7"
              :sm="24"
              class="operation">
              <span style="margin-right:10px">
                <a-button
                  @click="$refs.table.refresh()"
                  type="primary">查询</a-button>
              </span>
              <span style="margin-right:10px;">
                <a-button
                  @click="resetQueryCondition"
                  type="default">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-card>
    <a-card
      :bordered="false"
      style="margin-top:10px"
      class="card-container">
      <s-table
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        :columns="columns"
        :data="loadData"
        ref="table"
        bordered
        :showAlertInfo="false"
        :scroll="{ x: 1500 }">
        <template
          slot="operation"
          slot-scope="text, record">
          <span class="operationBtn" href="javascript:;" @click="handleSetApprovePersonClick(record)">设置审批人</span>
          <a-divider
            type="vertical" />
          <span class="operationBtn" href="javascript:;" @click="handleSetCopiedPersonClick(record)">设置抄送人</span>
        </template>
        <span slot="bizStatus" slot-scope="text,record">
           <a-switch checkedChildren="启用" unCheckedChildren="停用" @change="handleUpdateStatus(record, $event)"
                     :checked="text === djConsts.ENABLE_STATUS_CONST.ENABLED"/>
        </span>
      </s-table>
    </a-card>
    <add-person title="审批人设置"
     @okSubmit="handleSetApproverOkSubmit"
      ref="addApprovePerson"></add-person>
    <add-person title="抄送人设置"
     @okSubmit="handleSetCopiederOkSubmit"
      ref="addCopiedPerson"></add-person>
  </div>
</template>

<script>
import STable from '@/components/table'
import {
  countCollumnsWidth
} from '@/utils/util'
import {
  mapGetters
} from 'vuex'
import moment from 'moment'
import AddPerson from './components/AddPerson'
import { approveManageBase } from './mixins/approve_manage_base'
const columns = [
  {
    title: '审批名称',
    // width: 180,
    dataIndex: 'modelName'
  },
  {
    title: '审批类型',
    // width: 100,
    dataIndex: 'approveTypeName'
  },
  {
    title: '状态',
    // width: 140,
    dataIndex: 'bizStatus',
    scopedSlots: {
      customRender: 'bizStatus'
    }
  },
  {
    title: '审批人',
    // width: 140,
    dataIndex: 'approveUserName'
  },
  {
    title: '抄送人',
    // width: 120,
    dataIndex: 'ccUserName'
  },
  {
    title: '操作',
    fixed: 'right',
    width: '200px',
    dataIndex: 'operation',
    scopedSlots: {
      customRender: 'operation'
    }
  }
]
const data = []
export default {
  name: 'ApproveManage',
  mixins: [approveManageBase],
  components: {
    STable,
    AddPerson
  },
  data () {
    return {
      form: this.$form.createForm(this),
      labelCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 8
        }
      },
      wrapperCol: {
        xs: {
          span: 24
        },
        sm: {
          span: 10
        }
      },
      wrapperColimg: {
        span: 16
      },
      // 高级搜索 展开/关闭
      advanced: false,
      allPartnerList: [], // 客户名称列表
      // 查询参数
      queryParam: {},
      columns,
      data,
      loadData: parameter => {
        return this.getApproveSetupItemList(Object.assign(parameter, this.queryParam), this.isIndependent).then(res => {
          return res
        })
      },
      selectedColumns: [],
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  created () {
    this.selectedColumns = this.columns.slice(0)
    this.scrollX = countCollumnsWidth(columns)
    this.queryApproveTypeList()
  },
  mounted () {
    this.init()
  },
  computed: {
    ...mapGetters(['tenantId'])
  },
  methods: {
    handleUpdateStatus (record, checked) {
      console.log('handleUpdateStatus (record, checke', record, checked)
      const isNotValid = checked && !record.approveUserId
      if (!isNotValid) {
        this.toggleBizStatus({ modelId: record.modelId }, this.isIndependent).then(res => {
          this.$message.success('操作成功。')
          this.$refs.table.refresh()
        })
      } else {
        this.$message.error('该审批流程设置无效，无法启用，请确定是否已设置审批人!')
      }
    },
    handleSetApprovePersonClick (record) {
      this.$refs.addApprovePerson.showModal(record, 1)
    },
    handleSetCopiedPersonClick (record) {
      this.$refs.addCopiedPerson.showModal(record, 2)
    },
    handleSetApproverOkSubmit (record, value) {
      console.log('handleSetApproverOkSubmit (record, value', record, value)
      const currentPerson = value && JSON.parse(value)
      this.setOperator({
        modelId: record.modelId,
        userId: currentPerson && currentPerson.accountId,
        userName: currentPerson && currentPerson.accountName,
        type: 'ac',
        relateType: 1 // 审批人
      }, this.isIndependent).then(res => {
        this.$message.success('设置成功。')
        this.$refs.table.refresh()
      })
    },
    handleSetCopiederOkSubmit (record, value) {
      console.log('handleSetCopiederOkSubmit (record, value', record, value)
      const currentPerson = value && JSON.parse(value)
      this.setOperator({
        modelId: record.modelId,
        userId: currentPerson && currentPerson.accountId,
        userName: currentPerson && currentPerson.accountName,
        type: 'cc',
        relateType: 2 // 抄送人
      }, this.isIndependent).then(res => {
        this.$message.success('设置成功。')
        this.$refs.table.refresh()
      })
    },
    moment,
    init () {},
    onSelectChange (selectedRowKeys) {
      this.selectedRows = []
      let _this = this
      this.selectedRowKeys = selectedRowKeys
      selectedRowKeys.forEach(function (item, i) {
        _this.selectedRows.push(_this.data[item].waybillId)
      })
      // console.log(this.selectedRows)
    },
    resetQueryCondition () {
      this.queryParam = {}
    }
  }
}
</script>

<style lang="less" scoped>
.approve-tab-head {
  width: 64px;
  height: 24px;
  margin-right: 15px;
  color: rgba(89, 89, 89, 1);
  font-family: PingFangSC-Regular;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;

  &.active {
    color: rgba(24, 144, 255, 1);
    font-family: PingFangSC-Semibold;
    font-weight: 600;
  }
}

.operation {
  margin-top: 10px;
}

.ant-menu-item {
  margin-right: 20px;
  line-height: 40px;
}

.ant-menu-horizontal {
  .ant-menu-item-active {
    border-bottom: 2px solid transparent;
  }
}
.operationBtn {
  height: 22px;
  color: rgba(24,144,255,1);
  font-family: PingFangSC-Regular;
  font-size: 12px;
  font-weight: 400;
  line-height: 22px;
  cursor: pointer;
}
</style>
