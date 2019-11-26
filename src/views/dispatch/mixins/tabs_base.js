
import { mapGetters, mapActions } from 'vuex'

const siteCollection = {
  data () {
    return {
      selectedRowKeys: [],
      selectedRows: []
    }
  },
  computed: {
    ...mapGetters(['tenantId'])
  },
  methods: {
    ...mapActions(['setPreDispatchData']),
    // 点击预调度
    goPreDispatch (type) {
      if (this.validate()) {
        let rows = this.selectedRows
        this.setPreDispatchData(rows).then(() => {
          this.$router.push({
            name: 'PreDispatchForTab',
            params: {
              type: type
            }
          })
        })
      }
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    validate () {
      let msg = ''
      let rows = this.selectedRows
      if (rows.length <= 0) {
        msg = '请先选择运单' // 没选
      } else {
        let sId = rows[0].sdCityRgcode
        msg = rows.every(item => {
          return item.sdCityRgcode === sId
        }) ? '' : '只能有一个发货区域'
      }
      msg !== '' && this.$message.error(msg)
      return msg === ''
    }
  }
}

export default siteCollection
