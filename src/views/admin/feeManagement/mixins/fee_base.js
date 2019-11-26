/**
 * 用于费用管理功能相关下拉列表数据加载
 */

// import { queryStatusList } from '@/api/admin/feeManagement/index'
import { getCostTypeListByDataStatus } from '@/api/libraries'
import { getTenantList } from '@/api/account'
const feeBase = {
  data () {
    return {
      allStatusList: [], // 状态列表
      allCostTypeList: [], // 费用类型列表
      allTenantList: [] // 租户列表
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.getAllStatusList()
      this.getCostTypeList()
      this.getAllTenantList()
    },
    getAllTenantList () {
      getTenantList().then(res => {
        this.allTenantList = res.data || []
      })
    },
    getAllStatusList () {
      // queryStatusList().then(res => {
      //   this.allStatusList = res.data || []
      // })
    },
    getCostTypeList () {
      getCostTypeListByDataStatus().then(res => {
        this.allCostTypeList = res.data || []
      })
    }
  }
}

export default feeBase
