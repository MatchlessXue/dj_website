import { selectAllPartners } from '@/api/resource/partner'
import { getProjectList } from '@/api/resource/project'

const datumBase = {
  data () {
    return {
      allPartnerDataMap: [], // 获取所有的合作伙伴
      allProjectDataMap: [] // 获取某客户下的所有的项目列表
    }
  },
  methods: {
    /**
     * 所有的合作伙伴
     */
    getAllPartnerDataMap (param) {
      return selectAllPartners(param).then((res) => {
        this.allPartnerDataMap = res.data
      })
    },
    /**
     * 获取某客户下的所有的项目列表
     */
    getAllProjectDataMap (param) {
      return getProjectList(param).then((res) => {
        this.allProjectDataMap = res.data
      })
    }
  }
}

export default datumBase
