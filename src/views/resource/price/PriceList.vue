<template>
  <div class="page-container">
    <a-card :bordered="false"
            class="card-container">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :md="7"
                   :sm="24">
              <a-form-item label="价格文件名称">
                <a-input v-model="queryParam.termName"
                         placeholder="请输入价格文件名称" />
              </a-form-item>
            </a-col>
            <a-col :md="7"
                   :sm="24">
              <a-form-item label="合同编码">
                <a-input v-model="queryParam.contractCode"
                         placeholder="请输入合同编码" />
              </a-form-item>
            </a-col>
            <a-col :md="7"
                   :sm="24">
              <a-form-item label="合作伙伴">
                <a-auto-complete :dataSource="nameDataSource"
                                 @search="handleNameSearch"
                                 v-model="queryParam.partnerId"
                                 placeholder="请输入客户名称" />
              </a-form-item>
            </a-col>
            <a-col :md="3"
                   :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button type="primary"
                          @click="$refs.table.refresh()">查询</a-button>
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
          <a-col :md="{span: 12}"
                 :sm="12">
            <a-button type="primary"
                      icon="plus"
                      @click="handleAdd">新建价格文件</a-button>
          </a-col>
          <a-col style="text-align: right;"
                 :md="{span: 12}"
                 :sm="12">
            <import-export />
          </a-col>
        </a-row>
      </div>
      <s-table v-if="transportTypeMap && priceTypesMap"
               ref="table"
               size="default"
               :columns="columns"
               :data="loadData"
               :showAlertInfo="false"
               :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
               @onSelect="onChange">
        <a slot="termName"
           slot-scope="text, record"
           @click="handleDetail(record)">{{text}}</a>

        <span slot="contractType"
              slot-scope="text, record">{{record.contractTypeName}}</span>

        <span slot="transportType"
              slot-scope="text, record">{{record.transportTypeName}}</span>

        <span slot="action"
              slot-scope="text, record">
          <a @click="handleEdit(record)">修改</a>
          <a-divider type="vertical" />

          <confirm-info title="确认删除这条记录么"
                        content="删除"
                        @onconfirm="handleDelete(record)" />
        </span>
      </s-table>

    </a-card>
  </div>
</template>

<script>
import STable from '@/components/table/'
import ImportExport from '@/components/ImportExport'
import moment from 'moment'
import ConfirmInfo from '@/components/ConfirmInfo'
import { throttle, trim } from 'lodash'

import { getPriceList, getPriceTypes, deletePrice } from '@/api/resource/price'
import { getPartnersWithLike } from '@/api/resource/partner'
import librariesBase from '@views/mixins/libraries_base'

export default {
  name: 'PriceList',
  mixins: [librariesBase],
  components: {
    STable,
    ImportExport,
    ConfirmInfo
  },
  data () {
    const { contractCode } = this.$route.params
    return {
      contractCode,
      visible: false,
      form: null,
      nameDataSource: null,
      priceTypesMap: [], // 价格类型

      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '价格文件名称',
          dataIndex: 'termName',
          scopedSlots: { customRender: 'termName' }
        },
        {
          title: '合同编号',
          dataIndex: 'contractCode'
        },
        {
          title: '合作伙伴',
          dataIndex: 'partnerName'
        },
        {
          title: '价格类型',
          dataIndex: 'contractType',
          needTotal: true,
          filterMultiple: false,
          filtered: true,
          filters: this.transportTypeMapFilter,
          scopedSlots: {
            customRender: 'contractType'
          }
        },
        {
          title: '运输类型',
          dataIndex: 'transportType',
          needTotal: true,
          filterMultiple: false,
          filtered: true,
          filters: this.priceTypesMap,
          scopedSlots: {
            customRender: 'transportType'
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
        // console.log(2)
        console.log(parameter, 'queryParam=', this.queryParam)
        return getPriceList(Object.assign(parameter, this.queryParam)).then(
          res => {
            console.log('res data==', res)
            return res.data
          }
        )
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  computed: {
    // 运输类型
    transportTypeMapFilter () {
      const list = this.transportTypeMap
      const arr = []
      list && list.forEach((val) => {
        arr.push({ text: val.dictName, value: val.dictId })
      })
      return arr
    }
  },
  created () {
    // console.log(1)
    // console.log('params', this.$route.params)
    if (this.$route.params && this.$route.params.contractCode) { this.queryParam.contractCode = this.$route.params.contractCode }
    // 方法在mixin中
    // this.getDensityTypeMap() // 重抛类型
    this.getTransportTypeMap() // 运输类型
    this.getPriceTypesFilter() // 价格类型
    // this.getRegions() // 省市区
  },
  methods: {
    // 查询客户级联列表
    handleNameSearch: throttle(async function (v) {
      const key = trim(v)
      if (!key) {
        this.nameDataSource = []
      } else {
        const self = this
        await getPartnersWithLike({ name: key }).then(res => {
          const datas = res.data || []
          let source = []
          datas.forEach(val => {
            source.push({ value: val.partnerId, text: val.partnerName })
            // source.push(val.partnerName)
          })
          // source = [ '11', '22', '333' ]
          self.nameDataSource = source
        })
      }
    }, 500),
    // 价格类型
    getPriceTypesFilter () {
      getPriceTypes().then((res) => {
        const list = res.data || []
        const arr = []
        list.forEach((val) => {
          arr.push({ text: val.name, value: val.code })
        })
        this.priceTypesMap = arr
      })
    },
    handleAdd () {
      this.$router.push({ name: 'priceAddForm' })
    },
    handleEdit (record) {
      console.log('record', record)
      this.$router.push({
        name: 'priceUpdateForm',
        params: { id: record.termId }
      })
      this.mdl = Object.assign({}, record)
      console.log(this.mdl)
      this.visible = true
    },
    // 删除
    handleDelete (record) {
      deletePrice({ id: record.termId }).then(res => {
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
      this.$router.push({ name: 'priceDetail', params: { id: record.termId } })
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
    }
  }
}
</script>

<style lang="less" scoped>
</style>
