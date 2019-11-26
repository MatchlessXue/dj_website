import EmployerAuthCommon from '@/views/account/EmployerAuthCommon'
import EmployerAuthModal from '@/views/account/EmployerAuthModal'
export const stepsToggle = {
  data () {
    return {
      steps: [{
        title: '完善信息',
        content: '完善信息',
        status: 'process'
      },
      {
        title: '审核中',
        content: '审核中',
        status: 'wait'
      },
      {
        title: '认证完成',
        content: '认证完成',
        status: 'wait'
      }
      ],
      isModalShow: false,
      modalHeading: ''
    }
  },
  components: {
    EmployerAuthCommon,
    EmployerAuthModal
  },
  computed: {
    layoutStyle () {
      return {
        'margin-bottom': '0px',
        'padding-bottom': '0px'
      }
    },
    needDisplayDoAuthBtn () {
      return this.userinfo.verifiedStatus === undefined || this.userinfo.verifiedStatus === 1
    }
  },
  methods: {
    employerAuth () {
      this.modalHeading = '企业认证'
      this.isModalShow = true
    },
    modalCancel (e) {
      console.log('modalCancel', e)
      this.isModalShow = false // 关闭浮层
      // 清空表单信息
      this.$refs.employerAuthForm.handleclose()
    },
    modalAddConfirm (record) {
      this.getInfoMap()
      console.log('modalAddConfirm(record):', record)
      this.isModalShow = false // 关闭浮层
      this.$message.success('提交成功,审核认证中。')
    },
    getTipTextFontSize (multiple) {
      return {
        'font-size': multiple + 'em'
      }
    },
    getRowBottomMargin (multiple) {
      return {
        'margin-bottom': multiple + 'px'
      }
    }
  }
}
