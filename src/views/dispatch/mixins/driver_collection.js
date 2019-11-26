
import { getAllDrivers } from '@/api/resource/driver'

const driverCollection = {
  data () {
    return {
      driverOptions: []
    }
  },
  created () {
    // this.getAllDrivers()
  },
  methods: {
    // 获取所有司机
    getAllDrivers () {
      getAllDrivers().then(res => {
        this.driverOptions = res.data
      })
    }
  }
}

export default driverCollection
