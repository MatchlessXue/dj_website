import { getAllPartners } from '@/api/resource/partner'

const reportBase = {
  data () {
    return {
      allCustomerList: [],
      allCarrierList: [],
      allCustomerProjectList: [],
      allDriverList: []
    }
  },
  methods: {
    getAllCustomerList () {
      /* 客户 */
      getAllPartners({ partnerTypes: 1 }).then(res => {
        this.allCustomerList = res.data
      })
    },
    getAllCarrierList () {
      /* 承运商 */
      getAllPartners({ partnerTypes: 2 }).then(res => {
        this.allCarrierList = res.data
      })
    },
    getAllCustomerProjectList () {

    },
    getAllDriverList () {

    }
  }
}

export default reportBase
