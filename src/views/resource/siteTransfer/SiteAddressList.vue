<template>
  <div class="page-container">
    <a-card :bordered="false" class = "card-container"  @keyup.enter="$refs.table.refresh()">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :md="8" :sm="24">
              <a-form-item label="中转站名称">
                <a-input v-model="queryParam.siteName" placeholder="请输入中转站名称"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="中转站地址">
                <a-input v-model="queryParam.address" placeholder="请输入中转站地址"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
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
          <a-col :sm="12">
           <a-button type="primary" icon="plus" @click="handleAdd">新建中转站</a-button>
          </a-col>
          <a-col style="text-align: right;" :sm="12">
            <import-export />
          </a-col>
        </a-row>
      </div>
      <s-table ref="table" :rowKey="record => record.siteId" size="default" :columns="columns" :data="loadData"
               bordered :scroll="{x: 1500}"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}" @onSelect="onChange" >
        <a slot="siteName" slot-scope="text, record" @click="handleDetail(record)" >{{text}}</a>
        <span slot="siteType" slot-scope="text, record" >{{record.siteTypeName}}</span>
        <span slot="action" slot-scope="text, record" >
          <a @click="handleEdit(record)">修改</a>
          <a-divider type="vertical" />
          <confirm-info title="确认删除这条记录么" content="删除" @onconfirm="handleDelete(record)"/>
        </span>
      </s-table>
      <site-address-form :isShow="addModalvisible" :info="siteAddressForm" :regionsList="regionsMap" :customAreaMap="customAreaMap" @hideForm="hideForm" />
      <site-address-detail :isShow="detailModalvisible" :detail="siteAddressForm" @hideDetail="hideDetail"/>
    </a-card>
  </div>
</template>

<script>
import STable from '@/components/table/'
import ImportExport from '@/components/ImportExport'
import AInput from 'ant-design-vue/es/input/Input'
import moment from 'moment'
import ConfirmInfo from '@/components/ConfirmInfo'
import SiteAddressForm from './SiteAddressForm'
import SiteAddressDetail from './SiteAddressDetail'

// import { throttle, trim } from 'lodash'
import { selectByPage, deleteSiteAddress, getStatus } from '@/api/resource/siteAddress'
import librariesBase from '@views/mixins/libraries_base'
import { globalMap } from '@/api/global'
// import { getPartnersWithLike } from '@/api/resource/partner'
import { getRegionInfo } from '@/utils/util'
export default {
  name: 'SiteAddressList',
  mixins: [librariesBase],
  components: {
    AInput,
    STable,
    ImportExport,
    ConfirmInfo,
    SiteAddressForm,
    SiteAddressDetail
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
      nameDataSource: [],
      siteTypeList: [],
      statusEnable: globalMap.statusEnable, // 启用状态
      queryAdcode: [], // 中转站区域选项
      // 弹窗相关
      addModalvisible: false, // 是否显示新增框
      detailModalvisible: false, // 是否显示详情
      siteAddressForm: {},

      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        console.log(parameter, 'queryParam=', this.queryParam)
        const region = getRegionInfo(this.queryAdcode)
        // parameter.siteType = 3
        return selectByPage(
          Object.assign(parameter, region, this.queryParam)
        ).then(res => {
          // console.log('res data==', res)
          return res.data
        })
      },
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  computed: {
    // scrollX () {
    //   return countCollumnsWidth(this.columns)
    // }
  },
  mounted () {
    this.getRegions() // 省市区
    this.getCustomAreaMap() // 自定义区域
    this.createCloumns()
  },
  methods: {
    handleReset () {
      this.queryParam = {}
    },
    createCloumns () {
      getStatus().then((res) => {
        for (var i in res.data) {
          this.siteTypeList.push({ text: res.data[i].dictName, value: String(res.data[i].dictId) })
        }
      })
      this.columns = [
        {
          title: '中转站名称',
          dataIndex: 'siteName',
          // width: 120,
          scopedSlots: { customRender: 'siteName' }
        },
        {
          title: '中转站区域',
          // width: 150,
          dataIndex: 'addressArea'
        },
        {
          title: '中转站类型',
          // width: 130,
          dataIndex: 'siteType',
          scopedSlots: { customRender: 'siteType' },
          filters: this.siteTypeList
          // onFilter: (value, record) => record.siteType === value
        },
        {
          title: '中转站地址',
          // width: 150,
          dataIndex: 'address'
        },
        {
          title: '联系人姓名',
          // width: 120,
          dataIndex: 'contact'
        },
        {
          title: '联系人手机号',
          // width: 120,
          dataIndex: 'mobile'
        },
        {
          title: '操作',
          key: 'operation',
          width: '200px',
          fixed: 'right',
          scopedSlots: { customRender: 'action' }
        }
      ]
    },
    // 查询客户级联列表
    // handleNameSearch: throttle(async function (v) {
    //   const key = trim(v)
    //   if (!key) {
    //     this.nameDataSource = []
    //   } else {
    //     const self = this
    //     await getPartnersWithLike({ name: key }).then(res => {
    //       console.log('res.data===', res.data)

    //       const datas = res.data || []
    //       let source = []
    //       datas.forEach(val => {
    //         // source.push({value: val.partnerId, text: val.partnerName})
    //         source.push(val.partnerName)
    //       })
    //       // source = [ '11', '22', '333' ]
    //       self.nameDataSource = source
    //     })
    //   }
    // }, 500),
    // 新增按钮事件
    handleAdd () {
      this.siteAddressForm = {}
      this.$nextTick(() => {
        this.addModalvisible = true
      })
    },
    // 修改
    handleEdit (record) {
      console.log('handleEdit (record', record)
      this.siteAddressForm = record
      this.addModalvisible = true
    },
    hideForm (isRefresh) {
      console.log('this.addModalvisible = false.....')
      this.addModalvisible = false
      if (isRefresh) {
        this.$refs.table.refresh()
      }
    },
    // 查看详情
    handleDetail (record) {
      this.siteAddressForm = record
      this.detailModalvisible = true
    },
    hideDetail () {
      this.detailModalvisible = false
    },
    // 删除
    handleDelete (record) {
      deleteSiteAddress({ siteId: record.siteId }).then(res => {
        if (res.code === 0) {
          this.$message.success('删除成功')
          this.$refs.table.refresh()
        } else {
          this.$message.error('删除失败')
        }
      })
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
  }
}
</script>

<style lang="less" scoped>

</style>
