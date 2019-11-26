
import {
  selectAllPartners
} from '@/api/resource/partner.js'

const partnerCollection = {
  data () {
    return {
      partnerOptions: []
    }
  },
  created () {
    this.selectAllPartners()
  },
  methods: {
    // 获取所有承运商
    selectAllPartners () {
      selectAllPartners().then(res => {
        this.partnerOptions = res.data
      })
    }
  }
}

export default partnerCollection
