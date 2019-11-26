<template>
  <a-card title="线路价格信息" :bordered="false" style="margin-top: 10px" class="card-container">
    <div class="table-page-option-wrapper" v-if="!isShowDetail">
      <a-card class="inner-search" :bordered="false">
        <a-form v-if="contractTerm.termId" :form="form" layout="inline" class="form">
          <a-form-item class="hide-form-item">
            <a-input type="hidden" v-model="queryParam.termId" :defaultValue="contractTerm.termId"/>
          </a-form-item>
          <a-form-item class="hide-form-item">
            <a-input type="hidden" v-model="queryParam.contractId" :defaultValue="contractTerm.contractId"/>
          </a-form-item>
          <a-row :gutter="24">
            <!-- <a-col :md="6" :sm="12" v-if="!isZhengche">
                <a-form-item>
                    <a-radio-group v-model="queryParam.routeType" defaultValue="1" buttonStyle="solid">
                        <a-radio-button value="1">行政区域</a-radio-button>
                        <a-radio-button value="2">自定义区域</a-radio-button>
                    </a-radio-group>
                </a-form-item>
            </a-col> -->
            <a-col :md="7" :sm="12">
              <a-form-item label="发货区域" :labelCol="{ span: 8 }" :wrapperCol="{ span: 16 }">
                <a-cascader
                  changeOnSelect
                  v-model="sendRegionq"
                  :options="regionsMap"
                  expandTrigger="hover"
                  placeholder="请输入发货区域"
                />
              </a-form-item>
            </a-col>
            <a-col :md="7" :sm="12">
              <a-form-item label="收货区域" :labelCol="{ span: 8 }" :wrapperCol="{ span: 16 }">
                <a-cascader
                  changeOnSelect
                  v-model="receiveRegionq"
                  :options="regionsMap"
                  expandTrigger="hover"
                  placeholder="请输入收货区域"
                />
              </a-form-item>
            </a-col>
            <a-col :md="3" :sm="24">
            <span class="table-page-search-submitButtons">
                <a-button
                  type="primary"
                  @click="$refs.table.refresh()"
                >查询</a-button>
            </span>
            </a-col>
          </a-row>
        </a-form>
      </a-card>

      <a-row style="margin-bottom: 10px;">
        <a-col :md="{span: 12}" :sm="12">
          <a-button
            type="primary"
            icon="plus"
            @click="handleAddLinePrice"
          >添加线路费用
          </a-button>
        </a-col>
      </a-row>

      <add-line-and-price
        :isShow="isShowPriceForm"
        :inheritedRegionsMap="regionsMap"
        :contractTerm="contractTerm"
        :routeId="routeId"
        @hideForm="hidePriceForm">
      </add-line-and-price>
    </div>

    <s-table
      v-if="contractTerm.termId"
      ref="table"
      size="default"
      bordered
      :scroll="{ x: scrollX}"
      :columns="columns"
      :data="loadData"
      :showAlertInfo="false"
    >
      <span slot="action" slot-scope="text, record">
        <a @click="handleEdit(record)">修改</a>
        <a-divider type="vertical"/>

        <confirm-info
          title="确认删除这条记录么"
          content="删除"
          @onconfirm="handleDelete(record)"
        />
      </span>
    </s-table>

  </a-card>
</template>

<script>
import { mapGetters } from 'vuex'
import STable from '@/components/table/'
import ConfirmInfo from '@/components/ConfirmInfo'
import AddLineAndPrice from './AddLineAndPrice'
import librariesBase from '@views/mixins/libraries_base'
import { globalMap } from '@/api/global'
import { countCollumnsWidth } from '@/utils/util'
import { deleteContractRoute, getContractRoutePage } from '@/api/resource/price'

export default {
  name: 'LinePriceList',
  mixins: [librariesBase],
  components: {
    STable,
    ConfirmInfo,
    AddLineAndPrice
  },
  props: {
    isShowDetail: {
      type: Boolean,
      default: false
    },
    // // 合同价格对象
    // contractTerm: {
    //   type: Object,
    //   default () {
    //     return {}
    //   }
    // },
    // 区域
    lplRegionsMap: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    let columns = [
      {
        title: '发货区域',
        width: 120,
        dataIndex: 'sendAddress'
      },
      {
        title: '收货区域',
        width: 120,
        dataIndex: 'receiveAddress'
      },
      {
        title: '时效(小时)',
        width: 120,
        dataIndex: 'costHour'
      },
      {
        title: '车长(m)',
        width: 120,
        dataIndex: 'truckLengthName'
      },
      {
        title: '载重(吨)',
        width: 120,
        dataIndex: 'weightLoad'
      },
      {
        title: '车辆类型',
        width: 120,
        dataIndex: 'truckTypeName'
      },
      {
        title: '货物类型',
        width: 120,
        dataIndex: 'cargoTypeName'
      },
      // {
      //   title: '收货方名称',
      //   dataIndex: 'receiverName'
      // },
      {
        title: '费用类型',
        width: 120,
        dataIndex: 'costTypeName'
      },
      {
        title: '计费方式',
        width: 120,
        dataIndex: 'calcCostUnitName'
      },
      {
        title: '区间类型',
        width: 120,
        dataIndex: 'intervalTypeName'
      },
      {
        title: '区间下限',
        width: 120,
        dataIndex: 'lowerLimit'
      },
      {
        title: '区间上限',
        width: 120,
        dataIndex: 'upperLimit'
      },
      {
        title: '价格类型',
        width: 120,
        dataIndex: 'computeTypeName'
      },
      {
        title: '价格',
        width: 120,
        dataIndex: 'price'
      }
    ]
    // 操作列
    if (!this.isShowDetail) {
      columns.push({
        title: '操作',
        dataIndex: 'action',
        width: 140,
        fixed: 'right',
        scopedSlots: { customRender: 'action' }
        // customRender: (text, row, index) => {
        //   console.log(text, row, index)
        //   return <a href="javascript:;">{text}</a>
        //   // if (index < 4) {
        //   //   return <a href="javascript:;">{text}</a>
        //   // }
        //   // return {
        //   //   children: <a href="javascript:;">{text}</a>,
        //   //   attrs: {
        //   //     colSpan: 5
        //   //   }
        //   // }
        // }
      })
    }
    return {
      isShowPriceForm: false, // 是否显示添加线路弹窗
      form: this.$form.createForm(this),
      routeId: null,

      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      sendRegionq: [],
      receiveRegionq: [],
      // 表头
      columns,
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        console.log(parameter, 'queryParam=', this.queryParam)

        this.queryParam.contractId = this.contractTerm.contractId
        this.queryParam.termId = this.contractTerm.termId

        this.queryParam.sendRegion = ''
        this.queryParam.receiveRegion = ''
        const { sendRegionq, receiveRegionq } = this
        sendRegionq && (this.queryParam.sendRegion = sendRegionq.join(','))
        receiveRegionq && (this.queryParam.receiveRegion = receiveRegionq.join(','))

        return getContractRoutePage(Object.assign(parameter, this.queryParam)).then(
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
  watch: {
    contractTerm: {
      deep: true,
      handler: function (val) {
        console.log('vall.....', val)
        this.toggleColumns(val.transportType)
      }
    }
  },
  computed: {
    ...mapGetters('price', [
      'contractTerm'
    ]),
    // 是否整车
    isZhengche () {
      return this.contractTerm.transportType === globalMap.transportType_zc
    },
    scrollX () {
      return countCollumnsWidth(this.columns)
    }
  },
  beforeMount () {
    console.log('beforeMount->contractTerm ', this.contractTerm)
  },
  created () {
    this.getRegions() //
    console.log('created->contractTerm', this.contractTerm)
  },
  methods: {
    // 添加线路费用
    handleAddLinePrice () {
      this.$emit('beforeAddLineHandle', (data) => {
        console.log('save data....', data)
        this.routeId = null
        this.isShowPriceForm = true
      })
    },
    // 修改
    handleEdit (record) {
      console.log('record', record)
      this.routeId = record.routeId
      this.mdl = Object.assign({}, record)
      console.log(this.mdl)
      this.$nextTick(() => {
        this.isShowPriceForm = true
      })
    },
    // 删除
    handleDelete (record) {
      deleteContractRoute({ id: record.routeId }).then(res => {
        this.$message.success('删除成功')
        this.$refs.table.refresh()
      }).catch((err) => {
        this.$message.error('删除失败:', err.message)
      })
    },
    // 查看详情
    handleDetail (record) {
      this.$router.push({ name: 'priceDetail', params: { id: record.termId } })
    },
    // 隐藏表单
    hidePriceForm (isRefresh) {
      this.isShowPriceForm = false
      if (isRefresh) {
        this.$refs.table.refresh()
      }
    },
    toggleColumns (transportType) {
      const i = this.columns.findIndex(function (value, index, arr) {
        return value.dataIndex === 'truckLengthName'
      })
      if (transportType === 2/* 整车 */) {
        const zcColumns = [
          {
            title: '车长(m)',
            width: 120,
            dataIndex: 'truckLengthName'
          },
          {
            title: '载重(吨)',
            width: 120,
            dataIndex: 'weightLoad'
          },
          {
            title: '车辆类型',
            width: 120,
            dataIndex: 'truckTypeName'
          }
        ]
        i > 0 || this.columns.splice(3, 0, ...zcColumns)
      } else {
        i > 0 && this.columns.splice(3, 3)
      }
    }
  }
}
</script>
<style>

</style>
