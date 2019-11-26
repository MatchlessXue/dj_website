import {
  selectAll
} from '@/api/resource/siteAddress'

const siteCollection = {
  data () {
    return {
      siteOptions: []
    }
  },
  created () {
    this.getAllSite()
  },
  methods: {
    // 获取所有站点
    getAllSite () {
      selectAll().then(res => {
        this.siteOptions = res.data
      })
    },
    // 过滤
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
  }
}

export default siteCollection
