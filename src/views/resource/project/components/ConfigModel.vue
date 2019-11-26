<template>
  <a-modal title="添加人员" :width="450" :visible="visible"
    :confirmLoading="confirmLoading" @ok="handleOk" @cancel="handleCancel">
    <a-spin :spinning="confirmLoading" class="configModel" style="padding:0 36px;">
      <div style="color:#1890FF;font-size:12px;margin-bottom:10px;">提示信息：项目无配置人员时,该项目信息全局可见，配置人 员后，该项目运单、调度、跟踪的相关信息仅配置人员可见。</div>
      <a-form :form="form">
        <a-form-item hasFeedback>
          <treeselect
            noResultsText="无匹配结果"
            noOptionsText="没有可搜索的人员信息"
            noChildrenText="没有人员信息"
            :multiple="true"
            :options="depAccountList"
            placeholder="选择人员"
            :disable-branch-nodes="true"
            v-model="value"
            />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { ProjectSave } from '@api/resource/project'
import { getDepAccountsListUser } from '@api/account'
import { mapGetters } from 'vuex'
import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  name: 'ConfigModel',
  components: {
    Treeselect
  },
  data () {
    return {
      visible: false,
      confirmLoading: false,
      mdl: {},
      form: this.$form.createForm(this),
      permissions: [],
      simpleTreeData: [],
      partValues: [],
      tmpRecord: {},
      depAccountList: [],
      value: []
    }
  },
  computed: {
    ...mapGetters(['tenantId'])
  },
  created () {
    getDepAccountsListUser().then(res => {
      // console.log('AddPerson>res', res)
      if (res.code === 0 && res.data && res.data.length) {
        const targetTreeData = []
        // console.log('AddPerson>res', res.data)
        res.data.forEach(item => {
          targetTreeData.push(this.getNode(item))
        })
        this.depAccountList = targetTreeData
        // console.log(this.depAccountList)
      }
    })
  },
  methods: {
    add () {
      this.edit({ id: 0 })
    },
    edit (record) {
      // console.log(record)
      this.value = []
      this.tmpRecord = Object.assign({}, record)
      this.visible = true
      if (record.accountsList) {
        for (const item of record.accountsList) {
          this.value.push(item.accountId)
        }
      }
    },
    close () {
      this.$emit('close')
      this.visible = false
    },
    handleOk () {
      const _this = this
      let tempDepartments = []
      for (let item of this.value) {
        tempDepartments.push({ accountId: item })
      }
      let tmpValues = {}
      tmpValues.accountsList = tempDepartments
      tmpValues.projectId = this.tmpRecord.projectId
      tmpValues.partnerId = this.tmpRecord.partnerId

      console.log(tmpValues)
      // return false
      ProjectSave(tmpValues).then(res => {
        _this.$message.success('保存成功')
        _this.$emit('ok') // 弹框操作完成的回调
      }).catch(() => {
      }).finally(() => {
        _this.confirmLoading = false
        _this.close()
      })
    },
    handleCancel () {
      this.close()
    },
    getNode (item) {
      const parent = {
        id: item.departmentId,
        label: item.departmentName,
        children: []
      }
      if (!item.accounts) item.accounts = []
      item.accounts.forEach(acc => {
        parent.children.push({
          id: acc.accountId,
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
    }
  }
}
</script>

<style>
   .configModel .ant-form-item-control{
    line-height: 1.5;
  }
</style>
