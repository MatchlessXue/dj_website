<template>
  <div class="page-container">
    <a-card :bordered="false" class="card-container tabbar-container">
      <top-nav :items='tabItems2'></top-nav>
    </a-card>
    <a-card :bordered="false" class = "card-container" @keyup.enter="$refs.table.refresh()">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :md="5" :sm="24">
              <a-form-item label="司机姓名">
                <a-input v-model="queryParam.driverName" placeholder="请输入司机姓名" @keyup.enter="$refs.table.refresh()"/>
              </a-form-item>
            </a-col>
            <a-col :md="5" :sm="24">
              <a-form-item label="司机手机号">
                <a-auto-complete :dataSource="Smobile" v-model="queryParam.mobile"
                 placeholder="请输入司机姓名" :filterOption="filterOption" :allowClear="true"/>
                <!-- <a-input v-model="queryParam.mobile" placeholder="请输入司机姓名"/> -->
              </a-form-item>
            </a-col>
            <a-col :md="5" :sm="24">
              <a-form-item label="司机归属">
                <a-select allowClear placeholder="请选择司机归属" v-model="queryParam.ascription">
                  <a-select-option v-for="value in truckAffiliationsMap" :key="value.dictId">{{value.dictName}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="5" :sm="24">
              <a-form-item label="驾驶证号">
                <a-auto-complete :dataSource="SdriverLicense" v-model="queryParam.driverLicense"
                 placeholder="请输入驾驶证号" :filterOption="filterOption" :allowClear="true"/>
                <!-- <a-input v-model="queryParam.driverLicense" placeholder="请输入驾驶证号"/> -->
              </a-form-item>
            </a-col>
            <a-col :md="4" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" @click="$refs.table.refresh()">查询</a-button>&nbsp;&nbsp;
                <a-button @click="handleReset">重置</a-button>
              </span>
            </a-col>
             <a-col :md="5" :sm="24">
              <a-form-item label="准驾车型 ">
                <a-select allowClear placeholder="请选择车型" v-model="queryParam.driverRank">
                  <a-select-option v-for="value in truckDryTypeMap" :key="value.dictId">{{value.dictName}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-card>
    <a-card :bordered="false" style="margin-top: 10px" class="card-container">
      <div class="table-page-option-wrapper">
        <a-row>
          <a-col :md="{span: 12}" :sm="12">
            <a-button type="primary" icon="plus" @click="handleAdd">新建司机</a-button>
          </a-col>
          <a-col style="text-align: right;" :md="{span: 12}" :sm="12">
            <a-button @click="importDriver">导入</a-button>
            <a-button style="margin-left:10px" @click="$refs.importHistoryRef.add(4, 1)">导入历史</a-button>
          </a-col>
        </a-row>
      </div>
      <s-table ref="table" bordered :scroll="{x:1000}" size="default" :columns="columns" :data="loadData" :showAlertInfo="false"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" @onSelect="onChange">
        <a slot="driverName" slot-scope="text, record" @click="handleDetail(record)">{{text}}</a>
        <span slot="bizStatus" slot-scope="text, record">
          <a-badge :status="record.bizStatus === djConsts.ENABLE_STATUS_CONST.DISABLED ? 'default' : 'success'" />
          {{ djConsts.ENABLE_STATUS_CONST[record.bizStatus] }}
        </span>

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">修改</a>
          <a-divider type="vertical" />
          <confirm-info :title="record.bizStatus === statusEnable ? '确认停用这条记录么?' : '确认启用这条记录么?'"
                        :content="record.bizStatus === statusEnable ? '停用' : '启用'"
                        @onconfirm="handleStatus(record)" />
          <a-divider type="vertical" v-if="record.bizStatus === 101"/>

          <confirm-info v-if="record.bizStatus === 101" title="确认删除这条记录么"
                        content="删除"
                        @onconfirm="handleDriverDelete(record)" />
          <!-- <a @click="handleStatus(record)">
            {{ djConsts.ENABLE_STATUS_CONST.getToggleName(record.bizStatus) }}
          </a>
          <span v-if="record.bizStatus === 101 /*停用显示删除按钮*/">
            <a-divider type="vertical" />
            <a @click="handleDriverDelete(record)">删除</a>
          </span> -->
        </span>
      </s-table>

      <driver-form-modal :visible="isModalShow"
                        :isAdd="isAddForModal"
                        :driverRecord="driverRecordForModal"
                        :heading="modalHeading"
                        ref="driverForm"
                        @onCancel="modalCancel($event)"
                        @onOkForAdd="modalAddConfirm($event)"
                        @onOkForEdit="modalEditConfirm($event)"></driver-form-modal>

      <driver-detail-modal :visible="isDetailModalShow"
                          :driverRecord="driverRecordForDetailModal"
                           heading="司机详情"
                          @onCancel="detailModalCancel($event)"></driver-detail-modal>

      <import-template ref="importDriverRef" :templateType="4" :templateSubType="1" @success="importDriverSuccess" title="导入司机车辆信息">
      </import-template>
      <import-history ref="importHistoryRef"></import-history>
    </a-card>
  </div>
</template>

<script>
import STable from '@/components/table'
import ImportExport from '@/components/ImportExport' // 导出
import ImportTemplate from '@/components/ImportTemplate/' // 导入
import ImportHistory from '@/views/resource/components/ImportHistory' // 导入历史

import AInput from 'ant-design-vue/es/input/Input'
import moment from 'moment'
import ConfirmInfo from '@/components/ConfirmInfo'

import { queryDrivers, setDriversStatus, deleteDriver, saveDrivers } from '@/api/resource/driver'
import { globalMap } from '@/api/global'
// import { getAllStatusFilter } from '@/api/global'
import librariesBase from '@views/mixins/libraries_base'
import DriverFormModal from '@/views/resource/driver/DriverFormModal'
import DriverDetailModal from '@/views/resource/driver/DriverDetailModal'

import TopNav from '@/components/tabs/'
import base from '@/views/resource/mixins/base'
export default {
  name: 'driverList',
  mixins: [ librariesBase, base ],
  components: {
    DriverFormModal,
    AInput,
    STable,
    ImportExport,
    ImportTemplate,
    ImportHistory,
    DriverDetailModal,
    ConfirmInfo,
    TopNav
  },
  data () {
    return {
      visible: false,
      form: null,
      mdl: {},
      statusEnable: globalMap.statusEnable, // 启用状态

      // 高级搜索 展开/关闭
      advanced: false,
      isModalShow: false,
      modalHeading: '',
      isAddForModal: true,
      isDetailModalShow: false,
      driverRecordForModal: {},
      driverRecordForDetailModal: {},
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '司机名称',
          dataIndex: 'driverName',
          scopedSlots: { customRender: 'driverName' }
        },
        {
          title: '司机手机号',
          dataIndex: 'mobile'
        },
        {
          title: '司机归属',
          dataIndex: 'ascriptionName'
        },
        {
          title: '驾驶证号',
          dataIndex: 'driverLicense'
        },
        {
          title: '准驾车型',
          dataIndex: 'driverRankName'
        },
        {
          title: '状态',
          dataIndex: 'bizStatus',
          // needTotal: true,
          // filterMultiple: false,
          // filters: getAllStatusFilter(),
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
        this.Smobile = []
        this.SdriverLicense = []
        const _this = this
        return queryDrivers(Object.assign(parameter, this.queryParam)).then(
          res => {
            // console.log('res data==', res)
            res.data.records.forEach(function (item, i) {
              if (item.mobile !== '' && item.mobile !== null) {
                _this.Smobile.push(item.mobile)
              }
              if (item.driverLicense !== '' && item.driverLicense !== null) {
                _this.SdriverLicense.push(item.driverLicense)
              }
            })
            this.Smobile = this.unique(this.Smobile)
            this.SdriverLicense = this.unique(this.SdriverLicense)
            return res.data
          }
        )
      },
      Smobile: [], // 手机号模糊查询
      SdriverLicense: [], // 手机号模糊查询
      selectedRowKeys: [],
      selectedRows: [],
      siteType: 1
    }
  },
  created () {
    this.getTruckDryTypeMap() // 准驾车型
    this.getTruckAffiliationsMap() // 车辆归属
    // getRoleList({ t: new Date() })
  },
  methods: {
    go (key = 0) {
      const urls = [
        'truck' // 新建发货方
      ]
      this.$router.push({
        name: urls[key]
      })
    },
    // 导入司机车辆相关
    importDriver () {
      if (this.$refs.importDriverRef) this.$refs.importDriverRef.showModal()
    },
    importDriverSuccess (res) {
      console.log('导入成功')
      console.log('importTempSuccess (res)', res)
      this.$refs.table.refresh()
    },
    unique (arr) {
      return Array.from(new Set(arr))
    },
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toUpperCase().indexOf(input.toUpperCase()) >= 0
    },
    handleReset () {
      this.queryParam = {}
    },
    // 查看详情
    handleDetail (record) {
      this.$router.push({ name: 'driverDetail', params: { id: record.driverId } })
      // this.isDetailModalShow = true
      // this.driverRecordForDetailModal = record
    },
    // 启用 停用
    handleStatus (record) {
      // console.log('handleStatus.record.', record)
      setDriversStatus({ driverId: record.driverId }).then(res => {
        if (res.code === 0) {
          this.$message.success('操作成功')
          this.$refs.table.refresh()
        } else {
          this.$message.error('操作失败')
        }
      })
    },
    onChange (row) {
      this.selectedRowKeys = row.selectedRowKeys
      this.selectedRows = row.selectedRows
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
        page: 1,
        pageSize: 10,
        date: moment(new Date())
      }
    },
    handleDriverDelete (record) {
      deleteDriver({ driverId: record.driverId }).then(res => {
        // console.log('handleDriverDelete>res', res)
        if (res.code === 0) {
          this.$message.success('操作成功')
          this.$refs.table.refresh()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    handleAdd () {
      this.$router.push({ name: 'driverAddForm' })
      // this.modalHeading = '新建司机'
      // this.isAddForModal = true
      // this.isModalShow = true
    },
    handleEdit (record) {
      // console.log('record', record)
      this.$router.push({
        name: 'driverUpdateForm',
        params: { id: record.driverId }
      })
      this.mdl = Object.assign({}, record)
      console.log(this.mdl)
      this.visible = true
      // console.log('handleEdit(record):', record)
      // this.modalHeading = '修改司机'
      // this.isAddForModal = false
      // this.isModalShow = true
      // this.driverRecordForModal = record
    },
    // handleDelete (record) {
    //   console.log('handleDelete(record):', record)
    //   deleteDriverById({ id: record.driverId }).then(res => {
    //     console.log(res)
    //     if (res.code === 0) {
    //       this.$refs.table.refresh()
    //       this.$message.success(res.message)
    //     } else {
    //       this.$message.error(res.message)
    //     }
    //   })
    // },
    modalCancel (e) {
      console.log('modalCancel', e)
      this.isModalShow = false // 关闭浮层
      // 清空表单信息
      this.$refs.driverForm.handleclose()
      this.driverRecordForModal = {}
    },
    detailModalCancel (e) {
      // console.log('detailModalCancel', e)
      this.isDetailModalShow = false
    },
    modalAddConfirm (record) {
      // console.log('modalAddConfirm(record):', record)
      saveDrivers(record).then(
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
    modalEditConfirm (record) {
      // console.log('modalEditConfirm', record)
      saveDrivers(record).then(
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
    }
  },
  watch: {}
}
</script>

<style lang="less" scoped>

</style>
