<template>
  <div class="total">
    <a-modal
      :visible="visible"
      :maskClosable="false"
      :centered="true"
      @ok="handleadd"
      @cancel="handleaddCancel"
      :width='1114'
    >
    <span slot="title">
           <a-tabs defaultActiveKey="1" @change="callback">
            <a-tab-pane tab="发出结算单" key="1">
            </a-tab-pane>
            <a-tab-pane tab="接收结算单" key="0">
            </a-tab-pane>
          </a-tabs>
        </span>
         <coordinate-table :currentPage="current" ref="send" @hideModal='hideModal'></coordinate-table>
    </a-modal>
  </div>
</template>
<script>
import librariesBase from '@views/mixins/libraries_base'
import base from './mixins/base'
// import TopNav from '@/components/tabs/'

import coordinateTable from '@views/settlement/components/CoordinateTable'

export default {
  name: 'coordinatemodal',
  mixins: [librariesBase, base],
  components: {
    coordinateTable
  },
  props: {
    title: {
      type: String,
      default: '添加结算单'
    },
    loading: {
      type: Boolean,
      default () {
        return false
      }
    },
    isShow: {
      type: Boolean,
      default () {
        return false
      }
    },
    type: {
      type: String,
      default: 'send'
    },
    info: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      // config: getBasicFormConfig(this.type),
      visible: this.isShow,
      form: this.$form.createForm(this),
      isSubmit: false,
      current: '1',
      labelCol: { span: 5 },
      wrapperCol: { span: 16 }

    }
  },
  mounted () {
  },
  watch: {
    info: {
      deep: true,
      handler: function (val) {
        this.$nextTick(() => {
          // this.form.setFieldsValue(val)
        })
      }
    }
  },
  computed: {

  },
  methods: {

    // 新增浮层确认事件
    handleadd () {

    },
    showModal () {
      this.visible = true
    },
    closeModal () {
      this.visible = false
    },
    // 新增浮层关闭事件
    handleaddCancel (isRefresh) {
      this.visible = false
      this.$emit('hideForm', isRefresh)
    },
    // 费用详情页
    callback (value) {
      this.current = value
      console.log(value)
      // this.$refs.send.refresh()
    },
    hideModal () {
      // this.visible = false
      this.$emit('hideForm', 3)
    }

  }
}
</script>
<style lang="less" scope>

</style>
