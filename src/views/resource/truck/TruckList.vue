<template>
  <div class="page-container">
    <a-card :bordered="false" class="card-container tabbar-container">
      <top-nav :items='tabItems2'></top-nav>
    </a-card>
    <a-card :bordered="false" class="card-container"
            @keyup.enter="$refs.table.refresh()">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :md="5" :sm="24">
              <a-form-item label="车牌号码：">
                <a-input v-model="queryParam.plateNumber" placeholder="请输入车牌号码" />
              </a-form-item>
            </a-col>
            <a-col :md="5" :sm="24">
              <a-form-item label="车辆类型：">
                <select-tiled v-model="queryParam.truckType" :data="truckTypeMap" ref="truckTypeSelectTiled"
                              keyName="dictId" valName="dictName" placeholder="请选择车辆类型" />
              </a-form-item>
            </a-col>
            <a-col :md="5" :sm="24">
              <a-form-item label="车辆归属：">
                <a-select allowClear placeholder="请选择车辆归属" v-model="queryParam.ascription">
                  <a-select-option v-for="value in truckAffiliationsMap" :key="value.dictId">{{value.dictName}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="5" :sm="24">
              <a-form-item label="车长：">
                <select-tiled v-model="queryParam.truckLength" :data="truckLongsMap" ref="truckLengthSelectTiled"
                              keyName="dictId" valName="dictName" placeholder="请选择车长" />
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button type="primary"  @click="$refs.table.refresh()">查询</a-button>&nbsp;&nbsp;
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
          <a-col :md="{span: 12}"
                 :sm="12">
            <a-button type="primary" icon="plus" @click="handleAdd">新建车辆</a-button>
            <!-- <a-dropdown v-if="selectedRowKeys.length > 0">
            <a-menu slot="overlay">
              <a-menu-item key="1"><a-icon type="delete" />删除</a-menu-item>
              <a-menu-item key="2"><a-icon type="lock" />锁定</a-menu-item>
            </a-menu>
            <a-button style="margin-left: 8px">
              批量操作 <a-icon type="down" />
            </a-button>
          </a-dropdown> -->
          </a-col>
          <a-col style="text-align: right;" :md="{span: 12}" :sm="12">
            <a-button @click="importDriver">导入</a-button>
            <a-button style="margin-left:10px" @click="$refs.importHistoryRef.add(4, 1)">导入历史</a-button>
          </a-col>
          <a-col style="text-align: right;" :md="{span: 12}" :sm="12">
            <import-export />
          </a-col>
        </a-row>
      </div>
      <s-table ref="table" bordered
               size="default"
               :columns="columns"
               :data="loadData"
               :scroll="{x:1500}"
               :showAlertInfo="false"
               :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
               @onSelect="onChange">
        <a slot="plateNumber"
           slot-scope="text, record"
           @click="handleDetail(record)">{{text}}</a>

        <span slot="bizStatus"
           slot-scope="text, record"><a-badge :status="record.bizStatus === 101 ? 'default' : 'success'" />{{record
          .bizStatusName}}</span>
        <span slot="action"
              slot-scope="text, record">
          <!-- <template v-if="$auth('table.update')">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
        </template> -->

          <a @click="handleEdit(record)">修改</a>
          <a-divider type="vertical" />

          <confirm-info :title="record.bizStatus === statusEnable ? '确认停用这条记录么?' : '确认启用这条记录么?'"
                        :content="record.bizStatus === statusEnable ? '停用' : '启用'"
                        @onconfirm="handleStatus(record)" />
          <a-divider type="vertical" v-if="record.bizStatus === 101"/>

          <confirm-info v-if="record.bizStatus === 101" title="确认删除这条记录么"
                        content="删除"
                        @onconfirm="handleDelete(record)" />
        </span>
      </s-table>
      <import-template ref="importDriverRef" :templateType="4" :templateSubType="1" @success="importDriverSuccess" title="导入司机车辆信息">
      </import-template>
      <import-history ref="importHistoryRef"></import-history>
    </a-card>
  </div>
</template>

<script>
import STable from '@/components/table/'
import ImportExport from '@/components/ImportExport'
import ImportTemplate from '@/components/ImportTemplate/' // 导入
import ImportHistory from '@/views/resource/components/ImportHistory' // 导入历史
import AInput from 'ant-design-vue/es/input/Input'
import moment from 'moment'
import SelectTiled from '@/components/SelectTiled'
import ConfirmInfo from '@/components/ConfirmInfo'

import { queryTrucks, queryAllTrucks, setTruckStatus, deleteTruck } from '@/api/resource/truck'
import fileBase from '@views/mixins/file_base'
import librariesBase from '@views/mixins/libraries_base'
import { globalMap, getAllStatusFilter } from '@/api/global'

import TopNav from '@/components/tabs/'
import base from '@/views/resource/mixins/base'
export default {
  name: 'TruckList',
  mixins: [librariesBase, fileBase, base],
  components: {
    AInput,
    SelectTiled,
    STable,
    ImportExport,
    ImportTemplate,
    ImportHistory,
    ConfirmInfo,
    TopNav
  },
  data () {
    return {
      visible: false,
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
      statusEnable: globalMap.statusEnable, // 启用状态

      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '车牌号码',
          dataIndex: 'plateNumber',
          scopedSlots: { customRender: 'plateNumber' }
        },
        {
          title: '车辆类型',
          dataIndex: 'truckTypeName'
        },
        {
          title: '车辆归属',
          dataIndex: 'ascriptionName'
        },
        {
          title: '车长m',
          dataIndex: 'truckLengthName'
        },
        {
          title: '载重kg',
          dataIndex: 'weightLoad'
        },
        {
          title: '载方m³',
          dataIndex: 'volumeLoad'
        },
        {
          title: '车辆状态',
          dataIndex: 'bizStatus',
          needTotal: true,
          filterMultiple: false,
          filtered: true,
          sorter: true,
          filters: getAllStatusFilter(),
          scopedSlots: {
            customRender: 'bizStatus'
          }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '200px',
          fixed: 'right',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        // console.log(parameter, 'queryParam=', this.queryParam)
        return queryTrucks(Object.assign(parameter, this.queryParam)).then(
          res => {
            // console.log('分页车辆==', res)
            return res.data
          }
        )
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  created () {
    // 方法在mixin中
    this.getTruckAffiliationsMap() // 车辆归属
    this.getTruckTypeByDataStatusMap() // 车辆类型列表
    this.getTruckLongsMap() // 车长列表
  },
  methods: {
    // 导入司机车辆相关
    importDriver () {
      if (this.$refs.importDriverRef) this.$refs.importDriverRef.showModal()
    },
    importDriverSuccess (res) {
      console.log('导入成功')
      console.log('importTempSuccess (res)', res)
      this.$refs.table.refresh()
    },
    handleAdd () {
      this.$router.push({ name: 'truckAddForm' })
    },
    handleReset () {
      this.queryParam = {}
      this.$refs.truckTypeSelectTiled.handleClick('0', undefined)
      this.$refs.truckLengthSelectTiled.handleClick('0', undefined)
    },
    handleEdit (record) {
      // console.log('record', record)
      this.$router.push({
        name: 'truckUpdateForm',
        params: { id: record.truckId }
      })
      this.mdl = Object.assign({}, record)
      // console.log(this.mdl)
      this.visible = true
    },
    handleOk () { },
    // 启用 停用
    handleStatus (record) {
      // console.log('handleStatus.record.', record)
      setTruckStatus({ truckId: record.truckId }).then(res => {
        const handle = record.bizStatus === this.statusEnable ? '停用' : '启用'
        if (res.code === 0) {
          this.$message.success(`${handle}成功`)
          this.$refs.table.refresh()
        } else {
          this.$message.error(`${handle}失败`)
        }
      })
    },
    // 删除
    handleDelete (record) {
      deleteTruck({ truckId: record.truckId }).then(res => {
        if (res.code === 0) {
          this.$message.success('删除成功')
          this.$refs.table.refresh()
        } else {
          this.$message.error('删除失败')
        }
      })
    },
    // 查看详情
    handleDetail (record) {
      this.$router.push({ name: 'truckDetail', params: { id: record.truckId } })
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
    resetSearchForm () {
      this.queryParam = {
        date: moment(new Date())
      }
    }
  },
  watch: {
    /*
      'selectedRows': function (selectedRows) {
        this.needTotalList = this.needTotalList.map(item => {
          return {
            ...item,
            total: selectedRows.reduce( (sum, val) => {
              return sum + val[item.dataIndex]
            }, 0)
          }
        })
      }
      */
  }
}
</script>

<style lang="less" scoped>
</style>
