<template>
  <!-- 联系人列表，添加删除修改 -->
  <a-table
    :columns="columns"
    :dataSource="detail"
    :pagination="false"
  >
  </a-table>
</template>

<script>
import { mixin, mixinDevice } from '@/utils/mixin'

export default {
  name: 'ConstactsList',
  mixins: [mixin, mixinDevice],
  components: {
  },
  props: {
    detail: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      // table
      columns: [
        {
          title: '类型',
          dataIndex: 'contactTypeName',
          key: 'contactTypeName',
          width: '8%'
        },
        {
          title: '姓名',
          dataIndex: 'contactName',
          key: 'contactName',
          width: '10%',
          scopedSlots: { customRender: 'contactName' }
        },
        {
          title: '手机号',
          dataIndex: 'mobile',
          key: 'mobile',
          width: '15%',
          scopedSlots: { customRender: 'mobile' }
        },
        {
          title: '邮箱',
          dataIndex: 'email',
          key: 'email',
          width: '15%',
          scopedSlots: { customRender: 'email' }
        },
        {
          title: '省市区',
          dataIndex: 'region',
          key: 'region',
          width: '20%',
          scopedSlots: { customRender: 'region' }
        },
        {
          title: '详细地址',
          dataIndex: 'address',
          key: 'address',
          width: '25%',
          scopedSlots: { customRender: 'address' }
        }
      ]

    }
  },
  methods: {
  }
}
</script>

<style lang="less">

</style>
