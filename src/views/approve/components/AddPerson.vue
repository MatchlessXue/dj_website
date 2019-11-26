<template>
  <div>
    <a-modal
      :title="title"
      v-model="visible"
      :maskClosable="false"
      @ok="handleOk">
     <treeselect placeholder="输入选择..."
        noResultsText="无匹配结果"
        noOptionsText="没有可搜索的人员信息"
        noChildrenText="没有人员信息"
        v-model="value"
        :multiple="false"
        :disable-branch-nodes="true"
        value-consists-of="LEAF_PRIORITY"
        :options="depAccountList" />
    </a-modal>
  </div>
</template>
<script>
// import the component
import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { getDepAccountsList } from '@api/account'
export default {
  components: {
    Treeselect
  },
  props: {
    title: {
      type: String,
      default: '添加人员'
    }
  },
  data () {
    return {
      // define default value
      value: null,
      approveData: [],
      relateType: undefined, // 1: 设置审批人 2：设置抄送人
      depAccountList: [],
      visible: false
    }
  },
  mounted () {
    let userinfo = this.$store.getters.userInfo || {}
    getDepAccountsList({ tenantId: userinfo.tenantId }).then(res => {
      console.log('AddPerson>res', res)
      if (res.code === 0 && res.data && res.data.length) {
        const targetTreeData = []
        console.log('AddPerson>res', res.data)
        res.data.forEach(item => {
          targetTreeData.push(this.getNode(item))
        })
        this.depAccountList = targetTreeData
      }
    })
  },
  methods: {
    convertApproveDataToCurrentValue (record) {
      if (this.relateType === 1) {
        const { approveUserId, approveUserName } = record
        return !approveUserId ? null : JSON.stringify({
          accountId: approveUserId,
          accountName: approveUserName
        })
      } else {
        const { ccUserId, ccUserName } = record
        return !ccUserId ? null : JSON.stringify({
          accountId: ccUserId,
          accountName: ccUserName
        })
      }
    },
    getNode (item) {
      const parent = {
        id: item.department_id,
        label: item.departmentName,
        children: []
      }
      item.accounts.forEach(acc => {
        parent.children.push({
          id: JSON.stringify({
            accountId: acc.accountId,
            accountName: acc.accountName
          }),
          label: acc.accountName
        })
      })
      if (item.childList && item.childList.length) {
        item.childList.forEach(child => {
          parent.children.push(this.getNode(child))
        })
      } else {
        return parent
      }

      return parent
    },
    showModal (record, relateType) {
      this.approveData = record
      this.relateType = relateType
      this.value = this.convertApproveDataToCurrentValue(record)
      console.log('approveData515', this.approveData, this.value)
      this.visible = true
    },
    getCurrentValue () {
      return this.value
    },
    resetCurrentValue (value) {
      this.value = value
    },
    handleOk (e) {
      console.log('AddPerson>value', this.value, this.approveData)
      if (this.isValidSetedOperator()) {
        this.visible = false
        this.$emit('okSubmit', this.approveData, this.value)
      } else {
        this.value = this.convertApproveDataToCurrentValue(this.approveData)
      }
    },
    isValidSetedOperator () {
      const isTip = !this.value && this.approveData.approveUserId && this.relateType === 1 && this.approveData.bizStatus === 100
      isTip && this.$message.error('启用状态的审批人不能为空！')
      return !isTip
    }
  }
}
</script>
