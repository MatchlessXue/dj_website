
import { getRegionOfCity } from '@/api/libraries'

const cityCollection = {
  data () {
    return {
      cityOptions: []
    }
  },
  created () {
    this.getRegionOfCity()
  },
  methods: {
    // 获取所有城市
    getRegionOfCity () {
      getRegionOfCity().then(res => {
        this.cityOptions = res.data
      })
    },
    // 过滤
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
  }
}

export default cityCollection
