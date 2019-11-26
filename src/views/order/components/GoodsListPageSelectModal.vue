<template>
  <a-modal
    title="选择货物"
    style='top: 40px; '
    width='80%'
    :bodyStyle="{'height': '460px','overflow': 'scroll'}"
    :visible="visible"
    @ok="goodsListPageSelectSub"
    @cancel="goodsListPageSelectCancel"
  >

    <a-form layout="inline">
      <a-row :gutter="24">
        <a-col
          :md="6"
          :sm="24"
        >
          <a-form-item label="货物名称：">
            <a-input
              v-model="queryParam.cargoName"
              placeholder="请输入货物名称"
            />
          </a-form-item>
        </a-col>
        <a-col
          :md="6"
          :sm="24"
        >
          <span class="table-page-search-submitButtons">
            <a-button
              type="primary"
              @click="handleQuery"
            >查询</a-button>
          </span>
        </a-col>
      </a-row>
    </a-form>
    <a-card>
      <a-form
        @submit="goodsListPageSelectSub"
        :form="form"
        class="form"
      >

        <s-table
          ref="table"
          size="default"
          :columns="columns"
          :data="loadData"
          rowKey="consignmentId"
          :showAlertInfo="false"
          :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        >
        </s-table>
      </a-form>
    </a-card>
  </a-modal>
</template>

<script>
import { mapGetters } from 'vuex'
import { queryCargos } from '@/api/resource/cargo'
import STable from '@/components/table'
export default {
  name: 'GoodsListPageSelectModal',
  props: {
    goodsListPageSelectvisible: {
      type: Boolean,
      default () {
        return false
      }
    },
    currentId: {
      type: String,
      default () {}
    }
  },
  watch: {
    goodsListPageSelectvisible: {
      deep: true,
      handler: function (val) {
        this.visible = val
        // this.form.resetFields()
        // this.form.refresh()
        this.$refs.table.refresh()
      }
    },
    currentId: {
      handler: function (val) {
        console.log('curr', val)
        // this.partnerId = val
      }
    },
    getPartnerId: {
      handler: function (val) {
        this.partnerId = val
      }
    }
  },
  computed: {
    ...mapGetters('waybill', ['getPartnerId'])
  },
  components: {
    STable
  },
  data () {
    return {
      visible: false,
      selectedRowKeys: [],
      // 查询参数
      queryParam: {},
      partnerId: this.currentId,
      // 表头
      columns: [
        // {
        //   title: '客户名称',
        //   dataIndex: 'partnerName',
        //   key: 'partnerName'
        // },
        {
          title: '货物名称',
          dataIndex: 'cargoName',
          key: 'cargoName',
          scopedSlots: { customRender: 'cargoName' }
        },
        {
          title: '货物代码',
          dataIndex: 'cargoCode',
          key: 'cargoCode',
          customRender: (text, record) => (
            <div class="colClass">{record.cargoCode}</div>
          )
        },
        {
          title: '货物类型',
          key: 'cargoSpecifications',
          dataIndex: 'cargoSpecifications'
        },
        {
          title: '货物包装',
          key: 'packageTypeName',
          dataIndex: 'packageTypeName'
        },
        {
          title: '单件重量（KG）',
          key: 'weightCustom',
          dataIndex: 'weightCustom'
        },
        {
          title: '单件体积（m³）',
          key: 'volumeCustom',
          dataIndex: 'volumeCustom'
        },
        {
          title: '单件货值',
          key: 'worth',
          dataIndex: 'worth'
        }
      ],
      pagination: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        let param = {
          partnerId: this.partnerId
        }
        // console.log(parameter, 'queryParam=', this.queryParam)
        return queryCargos(
          Object.assign(parameter, param, this.queryParam)
        ).then(res => {
          return res.data || []
        })
      },
      form: this.$form.createForm(this)
    }
  },
  methods: {
    // 提交
    handleQuery (e) {
      this.$refs.table.refresh()
    },
    // 浮层关闭事件
    goodsListPageSelectCancel () {
      // 关闭浮层
      this.$emit('handlegoodsselectclose')
      // 清空表单信息
      this.form.resetFields()
    },
    // 提交
    goodsListPageSelectSub (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.$emit('handleSelectRows', this.selectedRows)
          // 清空表单信息
          this.form.resetFields()
          this.selectedRowKeys = [] // 处理复选框选中
          this.selectedRows = [] // 记录已选中行数据
        }
      })
    },
    onSelectChange (record, selected, selectedRows, nativeEvent) {
      this.selectedRowKeys = record // 处理复选框选中
      this.selectedRows = selected // 记录已选中行数据
    }
  }
}
</script>
