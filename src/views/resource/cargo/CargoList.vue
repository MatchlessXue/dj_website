<template>
  <div class="page-container">
    <div style="background:#fff" :bordered="false" class="card-container tabbar-container">
      <top-nav :items='tabItems'></top-nav>
    </div>
    <a-card :bordered="false" @keyup.enter="handleQuery" class="card-container">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
              <a-row :gutter="24">
                <a-col :md="6" :sm="24">
                  <a-form-item label="客户名称：">
                    <a-select showSearch placeholder="请选择客户名称" optionFilterProp="children" @change="handleChange"
                              :allowClear="true" v-model="queryParam.partnerId" :filterOption="filterOption">
                      <a-select-option v-for="partner in allPartnerList" :key="partner.partnerId">{{partner.partnerName}}</a-select-option>
                    </a-select>
                  </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="货物名称：">
                <a-input v-model="queryParam.cargoName" placeholder="请输入货物名称" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="货物代码：">
                <a-input v-model="queryParam.cargoCode" placeholder="请输入货物代码" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" @click="handleQuery">查询</a-button>&nbsp;&nbsp;&nbsp;&nbsp;
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
            <a-button type="primary" icon="plus" @click="handleAdd">新建货物</a-button>
          </a-col>
          <a-col style="text-align: right;" :md="{span: 12}" :sm="12">
            <a-button @click="importCargo">导入</a-button>
            <a-button style="margin-left:10px" @click="$refs.importHistoryRef.add(5, 1)">导入历史</a-button>
          </a-col>
        </a-row>
      </div>
      <s-table ref="table" bordered
               size="default"
               :columns="columns"
               :data="loadData"
               :showAlertInfo="false"
               :scroll="{x: 1500}"
               :rowKey="record => record.cargoId"
               :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
               @onSelect="onChange">
        <template slot="partnerName" slot-scope="text, record">
          <span v-if="record.partnerStatusName === '停用'" style="color:#D1D1D1">{{text}}</span>
          <span v-else>{{text}}</span>
        </template>
        <a slot="cargoName"
           slot-scope="text, record"
           @click="handleDetail(record)">{{text}}</a>

        <span slot="action"
              slot-scope="text, record">
          <!-- <template v-if="$auth('table.update')">
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
        </template>-->
          <a @click="handleEdit(record)">修改</a>
          <a-divider type="vertical" />
          <Confirm-Info :title="'确认删除这条记录么'"
                        :content="'删除'"
                        @onconfirm="handleDelete(record)" />
        </span>
      </s-table>

      <cargo-form-modal :visible="isModalShow"
                        :isAdd="isAddForModal"
                        :cargoRecord="cargoRecordForModal"
                        :heading="modalHeading"
                        ref="cargoForm"
                        @onCancel="modalCancel($event)"
                        @onOkForAdd="modalAddConfirm($event)"
                        @onOkForEdit="modalEditConfirm($event)"
                        @onLengthChange="handleVolumeValueForAdd($event)"></cargo-form-modal>

      <cargo-detail-modal :visible="isDetailModalShow"
                          :cargoRecord="cargoRecordForDetailModal"
                          @onCancel="detailModalCancel($event)"></cargo-detail-modal>

      <import-template ref="importDriverRef" :templateType="5" :templateSubType="1" @success="importDriverSuccess" title="导入货物信息">
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
import ASelect from 'ant-design-vue/es/select/index'
import moment from 'moment'
import ConfirmInfo from '@/components/ListConfirm/ConfirmInfo'
import CargoFormModal from '@/views/resource/cargo/CargoFormModal'

import CargoDetailModal from '@/views/resource/cargo/CargoDetailModal'

import { queryCargos, deleteCargoById, saveCargo } from '@/api/resource/cargo'
import { getAllPartners } from '@/api/resource/partner'

import TopNav from '@/components/tabs/'
import base from '@/views/resource/mixins/base'

export default {
  name: 'CargoList',
  mixins: [base],
  components: {
    AInput,
    ASelect,
    // ATextarea,
    STable,
    ImportExport,
    ImportTemplate,
    ImportHistory,
    ConfirmInfo,
    CargoFormModal,
    CargoDetailModal,
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
      mdl: {},

      // 高级搜索 展开/关闭
      advanced: false,
      isModalShow: false,
      modalHeading: '',
      isAddForModal: true,
      isDetailModalShow: false,
      cargoRecordForModal: {},
      cargoRecordForDetailModal: {},
      allPartnerList: [], // 客户名称列表
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '客户名称',
          dataIndex: 'partnerName',
          scopedSlots: { customRender: 'partnerName' }
        },
        {
          title: '货物名称',
          dataIndex: 'cargoName',
          scopedSlots: { customRender: 'cargoName' }
        },
        {
          title: '货物代码',
          dataIndex: 'cargoCode',
          customRender:
            (text, record) => (
              <div class="colClass">{record.cargoCode}</div>
            )
        },
        {
          title: '货物规格',
          dataIndex: 'cargoSpecifications'
        },
        {
          title: '货物包装',
          dataIndex: 'packageTypeName'
        },
        {
          title: '单件重量',
          dataIndex: 'weightCustom'
        },
        {
          title: '单件体积',
          dataIndex: 'volumeCustom'
        },
        {
          title: '单件货值',
          dataIndex: 'worth'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '120px',
          fixed: 'right',
          scopedSlots: { customRender: 'action' }
        }
      ],
      pagination: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        console.log(parameter, 'queryParam=', this.queryParam)
        return queryCargos(Object.assign(parameter, this.queryParam)).then(
          res => {
            console.log('loadData———res data==', res)
            return res.data || []
          },
          error => {
            console.log('(error)=>{', error)
          }
        )
      },

      selectedRowKeys: [],
      selectedRows: []
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.getAllPartnerList()
    },
    // 导入货物相关
    importCargo () {
      if (this.$refs.importDriverRef) this.$refs.importDriverRef.showModal()
    },
    importDriverSuccess (res) {
      console.log('导入成功')
      console.log('importTempSuccess (res)', res)
      this.$refs.table.refresh()
    },
    handleReset () {
      this.queryParam = {}
    },
    // 提交
    handleQuery (e) {
      this.$refs.table.refresh()
    },
    handleAdd () {
      this.modalHeading = '新建货物'
      this.isAddForModal = true
      this.isModalShow = true
      this.cargoRecordForModal = {
        lengthCustom: 0,
        widthCustom: 0,
        heightCustom: 0,
        // weight:0,
        // volume:0,
        worth: 0
      }
    },
    handleEdit (record) {
      // console.log('handleEdit(record):', record)
      this.modalHeading = '修改货物'
      this.isAddForModal = false
      this.isModalShow = true
      let arr = ['packageType', 'cargoType']
      for (let i of arr) {
        if (record[i] === 0) { delete record[i] }
      }
      this.cargoRecordForModal = record
    },
    handleDelete (record) {
      console.log('handleDelete(record):', record)
      deleteCargoById({ id: record.cargoId }).then(res => {
        console.log(res)
        if (res.code === 0) {
          this.$refs.table.refresh()
          this.$message.success(res.message)
        } else {
          this.$message.error(res.message)
        }
      })
    },
    modalCancel (e) {
      console.log('modalCancel', e)
      this.isModalShow = false // 关闭浮层
      // 清空表单信息
      this.$refs.cargoForm.handleclose()
      this.cargoRecordForModal = {}
    },
    detailModalCancel (e) {
      console.log('detailModalCancel', e)
      this.isDetailModalShow = false
    },
    modalAddConfirm (record) {
      console.log('modalAddConfirm(record):', record)
      saveCargo(record).then(
        res => {
          console.log('success')
          console.log(res)
          if (res.code === 0) {
            this.$refs.table.refresh()
            this.$message.success(res.message)
            this.isModalShow = false
          } else {
            this.$message.error(res.message)
          }
        },
        error => {
          console.log('errr')
          // this.$message.error(error)
        }
      )
    },
    modalEditConfirm (record) {
      console.log('modalEditConfirm', record)
      saveCargo(record).then(
        res => {
          console.log(res)
          if (res.code === 0) {
            this.$refs.table.refresh()
            this.$message.success(res.message)
            this.isModalShow = false
          } else {
            this.$message.error(res.message)
          }
        },
        error => {
          this.$message.error(error)
        }
      )
    },
    onChange (row) {
      this.selectedRowKeys = row.selectedRowKeys
      this.selectedRows = row.selectedRows

      console.log(this.$refs.table)
    },
    onSelectChange (selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },

    resetSearchForm () {
      this.queryParam = {
        date: moment(new Date())
      }
    },
    // 客户名称选择框事件处理方法
    handleChange (value) {
      console.log(`selected ${value}`)
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },
    handleDetail (record) {
      this.isDetailModalShow = true
      this.cargoRecordForDetailModal = record
    },
    getAllPartnerList () {
      getAllPartners({ partnerTypes: 1 }).then(res => {
        this.allPartnerList = res.data
      })
    },
    toDecimal2 (val, len) {
      // val 值 len保留小数位数
      var f = parseFloat(val)
      if (isNaN(f)) {
        return false
      }
      f = Math.round(val * Math.pow(10, len)) / Math.pow(10, len)
      var s = f.toString()
      var rs = s.indexOf('.')
      if (rs < 0) {
        rs = s.length
        s += '.'
      }
      while (s.length <= rs + len) {
        s += '0'
      }
      return s
    },
    handleVolumeValueForAdd (record, newVal) {
      console.log('handleVolumeValueForAdd(record,newVal):', record, newVal)
      record.volumeCustom =
        record.lengthCustom * record.widthCustom * record.heightCustom
      record.volumeCustom = this.toDecimal2(record.volumeCustom, 4)
      console.log('record.volumeCustom：', record.volumeCustom)
      this.cargoRecordForModal = record
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
.colClass {
  overflow: hidden;
  max-width: 300px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
