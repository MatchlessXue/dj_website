import { transportationLink, settlementStyle } from '@/api/track/track.js'
import trackBase from '@views/track/mixins/trackBase'
const base = {
  mixins: [trackBase],
  data () {
    return {
      transports: [],
      settlements: [],
      settlementTypes: [],
      proportionTypes: [
        { id: 1, name: '按运单' },
        { id: 2, name: '按件数' },
        { id: 3, name: '按重量' },
        { id: 4, name: '按体积' }
      ],
      columnsF: [{
        // 赔偿索赔费用列表
        title: '类型',
        width: 80,
        dataIndex: 'ClaimNoteType',
        scopedSlots: { customRender: 'ClaimNoteType' }
      },
      {
        title: '金额',
        width: 80,
        dataIndex: 'price',
        scopedSlots: { customRender: 'price' }
      },
      {
        title: '结算类型',
        width: 80,
        dataIndex: 'settlementObj',
        scopedSlots: { customRender: 'settlementObj' }
      },
      {
        title: '结算对象',
        width: 80,
        dataIndex: 'settlementObj_2',
        scopedSlots: { customRender: 'settlementObj_2' }
      },
      {
        title: '结算方式',
        width: 80,
        dataIndex: 'settlementType',
        scopedSlots: { customRender: 'settlementType' }
      },
      {
        title: '分摊方式',
        width: 80,
        dataIndex: 'equalizationMethod',
        scopedSlots: { customRender: 'equalizationMethod' }
      },
      {
        title: '备注',
        width: 150,
        dataIndex: 'remark',
        scopedSlots: { customRender: 'remark' }
      },
      {
        title: '操作',
        width: 150,
        dataIndex: 'operation',
        scopedSlots: { customRender: 'operation' }
      }
      ],
      columnsW: [{
        // title: '结算对象',
        width: 80,
        dataIndex: 'settlementObjId',
        slots: { title: 'settlementObjIdTitle' },
        scopedSlots: { customRender: 'settlementObjId' }
      },
      {
        // title: '费用类型',
        width: 80,
        dataIndex: 'nodeType',
        slots: { title: 'nodeTypeTitle' },
        scopedSlots: { customRender: 'nodeType' }
      },
      {
        // title: '费用金额',
        width: 80,
        dataIndex: 'price',
        slots: { title: 'priceTitle', value: undefined },
        scopedSlots: { customRender: 'price' }
      },
      {
        title: '运输环节',
        width: 80,
        dataIndex: 'transportType',
        scopedSlots: { customRender: 'transportType' }
      },
      {
        // title: '结算方式',
        width: 80,
        dataIndex: 'settlementType',
        slots: { title: 'settlementTypeTitle' },
        scopedSlots: { customRender: 'settlementType' }
      },
      {
        title: '备注',
        width: 150,
        dataIndex: 'nodeContent',
        scopedSlots: { customRender: 'nodeContent' }
      },
      {
        title: '特殊费编号',
        width: 120,
        dataIndex: 'id',
        scopedSlots: { customRender: 'id' }
      },
      {
        title: '审批状态',
        width: 100,
        dataIndex: 'status',
        scopedSlots: { customRender: 'status' }
      },
      {
        title: '操作',
        width: 200,
        dataIndex: 'operation',
        scopedSlots: { customRender: 'operation' }
      }
      ],
      columnsD: [{
        title: '结算对象',
        width: 80,
        dataIndex: 'settlementObjId',
        scopedSlots: { customRender: 'settlementObjId' }
      },
      {
        title: '费用类型',
        width: 80,
        dataIndex: 'nodeType',
        scopedSlots: { customRender: 'nodeType' }
      },
      {
        title: '费用金额',
        width: 80,
        dataIndex: 'price',
        scopedSlots: { customRender: 'price' }
      },
      {
        title: '运输环节',
        width: 80,
        dataIndex: 'transportType',
        scopedSlots: { customRender: 'transportType' }
      },
      {
        title: '结算方式',
        width: 80,
        dataIndex: 'settlementType',
        scopedSlots: { customRender: 'settlementType' }
      },
      {
        title: '分摊方式',
        width: 80,
        dataIndex: 'equalizationMethod',
        scopedSlots: { customRender: 'equalizationMethod' }
      },
      {
        title: '备注',
        width: 150,
        dataIndex: 'nodeContent',
        scopedSlots: { customRender: 'nodeContent' }
      },
      {
        title: '特殊费编号',
        width: 120,
        dataIndex: 'id',
        scopedSlots: { customRender: 'id' }
      },
      {
        title: '审批状态',
        width: 100,
        dataIndex: 'status',
        scopedSlots: { customRender: 'status' }
      },
      {
        title: '操作',
        width: 200,
        dataIndex: 'operation',
        scopedSlots: { customRender: 'operation' }
      }
      ],
      colsF: [],
      colsW: [],
      colsD: []
    }
  },
  created () {
    this.columnsF.forEach(item => {
      this.colsF.push(item.dataIndex)
    })
    this.columnsW.forEach(item => {
      this.colsW.push(item.dataIndex)
    })
    this.columnsD.forEach(item => {
      this.colsD.push(item.dataIndex)
    })
  },
  mounted () {
    this.initFeeTypeList(this.getExpenseTypePartParams)

    transportationLink({}).then(res => {
      for (var i in res.data) {
        this.transports.push({ name: res.data[i], id: i })
      }
    })

    settlementStyle({}).then(res => {
      for (var i in res.data) {
        this.settlementTypes.push({ name: res.data[i], id: i })
      }
    })
  },
  methods: {
    getExpenseTypePartParams () {
      switch (this.payType) {
        case 'waybill':
          return {
            expenseType: 'PROJECT',
            typePartId: this.trackData.projectId
          }
        case 'expend':
          break
        case 'dispatch':
          return this.trackData.carrierId
            ? { expenseType: 'NOVCC', typePartId: this.trackData.carrierId }
            : { expenseType: 'DRIVER', typePartId: '司机' }
        default:
      }

      return {}
    },
    getColumns (payType) {
      switch (payType) {
        case 'addfee':
          return this.columnsF
        case 'dispatch':
          return this.columnsD
        default:
          return this.columnsW
      }
    },
    getCols (payType) {
      switch (payType) {
        case 'addfee':
          return this.colsF
        case 'dispatch':
          return this.colsD
        default:
          return this.colsW
      }
    }
  }
}

export default base
