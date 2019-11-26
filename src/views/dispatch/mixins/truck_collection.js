import { queryAllTrucks } from '@/api/resource/truck'

const truckCollection = {
  data () {
    return {
      truckOptions: []
    }
  },
  created () {
    this.queryAllTrucks()
  },
  methods: {
    // 获取车辆信息
    queryAllTrucks () {
      queryAllTrucks().then(res => {
        this.truckOptions = res.data
      })
    }
  }
}

export default truckCollection
