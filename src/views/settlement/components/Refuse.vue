<template>
  <div class="total">
    <a-modal
      :visible="visible"
      :maskClosable="false"
      :centered="true"
      @ok="handleadd"
      @cancel="handleaddCancel"
      :title="title"
    >
      <a-form>
        <a-form-item >
          <a-input v-model="remark" placeholder="请输入驳回备注" style="height:200px"></a-input>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import base from './mixins/base'
import { mapGetters } from 'vuex'

export default {
  name: 'refuse',
  mixins: [base],
  props: {
    title: {
      type: String,
      default: '驳回原因'
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
    }

  },
  data () {
    return {
      visible: this.isShow,
      form: this.$form.createForm(this),
      remark: ''

    }
  },
  mounted () {

  },
  watch: {

    isShow (val) {
      this.visible = val
    },
    getRefuseId: {
      handler: function (val) {

      }
    }
  },
  computed: {
    ...mapGetters('settlement',
      ['getRefuseId']
    )
  },
  methods: {
    // 新增浮层确认事件
    handleadd () {
      let myParams = {
        coopStatus: '104',
        documentId: this.getRefuseId,
        coopRemark: this.remark
      }

      this.pageConfig.updateCoordinateList(myParams).then(res => {
        console.log(res)
      })
    },
    // 新增浮层关闭事件
    handleaddCancel (isRefresh) {
      this.visible = false
      this.$emit('hideForm', isRefresh)
    },
    showModal () {
      this.visible = true
    }

  }
}
</script>
<style lang="less" scope>

</style>
