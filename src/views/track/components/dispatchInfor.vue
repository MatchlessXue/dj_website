<template>
  <div class="site-addr-form-layout form-layout-body">
    <a-modal class="dispatchInfoClass" :title="title" :width="900" :visible="visible" :maskClosable="false" :centered="true"
    :confirmLoading="confirmLoading" @cancel="handleaddCancel">
      <template slot="footer">
        <a></a>
      </template>
      <a-spin :spinning="confirmLoading">
        <a-form :form="form">
           <a-form-item>
            <template>
              <a-steps :current="steps.length - 1" progressDot>
                <a-step v-for="item in steps" :key="item.index">
                  <template slot="title">
                    <div :key="item.dispatchId">
                      <div style="font-weight:400;font-size:16px;color:rgba(0,0,0,0.45);">调度单号：{{item.dispatchCode}}</div>
                      <div style="font-weight:400;font-size:16px;color:rgba(0,0,0,0.45);">承运方：{{item.plateNumber}}</div>
                      <div style="font-weight:400;font-size:16px;color:rgba(0,0,0,0.45);">联系人：{{item.driverName}}</div>
                      <div style="font-weight:400;font-size:16px;color:rgba(0,0,0,0.45);">手机号：{{item.mobile}}</div>
                    </div>
                  </template>
                </a-step>
              </a-steps>
            </template>
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>
  </div>
</template>
<script>
import fileBase from '@views/mixins/file_base'
import { dispatchSelectByPage } from '@/api/dispatch/dispatch'
export default {
  name: 'FeedBack',
  mixins: [fileBase],
  data () {
    return {
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      steps: []
    }
  },
  mounted () {
  },
  watch: {
  },
  computed: {
    title () {
      return `运单调度信息`
    }
  },
  methods: {
    add (rows) {
      dispatchSelectByPage({
        page: 1,
        pageSize: 20,
        waybillId: rows.waybillId
      }).then(res => {
        // console.log(res.data.records)
        this.steps = res.data.records
      })
      // console.log(rows)
      // this.steps = [
      //   { dispatchId: '调度单号：DD201902898001', carrier: '承运方：沪A2746B', name: '联系人：李大闯', phone: '手机号：13573987465' },
      //   { dispatchId: '调度单号：DD201902898001', carrier: '承运方：沪A2746B', name: '联系人：李大闯', phone: '手机号：13573987465' },
      //   { dispatchId: '调度单号：DD201902898001', carrier: '承运方：沪A2746B', name: '联系人：李大闯', phone: '手机号：13573987465' }
      // ]
      if (this.steps.length > 3) {
        this.steps = this.steps.splice(this.steps.length - 4, 4)
      }
      this.visible = true
    },
    handleaddCancel (isRefresh) {
      this.visible = false
      this.form.resetFields()
      this.$emit('hideForm', isRefresh)
    }
  }
}
</script>
<style lang="less">
  .dispatchInfoClass .ant-steps-dot .ant-steps-item-content {
    width: 254px;
    text-align: left;
    margin-left: 40px;
  }
  .dispatchInfoClass .ant-modal-footer {
    padding: 0;
  }
</style>
