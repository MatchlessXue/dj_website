<template>
  <div class="form-layout-body">
    <a-modal :width="500" :visible="visible" :maskClosable="false"
      @ok="handleadd" :confirmLoading="confirmLoading" @cancel="handleaddCancel">
      <template slot="title">
          <a-row :gutter="10">
            <a-col :md="10" :sm="10">
                <a-auto-complete :dataSource="SexpenseName" v-model="queryParam.expenseName"
                 placeholder="请输入费用名称" :filterOption="filterOption" :allowClear="true"/>
            </a-col>
            <a-col :md="6" :sm="10">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" @click="handleQuery">查询</a-button>
              </span>
            </a-col>
          </a-row>
      </template>
      <a-table :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange,getCheckboxProps: getCheckboxProps,onSelectAll: onSelectAll}"
       :columns="columns" :dataSource="data" bordered :pagination="false" :scroll="{y: 340}" :loading="loading">
        <span slot="expenseSelfName" slot-scope="text,record,dataIndex">
          <a-input v-if="record.enableRename === 2" :disabled="true" :value="text" @change="e => handleChange(e.target.value, dataIndex)"/>
          <a-auto-complete v-else :value="text" @change="e => handleChange(e, dataIndex)" :allowClear="true"/>
          <!-- <a-input v-else :value="text" allowClear @change="e => handleChange(e.target.value, dataIndex)"/> -->
        </span>
      </a-table>
    </a-modal>
  </div>
</template>
<script>
import { tenantexpense, feeCheck } from '@/api/admin/tenantManagement/index'

export default {
  data () {
    return {
      visible: false,
      loading: false,
      confirmLoading: false,
      columns: [
        {
          title: '默认名称',
          dataIndex: 'expenseDefaultName',
          width: 195
        },
        {
          title: '自定义名称',
          dataIndex: 'expenseSelfName',
          scopedSlots: { customRender: 'expenseSelfName' }
        }
      ],
      data: [],
      SexpenseName: [],
      selectedRowKeys: [],
      queryParam: {
        expenseName: ''
      } // 查询参数
    }
  },
  mounted () {

  },
  methods: {
    unique (arr) {
      return Array.from(new Set(arr))
    },
    onSelectChange (selectedRowKeys) {
      if (selectedRowKeys.length < this.selectedRowKeys.length) {
        const subtract = this.unique([...selectedRowKeys, ...this.selectedRowKeys])
        const rel = subtract[subtract.length - 1]
        this.data[rel].expenseCheckStatus = 2
      }
      let _this = this
      this.selectedRowKeys = selectedRowKeys
      selectedRowKeys.forEach(function (item, i) {
        _this.data[item].expenseCheckStatus = 1
      })
    },
    onSelectAll (selected, selectedRows, changeRows) {
      const _this = this
      this.selectedRowKeys = []
      if (selected === false) {
        this.data.forEach((item, i) => {
          if (item.checkLock === 1) {
            item.expenseCheckStatus = 1
            _this.selectedRowKeys.push(i)
          } else {
            item.expenseCheckStatus = 2
          }
        })
      } else {
        this.data.forEach((item, i) => {
          _this.selectedRowKeys.push(i)
          item.expenseCheckStatus = 1
        })
      }
    },
    getCheckboxProps: record => ({
      props: { disabled: record.checkLock === 1 }
    }),
    add (record) {
      // console.log(record)
      this.queryParam = {
        typePartId: record.typePartId,
        tenantId: record.tenantId,
        expenseType: record.expenseType
      }
      this.getFeeList()
      this.visible = true
    },
    getFeeList () {
      this.loading = true
      tenantexpense(this.queryParam).then(res => {
        // console.log('费用自定义司机列表：', res)
        this.loading = false
        this.data = res.data
        this.selectedRowKeys = []
        const _this = this
        this.data.forEach(function (item, i) {
          _this.SexpenseName.push(item.expenseDefaultName)
          _this.SexpenseName = _this.unique(_this.SexpenseName)
          if (item.expenseCheckStatus === 1) {
            item.expenseCheckStatus = 1
            _this.selectedRowKeys.push(i)
          }
        })
      })
    },
    handleQuery () {
      this.getFeeList()
    },
    handleadd (e, isRefresh) {
      this.confirmLoading = true
      feeCheck(this.data).then(res => {
        // console.log('保存费用自定义', res)
        this.confirmLoading = false
        if (res.code === 0) {
          this.$message.success('保存成功')
        } else {
          this.$message.fail('系统异常，请联系管理员')
        }
        this.data = []
        this.visible = false
        this.$emit('hideForm', isRefresh)
      })
    },
    handleaddCancel (isRefresh) {
      this.visible = false
      this.data = []
      this.$emit('hideForm', isRefresh)
    },
    handleChange (value, column) {
      console.log(value)
      this.data[column].expenseSelfName = value
    },
    filterOption (input, option) {
      return (option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0)
    }
  }
}
</script>
