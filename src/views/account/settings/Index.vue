<style>
.ant-form-item {
  margin-bottom: 10px;
}
</style>
<template>
  <div>
    <a-card :bordered="false"
            class="content-layout">
      <div>
        <h1>用户信息</h1>
        <a-row>
          <a-col :xs="16">
            <p>
              你当前的手机号是
              <span style="color:red">{{loginMobile}}</span>，修改手机号时系统会发送验证码到新的手机号上，请输入验证码完成修改
            </p>
          </a-col>
          <a-col :xs="8">
            <a @click="handleEdit()"
               style="font-size:16px">去修改</a>
          </a-col>
        </a-row>
      </div>
      <div>
        <a-row :hidden="newMobilehidden">
          <a-col :xs="8">
            <a-form class="user-layout-login"
                    :form="form"
                    @submit="handleSubmit">
              <a-form-item>
                <a-input addonBefore="中国 +86"
                         v-decorator="['newMobile',{
            rules: [{ required: true, message: '请输入新的手机号码!'},
              {validator: validatePhoneNumber}]} ]"
                         maxlength="11"
                         placeholder="请输入新的手机号码" />
              </a-form-item>
              <a-form-item>
                <a-row>
                  <a-col :xs="16">
                    <a-input v-decorator="['vcode',{
            rules: [{ required: true, message: '请输入验证码!' }]} ]"
                             maxlength="6"
                             placeholder="请输入验证码" />
                  </a-col>
                  <a-col :xs="8">
                    <a-button :disabled="state.smsSendBtn"
                              @click.stop.prevent="getCaptcha"
                              type="primary"
                              v-text="!state.smsSendBtn && '获取验证码' || (state.time+' s')"></a-button>
                  </a-col>
                </a-row>
              </a-form-item>
              <a-form-item>
                <a-button type="primary"
                          size="large"
                          block
                          @click.stop.prevent="handleSubmit">提交</a-button>
              </a-form-item>
            </a-form>
          </a-col>
        </a-row>
      </div>
    </a-card>

    <employer-auth-common class="employerAuthCardClass">
      <h1 slot="employerAuthCardHeading">企业信息</h1>
      <div v-if="needDisplayDoAuthBtn || userinfo.verifiedStatus==2">
        <a-col :lg="12"
               :md="12"
               :sm="12">
          <a-steps :current="userinfo.verifiedStatus - 1">
            <a-step v-for="item in steps"
                    :key="item.title"
                    :title="item.title" />
          </a-steps>
        </a-col>
        <a-col :offset="4"
               :lg="4"
               :md="4"
               :sm="4"
               :style="layoutStyle">
          <h3><a v-if="needDisplayDoAuthBtn"
               @click="employerAuth()">去认证</a></h3>
        </a-col>
      </div>
      <div v-if="userinfo.verifiedStatus==4">
        <a-col :lg="12"
               :md="12"
               :sm="12">
          <span>
            企业信息
            <span style="color:#1890FF">{{userinfo.approvalNote}}</span>
          </span>
        </a-col>
        <a-col :offset="4"
               :lg="4"
               :md="4"
               :sm="4"
               :style="layoutStyle">
          <a @click="employerAuth()"
             style="font-size:16px">去修改</a>
        </a-col>
      </div>
      <div v-if="userinfo.verifiedStatus==3">
        <a-col :lg="6"
               :md="6"
               :sm="6">
          <h3>公司名称</h3>
        </a-col>
        <a-col :lg="18"
               :md="18"
               :sm="18"
               :style="layoutStyle">
          <h3>{{userinfo.companyName || '上海点觉信息技术有限公司'}}</h3>
        </a-col>
        <a-col :lg="6"
               :md="6"
               :sm="6">
          <h3>有效时间</h3>
        </a-col>
        <a-col :lg="18"
               :md="18"
               :sm="18"
               :style="layoutStyle">
          <h3> {{userinfo.startDate}} 至 {{userinfo.endDate}}</h3>
        </a-col>
        <a-col :lg="6"
               :md="6"
               :sm="6">
          <h3>公司Logo</h3>
        </a-col>
        <a-col :lg="18"
               :md="18"
               :sm="18"
               :style="layoutStyle">
          <img :src="userinfo.logoUrl"
               class="codeimg" />

          <!-- <a-form-item>
            <a-input type="hidden"
                     v-decorator="['certUrl']" />
          </a-form-item> -->
          <a-upload :action="uploadPictureUrl"
                    :showUploadList="showUploadList"
                    @change="handleChange">
            <!-- <div v-if="fileList.length < 1">
              <a-icon type="plus" />
            </div> -->
            <!-- <div class="ant-upload-text">上传公司Logo</div> -->
            <a-button>
              <a-icon type="upload" /> 上传公司Logo
            </a-button>
          </a-upload>
          <!-- <a-modal :visible="previewVisible"
                   :footer="null"
                   @cancel="handleCancel">
            <img alt="example"
                 style="width: 100%"
                 :src="previewImage">
          </a-modal> -->
        </a-col>
      </div>
    </employer-auth-common>

    <employer-auth-modal :visible="isModalShow"
                         :heading="modalHeading"
                         ref="employerAuthForm"
                         @onCancel="modalCancel($event)"
                         @onOkForSubmit="modalAddConfirm($event)"
                         :userinfo="userinfo"></employer-auth-modal>
  </div>
</template>
<script>
import { getInfo } from '@/api/login'
import { getupdateMobileSendMsg, modifyMobile } from '@/api/account'
import { stepsToggle } from '@/mixins/account/stepsToggle'
import { validatePhoneNumber } from '@/utils/validate'
import EmployerAuthBus from '@/mixins/account/employerAuthBus'
import { getCompanyUpdatelogo } from '@/api/account.js'
import { getUploadPictureUrl } from '@/api/common'
import fileBase from '@views/mixins/file_base'
import moment from 'moment'
export default {
  data () {
    return {
      userinfo: {},
      // companyInfo: {},
      state: {
        smsSendBtn: false,
        time: 120
      },
      fileList: [],
      uploadPictureUrl: getUploadPictureUrl(), // 上传图片
      loginMobile: '',
      validatePhoneNumber,
      newMobile: '',
      newMobilehidden: true,
      vcode: '',
      form: this.$form.createForm(this),
      previewVisible: false,
      showUploadList: false,
      previewImage: ''
    }
  },
  mixins: [stepsToggle, fileBase],
  created () {
    // 获取用户信息
    this.getInfoMap()
  },
  updated: function () {
    var vm = this
    // 用$on事件来接收参数
    EmployerAuthBus.$on('userinfoForCenter', data => {
      console.log("EmployerAuthBus.$on('userinfoForCenter', data:setting", data)
      vm.userinfo = data
    })
  },
  methods: {
    handleChange ({ file, fileList }) {
      if (fileList && fileList[0].response && fileList[fileList.length - 1].response) {
        // console.log(fileList.length)
        // console.log(fileList[fileList.length - 1])
        // console.log(fileList[fileList.length - 1].response.data)
        getCompanyUpdatelogo({ companyId: this.userinfo.companyId, logoUrl: fileList[fileList.length - 1].response.data }).then(res => {
          if (res.code === 0) {
            this.$message.success('修改成功')
            this.userinfo.logoUrl = fileList[fileList.length - 1].response.data
          }
        })
        // this.fileList = []
      }
      this.fileChange(file, fileList, 'certUrl', 'fileList')
    },
    beforeUpload (file) {
      const isJPG =
        ['image/jpeg', 'image/png', 'image/bmp'].indexOf(file.type) > -1
      if (!isJPG) {
        this.tipMessage = '只能上传jpg、png、bmp格式的图片!'
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.tipMessage = '上传图片不能大于2M!'
      }
      return isJPG && isLt2M
    },
    // 提交
    handleSubmit (e) {
      this.form.validateFields((err, values) => {
        if (!err) {
          modifyMobile(values).then(res => {
            if (res.code === 0) {
              this.$message.success('修改成功')
              this.form.resetFields()
              this.state.time = 120
              this.state.smsSendBtn = false
              this.newMobilehidden = true
              this.getInfoMap()
            }
          })
        }
      })
    },
    handleEdit () {
      this.newMobilehidden = false
    },
    // 获取手机验证码
    getCaptcha (e) {
      e.preventDefault()
      this.form.validateFields(
        ['newMobile'],
        { force: true },
        (err, values) => {
          if (!err) {
            this.state.smsSendBtn = true
            const interval = window.setInterval(() => {
              if (this.state.time-- <= 0) {
                this.state.time = 120
                this.state.smsSendBtn = false
                window.clearInterval(interval)
              }
            }, 1000)
            // 发送获取手机验证码请求
            getupdateMobileSendMsg({ mobile: values.newMobile })
              .then(res => {
                const data = res.data
                console.log('======手机号验证码1=======')
                console.log(data)
                console.log('======手机号验证码2=======')
                this.listLoading = false
              })
              .catch(err => {
                clearInterval(interval)
                this.state.time = 120
                this.state.smsSendBtn = false
                console.log('getupdateMobileSendMsg>err', err)
                // this.$message.error(err.message)
              })
          }
        }
      )
    },
    /**
     * 获取用户信息
     */
    getInfoMap () {
      return getInfo().then(res => {
        this.userinfo = res.data
        this.current = this.userinfo.verifiedStatus - 1
        EmployerAuthBus.$emit('userinfoForSetting', this.userinfo)
        if (this.userinfo && this.userinfo.loginMobile) {
          this.loginMobile =
            this.userinfo.loginMobile.substr(0, 3) +
            '****' +
            this.userinfo.loginMobile.substr(8, 3)
        } else {
          this.loginMobile = '未设置'
        }

        console.log('res', res)
        // getCompanyDetail({ companyId: res.data.tenantId }).then(res2 => {
        //   console.log('res2', res2)
        //   this.companyInfo = res2.data
        //   // res.data.ValDate = [moment(res.data.startDate, 'YYYY-MM-DD'), moment(res.data.endDate, 'YYYY-MM-DD')]
        //   // if (res.data.businessEndDate) { res.data.businessEndDateval = moment(res.data.businessEndDate, 'YYYY-MM-DD') }
        //   // if (res.data.registerTime) { res.data.registerTimeval = moment(res.data.registerTime, 'YYYY-MM-DD') }
        //   if (res.data.endDate) { res.data.endDate = moment(res.data.endDate).format('YYYY-MM-DD HH:mm') }
        //   if (res.data.startDate) { res.data.startDate = moment(res.data.startDate).format('YYYY-MM-DD HH:mm') }
        //   // this.form.setFieldsValue(res.data)
        //   // return res.data
        // })
      })
    }
  }
}
</script>

<style scoped>
.employerAuthCardClass {
  margin-top: 30px;
}
.codeimg {
  width: 100px;
  vertical-align: initial;
}
/* .ant-upload-list-item-actions {
  display: none;
} */
</style>
