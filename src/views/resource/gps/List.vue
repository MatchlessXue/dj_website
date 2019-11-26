
<template>
  <div class="page-container">
    <a-card :bordered="false"  @keyup.enter="$refs.table.refresh()"
            class="card-container">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :md="6"
                   :sm="24">
              <a-form-item label="GPS设备号">
                <a-input v-model="queryParam.deviceNumber"
                         placeholder="请输入GPS设备号" />
              </a-form-item>
            </a-col>
            <a-col :md="6"
                   :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button type="primary" @click="$refs.table.refresh()">查询</a-button>&nbsp;&nbsp;&nbsp;&nbsp;
                <a-button @click="handleReset">重置</a-button>
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
                      @click="handleAdd">新建GPS设备号</a-button>
          </a-col>
          <a-col style="text-align: right;"
                 :md="{span: 12}"
                 :sm="12">
            <import-export />
          </a-col>
        </a-row>
      </div>
      <a-modal title="GPS设备信息"
               centered
               :visible="AddModalvisible"
               @ok="handlegpsadd"
               :confirmLoading="confirmLoading"
               @cancel="handleaddCancel">
        <gps-form ref="gpsForm"
                  :brandDataList="brandData"
                  :componeyType="componeyType"
                  @handlerefresh="handlerefresh"
                  :deviceTypeData="deviceTypeData"
                  :allStatus="allStatus"
                  :gpsData="gpsData" />
      </a-modal>
      <a-modal title="查看GPS设备信息"
               centered
               :visible="ViewModalvisible"
               :confirmLoading="confirmLoading"
               @cancel="handlegpsview">
        <template slot="footer">
          <a-button key="back" @click="handlegpsview">关闭</a-button>
        </template>
        <gps-Detail ref="gpsDetail"
                    :viewdata="viewdata" />
      </a-modal>
      <s-table ref="table" bordered
               size="default"
               :scroll="{x:1000}"
               :columns="columns"
               :data="loadData"
               :showAlertInfo="false"
               v-if="isready"
               :rowKey="record => record.deviceId"
               :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}">
        <!-- <template slot="deviceNumber"
                slot-scope="text">
        <a href="javascript:handleDetail();">{{text}}</a>
      </template> -->
        <a slot="deviceNumber"
           slot-scope="text, record"
           @click="handleDetail(record)">{{text}}</a>
        <span slot="bizStatus"
              slot-scope="text, record">{{record.bizStatusName}}</span>
        <span slot="brand"
              slot-scope="text, record">{{record.brandName}}</span>
        <span slot="deviceType"
              slot-scope="text, record">{{record.deviceTypeName}}</span>
        <span slot="action"
              slot-scope="text, record">
          <a @click="handleEdit(record)">修改</a>
          <a-divider type="vertical" />
          <confirm-info title="确认删除这条记录么"
                        content="删除"
                        @onconfirm="handleDel(record)" />
          <a-divider type="vertical" />
          <confirm-info :title="(record.bizStatus+'') === '100' ? '确认停用这条记录么?' : '确认启用这条记录么?'"
                        :content="(record.bizStatus +'')=== '100' ? '停用' : '启用'"
                        @onconfirm="handleStatus(record)" />
        </span>
      </s-table>
    </a-card>

  </div>
</template>

<script>
// import { getBrandId } from '@/api/libraries'
import STable from '@/components/table'
import ImportExport from '@/components/ImportExport'
import AInput from 'ant-design-vue/es/input/Input'
import { getBrandId } from '@/api/libraries'
import moment from 'moment'
import gpsForm from '@/views/resource/gps/GPSForm'
import ConfirmInfo from '@/components/ConfirmInfo'
import gpsDetail from '@/views/resource/gps/GPSDetail'
import { getGPSList, deleteBydeviceId, updateStatus } from '@/api/resource/gps'
import { globalMap, getAllStatusFilter, getAllStatus } from '@/api/global'
// GPS相关基础数据
// import gpsBase from '@views/mixins/gps_base'

export default {
  name: 'gpsList',
  // mixins: [gpsBase],
  components: {
    AInput,
    STable,
    gpsForm,
    ImportExport,
    gpsDetail,
    ConfirmInfo
  },
  data () {
    return {
      brandData: [],
      allStatus: [],
      // 表头
      columns: [],
      deviceTypeData: [
        {
          value: 1,
          text: '便携式'
        },
        {
          value: 2,
          text: '车载'
        }
      ],
      componeyType: [
        {
          value: 0,
          text: '自有'
        },
        {
          value: 1,
          text: '客户'
        },
        {
          value: 2,
          text: '承运商'
        }
      ],
      isready: false,
      visible: false,
      confirmLoading: false,
      pagination: {},
      viewdata: {},
      statusEnable: globalMap.statusEnable, // 启用状态
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
      AddModalvisible: false,
      ViewModalvisible: false,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      gpsData: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getGPSList(Object.assign(parameter, this.queryParam)).then(
          res => {
            this.allStatus = getAllStatus()
            // 表格数据处理
            res.data.records.forEach((item, i) => {
              item.deviceTypeName = this.getTextByKey(
                item.deviceType + '',
                this.deviceTypeData,
                'value',
                'text'
              )
              item.bizStatusName = this.getTextByKey(
                item.bizStatus + '',
                this.allStatus,
                'code',
                'name'
              )
              item.brandName = this.getTextByKey(
                item.brand + '',
                this.brandData,
                'value',
                'text'
              )
              item.partnerType = item.partner ? item.partner.partnerType : ''
            })
            console.log('data', res.data)
            return res.data
          }
        )
      },

      selectedRowKeys: [],
      selectedRows: []
    }
  },
  created () {
    // 获取厂商列表
    this.getBrandIdMap()
  },
  computed: {
    gpsinfo () {
      return {}
    }
  },
  methods: {
    handleReset () {
      this.queryParam = {}
    },
    // 列表筛选列初始化
    createColumns () {
      this.columns = [
        {
          title: 'GPS设备号',
          dataIndex: 'deviceNumber',
          scopedSlots: { customRender: 'deviceNumber' }
        },
        {
          title: '类型',
          dataIndex: 'deviceType',
          filterMultiple: false,
          scopedSlots: { customRender: 'deviceType' }
        },
        {
          title: '厂商',
          dataIndex: 'brand',
          sorter: true,
          filterMultiple: false,
          filters: this.brandData,
          scopedSlots: { customRender: 'brand' }
        },
        {
          title: '状态',
          // dataIndex: 'bizStatusName',
          dataIndex: 'bizStatus',
          needTotal: true,
          filterMultiple: false,
          filters: getAllStatusFilter(),
          scopedSlots: { customRender: 'bizStatus' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '200px',
          fixed: 'right',
          scopedSlots: { customRender: 'action' }
        }
      ]
    },
    // 新增按钮事件
    handleAdd () {
      this.gpsData = {}
      // 展开浮层
      this.AddModalvisible = true
      if (this.$refs.gpsForm) {
        this.$refs.gpsForm.handleopen(1)
      }
    },
    // 新增浮层确认事件
    handlegpsadd (e) {
      // 表单提交
      if (this.$refs.gpsForm) {
        this.$refs.gpsForm.handleSubmit(e)
      }
    },
    // 列表刷新
    handlerefresh () {
      // 刷新列表
      this.$refs.table.refresh()
      // 关闭浮层
      this.AddModalvisible = false
    },
    // 新增浮层关闭事件
    handleaddCancel () {
      // 关闭浮层
      this.AddModalvisible = false
      // 清空表单信息
      this.$refs.gpsForm.handleclose()
      this.gpsData = {}
    },
    // 编辑GPS信息
    handleEdit (record) {
      console.log(record)
      this.AddModalvisible = true
      this.$nextTick(res => {
        this.gpsData = record
        if (this.$refs.gpsForm) {
          this.$refs.gpsForm.handleopen(2)
        }
      })
    },
    // 查看详情
    handleDetail (record) {
      this.ViewModalvisible = true
      this.$nextTick(res => {
        this.viewdata = record
        console.log('佳佳家家军军军军军军军军军军军军军军军')
        console.log(this.viewdata)
      })
    },
    handlegpsview () {
      this.ViewModalvisible = false
    },
    // 删除
    handleDel (record) {
      deleteBydeviceId({ deviceId: record.deviceId }).then(res => {
        if (res.code === 0) {
          this.$message.success('操作成功')
          // 刷新列表
          this.$refs.table.refresh()
        } else {
          this.$message.error('操作失败')
        }
      })
    },
    // 启用 停用
    handleStatus (record) {
      updateStatus({ deviceId: record.deviceId }).then(res => {
        if (res.code === 0) {
          this.$message.success('操作成功')
          // 刷新列表
          this.$refs.table.refresh()
        } else {
          this.$message.error('操作失败')
        }
      })
    },
    onSelectChange (record, selected, selectedRows, nativeEvent) {
      this.selectedRowKeys = record // 处理复选框选中
      this.selectedRows = selected // 记录已选中行数据
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    /**
     * 获取厂商列表
     */
    getBrandIdMap () {
      return getBrandId({
        catalogId: 11
      }).then(res => {
        var temp = []
        res.data.forEach(function (item, i) {
          temp.push({
            text: item.dictName,
            value: String(item.dictId)
          })
        })
        this.brandData = temp
        this.createColumns()
        this.isready = true
      })
    },
    /**
     * 根据Key获取名称
     */
    getTextByKey (key, data, keyName, TextName) {
      if (!key || !data || !keyName || !TextName) {
        return ''
      }
      if (key === null || key === '') {
        return ''
      }
      if (data.length === 0) {
        return ''
      }
      if (keyName === null || keyName === '') {
        return ''
      }
      if (TextName === null || TextName === '') {
        return ''
      }
      var TextVal = ''
      var datatemp = JSON.parse(JSON.stringify(data)) // 复制对象
      datatemp.forEach(function (item, i) {
        var chk = false
        for (var itemkey in item) {
          if (keyName + '' === itemkey + '' && key + '' === item[itemkey] + '') {
            chk = true
          }
        }
        if (chk) {
          for (var itemkey2 in item) {
            if (TextName + '' === itemkey2 + '') {
              TextVal = item[itemkey2] + ''
            }
          }
        }
      })
      return TextVal
    },
    resetSearchForm () {
      this.queryParam = {
        page: 1,
        pageSize: 10,
        date: moment(new Date())
      }
    }
  },
  watch: {}
}
</script>
<style lang="less" scoped>
</style>
