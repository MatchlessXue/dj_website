const base = {
  data () {
    return {
      tabItems: [
        { key: '1', title: '客户信息', pathName: 'partnerCustomer' },
        { key: '2', title: '项目信息', pathName: 'ProjectList' },
        { key: '3', title: '发货方信息', pathName: 'siteaddressSend' },
        { key: '4', title: '收货方信息', pathName: 'siteaddressReceive' },
        { key: '5', title: '货物信息', pathName: 'cargo' }
      ],
      tabItems2: [
        { key: '1', title: '车辆管理', pathName: 'truck' },
        { key: '2', title: '司机管理', pathName: 'driver' }
      ]
    }
  },
  computed: {

  },
  mounted () {
    console.log('aaaa')
  },
  methods: {

  }
}
export default base
