<template>
  <div
    class='page-container'>
    <a-card
      :bordered='false'
      class='card-container tabbar-container'>
      <div
        class='table-page-search-wrapper'>
        <a-menu
          v-model='current'
          mode='horizontal'>
          <a-menu-item
            @click='processApproveList(1, true)'
            key='1'>
            <a-badge
              :count='currentToApproveTotal'>
              <span href='#' :class='tabClass(current, 1)'>待我审的</span>
            </a-badge>
          </a-menu-item>
          <a-menu-item
            @click='processApproveList(2)'
            key='2'>
            <a-badge
              :count='currentStartedByMeTotal'>
              <span href='#' :class='tabClass(current, 2)'>我发起的</span>
            </a-badge>
          </a-menu-item>
          <a-menu-item
            @click='processApproveList(3)'
            key='3'>
            <span href='#' :class='tabClass(current, 3)'>我已审的</span>
          </a-menu-item>
          <a-menu-item
            @click='processApproveList(4)'
            key='4'>
            <span href='#' :class='tabClass(current, 4)'>抄送我的</span>
          </a-menu-item>
        </a-menu>
      </div>
    </a-card>

    <a-card
      :bordered='false'
      class='card-container'
      style='margin-top:10px;'>

      <div
        class='table-page-search-wrapper'>

        <a-form
          layout='inline'>

          <a-row
            :gutter='24'>
            <a-col
              :md='5'
              :sm='24'>
              <a-form-item
                label='审批类型'>
                <a-select
                  showSearch
                  placeholder='请选择审批类型'
                  optionFilterProp='children'
                  :allowClear='true'
                  v-model='queryParam.approveTypeId'
                  :filterOption='filterOption'>
                  <a-select-option
                    v-for='aType in approveTypeList'
                    :key='aType.approveTypeId'>{{aType.approveTypeName}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <a-col
              :md='7'
              :sm='24'>
              <a-form-item
                label='发起时间：'>
                <a-range-picker
                  v-model='startDate'
                  @change='onChangeDate' />
              </a-form-item>
            </a-col>
            <a-col
              :md='5'
              :sm='24'>
              <a-form-item
                label='审批标题：'>
                <a-input
                  v-model='queryParam.approveTitle'
                  placeholder='请输入审批标题' />
              </a-form-item>
            </a-col>
            <a-col
              :md='7'
              :sm='24'
              class='operation'>
              <span style='margin-right:10px'>

                            <a-button
                              @click='processApproveList(0)'
                              type='primary'>查询</a-button>

                        </span>

              <span style='margin-right:10px;'>

                            <a-button
                              @click='resetQueryCondition'
                              type='default'>重置</a-button>

                        </span>

            </a-col>

          </a-row>

        </a-form>

      </div>

    </a-card>

    <a-card
      :bordered='false'
      style='margin-top:10px'
      class='card-container'>

      <s-table
        :rowSelection='{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}'
        :columns='columns'
        :data='loadData'
        size="default"
        ref='table'
        bordered
        :showAlertInfo='false'
        :rowKey='record => record.flowId'
        :scroll='{ x: 1500 }'>

        <template
          slot='operation'
          slot-scope='text, record'>

          <a href='javascript:;' v-show='Number(current[0]) === 1' @click='handleApproveClick(record)'>审批</a>

          <a href='javascript:;' v-show='Number(current[0]) !== 1' @click='handleApproveDetailClick(record)'>详情</a>
        </template>
        <span slot='approveStatus' slot-scope='text, record'>{{record.approveStatusName}}</span>
        <span slot='approveTitle' slot-scope='text, record'>
                <a-tooltip
                  v-if='isApproveTitleExtraLength(record)'>
                    <template
                      slot='title'>
                        {{ record.approveTitle }}
                    </template>
                    {{ approveTitleProcessed(record) }}
                </a-tooltip>
                <span v-else>{{ record.approveTitle }}</span>
        </span>
      </s-table>
    </a-card>
    <approve-drawer-common
      ref='approveDrawer'
      @onSuccess="$refs.table.refresh()"
      :businessType='Number(current[0])'></approve-drawer-common>
  </div>
</template>

<script>
import STable from '@/components/table'
import {
  countCollumnsWidth,
  beautySub
} from '@/utils/util'
import {
  mapGetters
} from 'vuex'
import moment from 'moment'
// import ImportExport from '@/components/ImportExport'
import ApproveDrawerCommon from './components/ApproveDrawerCommon'
import {
  approveBase
} from './mixins/approve_base'
import {
  approveListBase
} from './mixins/approve_list_base'
const columns = [
  {
    title: '审批标题',
    // width: 180,
    dataIndex: 'approveTitle',
    scopedSlots: {
      customRender: 'approveTitle'
    }
  },
  {
    title: '审批单号',
    // width: 100,
    dataIndex: 'approveCode'
  },
  {
    title: '审批类型',
    // width: 140,
    dataIndex: 'approveTypeName'
  },
  {
    title: '发起时间',
    // width: 140,
    dataIndex: 'approveTime'
  },
  {
    title: '审批状态',
    // width: 120,
    dataIndex: 'approveStatus',
    key: 'approveStatus',
    scopedSlots: {
      customRender: 'approveStatus'
    }
  },
  {
    title: '操作',
    width: 100,
    fixed: 'right',
    dataIndex: 'operation',
    scopedSlots: {
      customRender: 'operation'
    }
  }
]
const data = []
export default {
  name: 'ApproveList',
  mixins: [approveBase, approveListBase],
  components: {
    STable,
    ApproveDrawerCommon
    // ImportExport
  },
  data () {
    return {
      // 是否独立于后端开发

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
      currentToApproveTotal: 0,
      currentStartedByMeTotal: 0,
      // form: null,
      current: ['1'],
      // 高级搜索 展开/关闭
      advanced: false,
      startDate: undefined,
      // 查询参数
      queryParam: {},
      columns,
      data,
      loadData: parameter => {
        return this.getMyApproveList(parameter, Number(this.current[0]))
      },
      selectedColumns: [],
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  created () {
    this.selectedColumns = this.columns.slice(0)
    this.scrollX = countCollumnsWidth(columns)
    // this.processApproveList()
    this.queryApproveTypeList()
  },
  mounted () {
    this.init()
  },
  computed: {
    isApproveTitleExtraLength () {
      return (record) => {
        return this.approveTitleProcessed(record).indexOf('...') > -1
      }
    },
    approveTitleProcessed () {
      return (record) => {
        return this.beautySub(record.approveTitle, 10)
      }
    },
    tabClass () {
      return function (current, key) {
        return {
          'approve-tab-head': true,
          'active': Number(current[0]) === key
        }
      }
    },
    ...mapGetters(['tenantId'])
  },
  methods: {
    getMyApproveList (parameter, currentTabType) {
      this.queryParam.tabType = currentTabType
      return this.getApproveList(Object.assign(parameter, this.queryParam), this.isIndependent).then(res => {
        if (currentTabType === 1) {
          this.currentToApproveTotal = res.total
          this.notifyNumberToApproveUpdate(this.currentToApproveTotal)
        }
        currentTabType === 2 && (this.currentStartedByMeTotal = res.total)
        return res
      })
    },
    handleApproveClick (record) {
      this.$refs.approveDrawer.showDrawer(record)
    },
    handleApproveDetailClick (record) {
      this.$refs.approveDrawer.showDrawer(record)
    },
    beautySub,
    moment,
    init () {
      this.getMyApproveList({
        page: 1,
        pageSize: 50
      }, 2)
    },
    onSelectChange (selectedRowKeys) {
      this.selectedRows = []
      let _this = this
      this.selectedRowKeys = selectedRowKeys
      selectedRowKeys.forEach(function (item, i) {
        _this.selectedRows.push(_this.data[item].waybillId)
      })
      // console.log(this.selectedRows)
    },
    processApproveList (type, isCloseFilters) {
      if (isCloseFilters === true) {
        this.columns.forEach(v => {
          if (v.dataIndex === 'approveStatus') {
            v.filters = []
          }
        })
      } else {
        this.columns.forEach(v => {
          if (v.dataIndex === 'approveStatus') {
            v.filters = [{
              text: '审批中',
              value: '1'
            },
            {
              text: '审批驳回',
              value: '2'
            },
            {
              text: '审批通过',
              value: '3'
            }
            ]
            type === 3 && v.filters.shift(1)
          }
        })
      }
      if (type !== 0) {
        this.selectedRowKeys = []
        // this.resetQueryCondition()
      }
      switch (type) {
        case 1:
          // this.queryParam.approveStatus = ''
          this.current = ['1']
          break
        case 2:
          this.current = ['2']
          break
        case 3:
          this.current = ['3']
          break
        case 4:
          this.current = ['4']
          break
        default:
          // this.queryParam.approveStatus = ''
          break
      }
      this.$refs.table.refreshPaginationOptionsAndData()
    },
    resetQueryCondition () {
      this.queryParam = {}
      this.startDate = undefined
    },
    onChangeDate (dates, dateStrings) {
      this.queryParam.approveStartTimeStart = dateStrings[0]
      this.queryParam.approveStartTimeEnd = dateStrings[1]
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
</style>
