<template>
  <a-modal title="重置密码"
           centered
           :visible="visible"
           @ok="handleUpPwdSub"
           @cancel="handleUpPwdCancel">
    <a-form @submit="handleUpPwdSub"
            :form="form"
            class="form">
      <a-form-item label="当前密码"
                   :help="tips"
                   :labelCol="labelCol"
                   :wrapperCol="wrapperCol">
        <a-input v-decorator="['currentPassword',{
            rules: [{ required: true, message: '请输入当前密码!'},{max: 20,message:tips},{min: 6,message:tips},
              {validator: validatePWD}]}]"
                 maxlength="20"
                 minlength="6"
                 :type="passwordType"
                 placeholder="请输入当前密码">
          <a-icon slot="suffix"
                  type="eye"
                  @click="showPassword"
                  :style="{ color: 'rgba(0,0,0,.25)' }" />
        </a-input>
      </a-form-item>
      <a-form-item label="新密码"
                   :labelCol="labelCol"
                   :wrapperCol="wrapperCol">
        <a-input v-decorator="['newPassword',{
            rules: [{ required: true, message: '请输入新密码!' },{max: 20,message:tips},{min: 6,message:tips},
              {validator: validatePWD}]}]"
                 maxlength="20"
                 minlength="6"
                 :type="passwordType"
                 placeholder="请输入新密码"
                 :visibilityToggle="true"
                 @change="onChange">
          <a-icon slot="suffix"
                  type="eye"
                  @click="showPassword"
                  :style="{ color: 'rgba(0,0,0,.25)' }" />
        </a-input>
        <a-row>
          <a-col :xs="8">
            密码强度：
          </a-col>
          <a-col :xs="16">
            <a-tooltip>
              <a-progress :percent="pwdstate.percent"
                          :successPercent="pwdstate.successPercent"
                          :status="pwdstate.status"
                          :showInfo=false />
            </a-tooltip>
          </a-col>
        </a-row>
      </a-form-item>
      <a-form-item label="确认新密码"
                   :labelCol="labelCol"
                   :wrapperCol="wrapperCol">
        <a-input v-decorator="['confirmPassword',{
            rules: [{ required: true, message: '请输入新密码!' },{max: 20,message:tips},{min: 6,message:tips},
              {validator: validatePWD}]}]"
                 maxlength="20"
                 minlength="6"
                 :type="passwordType"
                 placeholder="请输入新密码">
          <a-icon slot="suffix"
                  type="eye"
                  @click="showPassword"
                  :style="{ color: 'rgba(0,0,0,.25)' }" />
        </a-input>
      </a-form-item>
    </a-form>

  </a-modal>
</template>

<script>
import { modifyPassword } from '@/api/account.js'
import { validatePWD } from '@/utils/validate'
import { getInfo } from '@/api/login'
import md5 from 'md5'
export default {
  name: 'updatePwd',
  props: {
    uppwdModalvisible: {
      type: Boolean,
      default () {
        return false
      }
    }
  },
  watch: {
    uppwdModalvisible: {
      deep: true,
      handler: function (val) {
        this.visible = val
      }
    }
  },
  data () {
    return {
      pwdstate: { // 验证密码强度
        percent: 33,
        status: 'exception'
      },
      visible: false,
      validatePWD,
      passwordType: 'password', // 是否显示密码
      form: this.$form.createForm(this),
      labelCol: { span: 5 },
      wrapperCol: { span: 16, offset: 1 },
      tips: '6-20个字符，数字，下划线，减号，区分大小写'
    }
  },
  methods: {
    // 浮层关闭事件
    handleUpPwdCancel () {
      // 关闭浮层
      this.$emit('handleUpPwdclose')
      // 清空表单信息
      this.form.resetFields()
    },
    // 提交
    handleUpPwdSub (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          values.currentPassword = md5(values.currentPassword)
          values.newPassword = md5(values.newPassword)
          values.confirmPassword = md5(values.confirmPassword)
          this.modifyPasswordMap(values).then(res => {
            if (res.code === 0) {
              this.$message.success('修改成功')
              this.form.resetFields()
              this.$emit('handleUpPwdclose')
            }
          })
        }
      })
    },
    /**
     * 获取用户信息
     */
    getInfoMap () {
      return getInfo().then(res => {
        this.userinfo = res.data
      })
    },
    /**
     * 验证密码强度
     */
    onChange (e) {
      var val = e.target.defaultValue
      var strongRegex = new RegExp('^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[-_]).*$', 'g')
      var mediumRegex = new RegExp('^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$', 'g')
      var enoughRegex = new RegExp('(?=.{6,}).*', 'g')
      if (enoughRegex.test(val) === false) {
        // 密码小于六位的时候，强度也是弱的
        this.pwdstate.percent = 33
        this.pwdstate.status = 'exception'
      } else if (strongRegex.test(val)) {
        // 密码为八位及以上并且字母数字特殊字符三项都包括,强度最强
        this.pwdstate.percent = 100
        this.pwdstate.status = 'success'
      } else if (mediumRegex.test(val)) {
        // 密码为七位及以上并且字母、数字、特殊字符三项中有两项，强度是中等
        this.pwdstate.percent = 66
        this.pwdstate.status = ''
      } else {
        // 如果密码为6为及以下，就算字母、数字、特殊字符三项都包括，强度也是弱的
        this.pwdstate.percent = 33
        this.pwdstate.status = 'exception'
      }
    },
    showPassword () {
      this.passwordType === ''
        ? (this.passwordType = 'password')
        : (this.passwordType = '')
    },
    /**
     * 修改密码
     */
    modifyPasswordMap (values) {
      return modifyPassword(values).then(res => {
        return res
      }).catch(res => {
        return res
      })
    }
  }
}
</script>
