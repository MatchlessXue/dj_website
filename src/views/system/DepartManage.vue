<template>
  <div>
    <a-card :bordered="false" class="card-container">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="20">
            <a-col :md="8" :sm="24">
              <a-form-item label="部门名称：">
                <a-input v-model="queryParam.partName" placeholder="请输入" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="部门状态：">
                <a-input v-model="queryParam.status" placeholder="请输入" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" >查询</a-button>
                <a-button type="primary" style="margin-left: 12px">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-card>
    <a-card style="margin-top: 10px" class="card-container">
      <div class="table-page-option-wrapper">
        <a-button icon="plus" type="primary">新增</a-button>
        <a-button icon="edit" type="primary" style="margin-left:10px;">修改</a-button>
      </div>
      <a-table :columns="columns" :dataSource="data" :rowSelection="rowSelection">
        <span slot="action">
          <a>编辑</a>
          <a-divider type="vertical" />
          <a>新增</a>
          <a-divider type="vertical" />
          <a>删除</a>
        </span>
      </a-table>
    </a-card>
  </div>

</template>

<script>

// import STable from '@/components/table/'
import { getPartList } from '@/api/account'
const columns = [{
  title: '部门名称',
  dataIndex: 'name',
  key: 'name'
}, {
  title: '排序',
  dataIndex: 'sort',
  key: 'sort'
}, {
  title: '状态',
  dataIndex: 'status',
  key: 'status'
},
{
  title: '创建时间',
  dataIndex: 'createTime',
  key: 'createTime'
},
{
  title: '操作',
  width: '200px',
  dataIndex: 'action',
  scopedSlots: { customRender: 'action' }
}]
const data = [{
  key: 1,
  name: 'John Brown sr.',
  age: 60,
  address: 'New York No. 1 Lake Park',
  children: [{
    key: 11,
    name: 'John Brown',
    age: 42,
    address: 'New York No. 2 Lake Park'
  }, {
    key: 12,
    name: 'John Brown jr.',
    age: 30,
    address: 'New York No. 3 Lake Park',
    children: [{
      key: 121,
      name: 'Jimmy Brown',
      age: 16,
      address: 'New York No. 3 Lake Park'
    }]
  }, {
    key: 13,
    name: 'Jim Green sr.',
    age: 72,
    address: 'London No. 1 Lake Park',
    children: [{
      key: 131,
      name: 'Jim Green',
      age: 42,
      address: 'London No. 2 Lake Park',
      children: [{
        key: 1311,
        name: 'Jim Green jr.',
        age: 25,
        address: 'London No. 3 Lake Park'
      }, {
        key: 1312,
        name: 'Jimmy Green sr.',
        age: 18,
        address: 'London No. 4 Lake Park'
      }]
    }]
  }]
}, {
  key: 2,
  name: 'Joe Black',
  age: 32,
  address: 'Sidney No. 1 Lake Park'
}]
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
  },
  onSelect: (record, selected, selectedRows) => {
    console.log(record, selected, selectedRows)
  },
  onSelectAll: (selected, selectedRows, changeRows) => {
    console.log(selected, selectedRows, changeRows)
  }
}
export default {
  name: 'TableList',
  components: {
    // STable
  },
  data () {
    return {
      data,
      columns,
      rowSelection,

      description: '列表使用场景：后台管理中的权限管理以及角色管理，可用于基于 RBAC 设计的角色权限控制，颗粒度细到每一个操作类型。',

      visible: false,

      form: null,
      mdl: {},
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {
        partName: '',
        status: 1
      },
      // 加载数据方法 必须为 Promise 对象
      loadData: params => {
        // console.log(parameter, 'queryParam=', this.queryParam)
        this.queryParam.tenantId = this.tenantId
        return getPartList(Object.assign(params, this.queryParam))
          .then(res => {
            console.log('res data==', res)
            return res.data
          })
      },

      selectedRowKeys: [],
      selectedRows: []
    }
  },
  methods: {

  },
  watch: {
  }
}
</script>

<style lang="less" scoped>
 .card-container {
    .ant-card-body {
      padding: 0;
    }
    .table-page-option-wrapper{
      padding: 10px;
    }
  }
</style>
