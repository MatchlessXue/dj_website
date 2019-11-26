<template>
  <div class="main">
    <a-form class="user-layout-login"
            ref="formLogin"
            :form="form"
            id="formLogin"
            @submit="handleSubmit">
      <a-tabs :activeKey="customActiveKey"
              :tabBarStyle="{ textAlign: 'center', borderBottom: 'unset' }"
              size="large"
              :animated="false"
              @change="handleTabClick">
        <a-tab-pane key="account"
                    tab="账号密码登录">
          <a-form-item v-if="accountAlertShow"
                       style="margin-bottom: 12px">
            <a-alert :message="accountAlertMsg"
                     type="error"
                     closable
                     @close="handleUserClose"
                     banner />
          </a-form-item>
          <a-form-item>
            <a-input size="large"
                     type="text"
                     placeholder="帐户名或邮箱地址"
                     ref="userNameInput"
                     @change="handleUserNameChange($event)"
                     v-decorator="[
              'username',
              {
                rules: [{ required: true, message: '请输入帐户名或邮箱地址！' }, { validator: handleUsernameOrEmail }]
              }]">
              <a-icon slot="prefix"
                      type="user"
                      :style="{ color: 'rgba(0,0,0,.25)' }" />
              <a-icon v-if="userName" slot="suffix" type="close-circle" @click="emitUserNameEmpty" />
            </a-input>
          </a-form-item>

          <a-form-item>
            <a-input size="large"
                     :type="passwordType"
                     placeholder="密码"
                     @change="handleUserPwdChange"
                     v-decorator="[
              'password',
              {
                rules: [{ required: true, message: '请输入密码'}]
              }]">
              <a-icon slot="prefix"
                      type="lock"
                      :style="{ color: 'rgba(0,0,0,.25)' }" />
              <a-icon slot="suffix"
                      :type="(passwordType === '' || !userPwd) ? 'eye' : 'eye-invisible'"
                      @click="showPassword"
                      :style="{ color: 'rgba(0,0,0,.25)' }" />
            </a-input>
          </a-form-item>
          <!-- <a-row :gutter="16">
            <a-col class="gutter-row"
                   :span="16">
              <a-form-item>
                <a-input size="large"
                         type="text"
                         placeholder="验证码"
                         v-decorator="[
                  'captcha',
                  {
                    rules: [{ required: true, message: '请输入验证码' }]
                  }
                ]">
                  <a-icon slot="prefix"
                          type="mail"
                          :style="{ color: 'rgba(0,0,0,.25)' }" />
                </a-input>
              </a-form-item>
            </a-col>
            <a-col class="gutter-row"
                   :span="8">
              <div>
                <img :src="imgSrc"
                     alt="验证码"
                     width="100%"
                     height="40"
                     @click="refreshCode" />
              </div>
            </a-col>
          </a-row> -->
        </a-tab-pane>
        <a-tab-pane key="phone"
                    tab="手机号登录">
          <a-form-item v-if="phoneAlertVisible"
                       style="margin-bottom: 12px">
            <a-alert message="手机验证码输入错误"
                     type="error"
                     closable
                     @close="handlePhoneClose"
                     banner />
          </a-form-item>
          <a-form-item>
            <a-input size="large"
                     type="text"
                     placeholder="手机号"
                     ref="mobilePhoneInput"
                     @change="handleMobilePhoneChange"
                     v-decorator="[
              'mobile',
              {
                rules: [{ required: true, pattern: /^1[34578]\d{9}$/, message: '请输入正确的手机号' }]
              }]">
              <a-icon slot="prefix"
                      type="mobile"
                      :style="{ color: 'rgba(0,0,0,.25)' }" />
              <a-icon v-if="mobilePhone" slot="suffix" type="close-circle" @click="emitMobilePhoneEmpty" />
            </a-input>
          </a-form-item>

          <a-row :gutter="16">
            <a-col class="gutter-row"
                   :span="16">
              <a-form-item>
                <a-input size="large"
                         type="text"
                         placeholder="验证码"
                         v-decorator="[
                  'vcode',
                  {
                    rules: [{ required: true, message: '请输入验证码' }]
                  }
                ]">
                  <a-icon slot="prefix"
                          type="mail"
                          :style="{ color: 'rgba(0,0,0,.25)' }" />
                </a-input>
              </a-form-item>
            </a-col>
            <a-col class="gutter-row"
                   :span="8">
              <a-button class="getCaptcha"
                        tabindex="-1"
                        :disabled="(state.smsSendBtn || !mobilePhone)"
                        @click.stop.prevent="getCaptcha"
                        v-text="!state.smsSendBtn && '获取验证码' || (state.time+' s')"></a-button>
            </a-col>
          </a-row>
        </a-tab-pane>
      </a-tabs>
      <a-form-item style="margin-top:12px">
        <a-button size="large"
                  type="primary"
                  htmlType="submit"
                  class="login-button"
                  :loading="loginBtn"
                  :disabled="(loginBtn || (!userName && !mobilePhone))">确定</a-button>
      </a-form-item>

      <a-form-item style="margin-top:12px">
        <span>
          <a-checkbox :checked="isUserUsingProtocalClicked" @change="isUserUsingProtocalClicked = !isUserUsingProtocalClicked">已阅读并同意</a-checkbox><a
          @click="handleUserUsingProtocalClick">《用户使用协议》</a>
        </span>
        <br>
        <span>新用户请使用短信登录，系统会自动为您完成注册。</span>
      </a-form-item>
    </a-form>
    <div>
    </div>
  </div>
</template>

<script>
import md5 from 'md5'
import { mapActions, mapGetters } from 'vuex'
// import { imgSrcToDataURL } from 'blob-util'
import { getSmsCaptcha } from '@/api/login'
// import { randomLenNum } from '../../utils/util'
// import baseURL from '@root/baseurl.config'

// import { imgSrcToDataURL } from 'blob-util'
export default {
  components: {},
  data () {
    return {
      phoneAlertVisible: false,
      customActiveKey: 'account',
      isUserUsingProtocalClicked: true,
      loginBtn: false,
      // login type: 0 email, 1 username, 2 telephone
      loginType: 0,
      userName: undefined,
      userPwd: undefined,
      mobilePhone: undefined,
      passwordType: 'password',
      form: this.$form.createForm(this), // :autoFormCreate="(form)=>{this.form = form}",
      state: {
        time: 120,
        smsSendBtn: false
      },
      formLogin: {
        username: '',
        password: '',
        captcha: '', // 图片验证码
        vcode: '', //  手机验证码
        mobile: '',
        type: 0
      },
      randomStr: '',
      imgSrc: ''
    }
  },
  computed: {
    ...mapGetters([
      'accountAlertShow',
      'accountAlertMsg',
      'phoneAlertShow',
      'phoneAlertMsg'
    ])
  },
  created () {
    // this.refreshCode()
  },
  methods: {
    ...mapActions(['Login', 'Logout']),
    handleUserUsingProtocalClick () {
      const url = `/agreement`
      window.open(url)
    },
    handleUserNameChange (event) {
      const value = event.target.value
      this.userName = value
      this.form.setFieldsValue({ username: value })
    },
    handleUserPwdChange (event) {
      const value = event.target.value
      this.userPwd = value
      this.form.setFieldsValue({ password: value })
    },
    handleMobilePhoneChange (event) {
      const value = event.target.value
      this.mobilePhone = value
      this.form.setFieldsValue({ mobile: value })
    },
    emitUserNameEmpty () {
      this.$refs.userNameInput.focus()
      this.form.setFieldsValue({ username: undefined })
      this.userName = undefined
    },
    emitMobilePhoneEmpty () {
      this.$refs.mobilePhoneInput.focus()
      this.form.setFieldsValue({ mobile: undefined })
      this.mobilePhone = undefined
    },
    // 关闭userAlert提示框
    handleUserClose () {
      this.$store.commit('SET_ACCOUNT_ALERT_SHOW', false)
      this.$store.commit('SET_ACCOUNT_ALERT_MSG', '')
    },
    // 关闭phoneAlert提示框
    handlePhoneClose () {
      this.phoneAlertVisible = false
    },
    // refreshCode () {
    //   this.formLogin.captcha = ''
    //   this.randomStr = randomLenNum(4, true)
    //   this.imgSrc = `${baseURL}/authcenter/user/getKaptchaCode?kpatkey=${this.randomStr}`
    //   // this.imgSrc = `http://192.168.1.101:801/user/getKaptchaCode?kpatkey=${this.randomStr}`
    // },
    showPassword () {
      this.passwordType === ''
        ? (this.passwordType = 'password')
        : (this.passwordType = '')
    },
    // handler
    handleUsernameOrEmail (rule, value, callback) {
      const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
      if (regex.test(value)) {
        // 判断登录的类型
        this.loginType = 0
      } else {
        this.loginType = 1
      }
      callback()
    },
    // 切换tabBar
    handleTabClick (key) {
      this.customActiveKey = key
    },
    // 提交表单
    handleSubmit (e) {
      e.preventDefault()
      // 定义登录的参数
      let isLogin = false
      let loginParams = {}
      if (this.customActiveKey === 'account') {
        // 使用账户密码登录
        this.form.validateFields(
          ['username', 'password', 'captcha'],
          { force: true },
          (err, values) => {
            if (!err) {
              isLogin = true
              loginParams.username = values.username
              console.log(md5(values.password))
              loginParams.password = md5(values.password)
              // loginParams.vcode = values.captcha
              // loginParams.kpatkey = this.randomStr
              // loginParams.type = 0
            }
          }
        )
        // this.refreshCode()
      } else {
        // 使用手机号登录
        this.form.validateFields(
          ['mobile', 'vcode'],
          { force: true },
          (err, values) => {
            if (!err) {
              isLogin = true
              loginParams = Object.assign(loginParams, values)
              loginParams.type = 1
            }
          }
        )
      }
      if (!isLogin || !this.isUserUsingProtocalClicked) {
        !this.isUserUsingProtocalClicked && this.$message.warning('请先阅读用户使用协议！')
        return
      }
      this.loginBtn = true
      this.Login(loginParams)
        .then(() => {
          this.loginBtn = false
          this.$router.push({ name: 'dashboard' })
        })
        .catch(() => {
          this.loginBtn = false
        })
    },
    // 获取手机验证码
    getCaptcha (e) {
      e.preventDefault()
      this.form.validateFields(['mobile'], { force: true }, (err, values) => {
        if (!err) {
          this.state.smsSendBtn = true
          const interval = window.setInterval(() => {
            if (this.state.time-- <= 0) {
              this.state.time = 120
              this.state.smsSendBtn = false
              window.clearInterval(interval)
            }
          }, 1000)
          this.formLogin.mobile = values.mobile
          // 发送获取手机验证码请求
          getSmsCaptcha({ mobile: this.formLogin.mobile })
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
              this.requestFailed(err)
            })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.user-layout-login {
  label {
    font-size: 14px;
  }

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }

  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;

    .item-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }
  }
}
</style>
