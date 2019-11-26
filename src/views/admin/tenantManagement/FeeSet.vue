<template>
  <div class="form-layout-body">
    <back-btn title="返回上一级"/>
    <a-card :bordered="false" class="card-container">
      <h2 style="font-weight:bold;font-size:16px">费用自定义</h2>
      <div class="table-page-search-wrapper">
        <a-menu v-model="current" mode="horizontal">
          <a-menu-item @click="getList(1)" key="project">项目</a-menu-item>
          <a-menu-item @click="getList(2)" key="carrier">承运商</a-menu-item>
          <a-menu-item @click="getList(3)" key="driver">司机</a-menu-item>
        </a-menu>
      </div>
      <div class="table-page-search-wrapper" style="margin:10px 0">
        <a-form  layout="inline" v-if="show === 1">
          <a-row :gutter="24">
            <a-col :md="6" :sm="24">
              <a-form-item label="客户：">
                <a-auto-complete :dataSource="SpartnerName" v-model="queryParam.partnerName"
                 placeholder="请输入客户名称" :filterOption="filterOption" :allowClear="true"/>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="项目：">
                <a-auto-complete :dataSource="SprojectName" v-model="queryParam.projectName"
                 placeholder="请输入项目名称" :filterOption="filterOption" :allowClear="true"/>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" @click="handleQuery">查询</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
        <a-form  layout="inline" v-if="show === 2">
          <a-row :gutter="24">
            <a-col :md="6" :sm="24">
              <a-form-item label="承运商：">
                <a-auto-complete :dataSource="SpartnerName" v-model="queryParam.partnerName"
                 placeholder="请输入承运商名称" :filterOption="filterOption" :allowClear="true"/>
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
      <s-table ref="table" size="default" :columns="columns" :data="loadData" :showAlertInfo="false" rowKey="subDictId">
        <span slot="action" slot-scope="text,record">
          <span>
            <a @click="handleEdit(record)">费用设置</a>
          </span>
        </span>
      </s-table>
    </a-card>
    <fee-set-modal ref="feeSet" @hideForm="$refs.table.refresh()"></fee-set-modal>
  </div>
</template>

<script>
import BackBtn from '@/components/BackBtn'
import STable from '@/components/table/'
import { feepartnerList } from '@/api/admin/tenantManagement/index'
import FeeSetModal from '@/views/admin/tenantManagement/FeeSetModal'

// import { mixin, mixinDevice } from '@/utils/mixin'
// import fileBase from '@views/mixins/file_base'

export default {
  name: 'FeeSet',
  // mixins: [mixin, mixinDevice, fileBase],
  components: {
    BackBtn,
    FeeSetModal,
    STable
  },
  data () {
    const { id } = this.$route.params
    return {
      // 客户Id，区分是新增还是修改
      id,
      current: ['project'],
      show: 1,
      queryParam: {
        partnerType: 1
      },
      // 表头

      columnstotal: [
        [
          {
            title: '客户名称',
            width: '33%',
            dataIndex: 'partnerName'
          },
          {
            title: '项目名称',
            width: '33%',
            dataIndex: 'projectName'
          },
          {
            title: '操作',
            dataIndex: 'action',
            scopedSlots: { customRender: 'action' }
          }
        ],
        [
          {
            title: '承运商名称',
            width: '50%',
            dataIndex: 'partnerName'
          },
          {
            title: '操作',
            dataIndex: 'action',
            scopedSlots: { customRender: 'action' }
          }
        ], [
          {
            title: '司机姓名',
            width: '50%',
            dataIndex: 'driverName'
          },
          {
            title: '操作',
            dataIndex: 'action',
            scopedSlots: { customRender: 'action' }
          }
        ]
      ],
      columns: [],
      SpartnerName: [],
      SprojectName: [],
      driverData: {
        current: 1,
        pages: 1,
        records: [
          {
            driverName: '全部司机'
          }
        ],
        searchCount: true,
        size: 10,
        total: 1
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: params => {
        // console.log('租户ID' + id)
        this.queryParam.tenantId = this.id
        return feepartnerList(Object.assign(params, this.queryParam)).then(res => {
          console.log('费用自定义客户项目列表：', res)
          const _this = this
          this.SpartnerName = []
          this.SprojectName = []
          res.data.records.forEach(function (item, i) {
            if (item.partnerName && item.partnerName !== '' && item.partnerName !== null) {
              _this.SpartnerName.push(item.partnerName)
            }
          })
          res.data.records.forEach(function (item, i) {
            if (item.projectName && item.projectName !== '' && item.projectName !== null) {
              _this.SprojectName.push(item.projectName)
            }
          })
          _this.SpartnerName = this.unique(this.SpartnerName)
          _this.SprojectName = this.unique(this.SprojectName)
          // console.log(res.data)
          // console.log(this.driverData)
          if (this.show !== 3) {
            return res.data || []
          } else {
            return this.driverData
          }
        })
      }
    }
  },
  created () {
    this.columns = this.columnstotal[0]
  },
  watch: {
  },
  computed: {

  },
  methods: {
    unique (arr) {
      return Array.from(new Set(arr))
    },
    handleEdit (record) {
      const val = {
        typePartId: this.show === 1 ? record.projectId : record.partnerId,
        tenantId: this.id,
        expenseType: this.show === 1 ? 'PROJECT' : (this.show === 2 ? 'NOVCC' : 'DRIVER')
      }
      this.$refs.feeSet.add(val)
    },
    getList (type) {
      this.queryParam.partnerName = undefined
      this.show = type
      this.queryParam.partnerType = this.show !== 3 ? this.show : 1
      this.columns = this.columnstotal[this.show - 1]
      this.$refs.table.refresh()
    },
    // 查询
    handleQuery () {
      this.$refs.table.refresh()
    },
    filterOption (input, option) {
      return (option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
