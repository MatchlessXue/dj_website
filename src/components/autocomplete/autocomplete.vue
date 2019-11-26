<template>
        <a-auto-complete
          :dataSource="companyNameSource"
          @search="handleCompanyNameSearch"
          @select="onSelect"
          v-decorator="['siteId', {rules: [{ message: `最多可输入50个字符`, whitespace: true, max: 50}]}]"
          :placeholder="placeholder" />
</template>

<script>
import { throttle, trim } from 'lodash'
import { selectByPage } from '@/api/resource/siteAddress'
export default {
  name: 'autocomplete',
  props: {
    idname: {
      type: String,
      default: 'coopCompanyName'
    },
    placeholder: {
      type: String,
      default: '请选择发货方名称'
    }
  },
  data () {
    return {
      companyNameSource: [],
      companyInfoList: []
    }
  },
  computed: {

  },
  methods: {
    handleCompanyNameSearch: throttle(async function (v) {
      const key = trim(v)
      // 重置表单的值
      this.selectCompony = { coopCompanyId: '', coopCompanyName: v }
      // 查询级联列表
      if (!key) {
        this.companyNameSource = []
      } else {
        const self = this
        console.log('aa', key)
        await selectByPage({ page: '1', pageSize: '10', siteType: '1', sitename: key }).then((res) => {
          const datas = res.data.records || []
          self.companyInfoList = res.data.records
          // 用于级联的下拉列表的显示只能是如下格式
          let source = []
          datas.forEach((val) => {
            source.push({ value: val.partnerId, text: val.siteName })
          })
          self.companyNameSource = source
        })
      }
    }, 500),
    onSelect (value) {
      console.log('select value:', value)
    }

  }
}
</script>

<style scoped>

</style>
