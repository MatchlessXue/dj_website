<template>
  <div class="user-wrapper">
    <span class="action">
      <a-input v-model="queryData" placeholder="请输入运单号或客户单号" style="width: 272px;border-radius:16px;" @search="inquireClick"/>
    </span>
    <span class="action">
      <a-button @click.stop.prevent="inquireClick" type="primary">查询</a-button>
    </span>
    <span class="action">
      <a @click.stop.prevent="handleHelpClick">
        <a-icon type="question-circle-o"></a-icon>
      </a>
    </span>
    <!-- <header-notice class="action" /> -->
    <update-pwd ref="updatePwd"
                :uppwdModalvisible='uppwdModalvisible'
                @handleUpPwdclose='handleUpPwdclose' />
    <a-dropdown>
      <span class="action ant-dropdown-link user-dropdown-menu">
        <a-avatar class="avatar"
                  size="small"
                  :src="avatar()" />
        <span>{{ nickname() }}</span>
      </span>
      <a-menu slot="overlay"
              class="user-dropdown-menu-wrapper">
        <a-menu-item key="0">
          <router-link :to="{ name: 'center' }">
            <a-icon type="user" />
            <span>个人中心</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="1">
          <router-link :to="{ name: 'settings' }">
            <a-icon type="setting" />
            <span>账户设置</span>
          </router-link>
        </a-menu-item>
        <a-menu-item key="2"
                     v-if='!this.authRequired'>
          <a href="javascript:;"
             @click="handleUpPwdOpen">
            <a-icon type="key" />
            <span>修改密码</span>
          </a>
        </a-menu-item>
        <!-- <a-menu-item key="3"
                     disabled>
          <a-icon type="setting" />
          <span>测试</span>
        </a-menu-item> -->
        <a-menu-divider />
        <a-menu-item key="4">
          <a href="javascript:;"
             @click="handleLogout">
            <a-icon type="logout" />
            <span>退出登录</span>
          </a>
        </a-menu-item>
      </a-menu>
    </a-dropdown>
  </div>
</template>

<script>
import HeaderNotice from './HeaderNotice'
import { mapActions, mapGetters } from 'vuex'
import updatePwd from '@/components/user/updatePwd'
import { getReceiptList1 } from '@/api/track/track.js'

// authRequired
export default {
  name: 'UserMenu',
  data () {
    return {
      queryData: '',
      uppwdModalvisible: false
    }
  },
  components: {
    HeaderNotice,
    updatePwd
  },
  computed: {
    ...mapGetters(['authRequired'])
  },
  // created () {
  //   // 获取厂商列表
  //   console.log('authRequired', this.authRequired)
  // },
  methods: {
    // 查询
    inquireClick() {
      if (this.queryData === '') return false
      getReceiptList1( {page: 1, pageSize: 10, globalSearch: this.queryData }).then(res => {
          if (res.data.records.length > 0){
            this.$router.push({
              name: 'AbnormalList',
              params: { id: this.queryData }
            })
          } else {
            this.$message.info('跟踪不到此运单')
          }
      }).catch(error => {
        this.$message.fail('系统异常，请联系管理员')
      })
    },
    // 处理帮助图标点击事件
    handleHelpClick () {
      const { href } = this.$router.resolve({
        name: 'ManualWorkbench',
        params: {
        }
      })
      window.open(href, '_blank')
    },
    // 弹出密码修改窗口
    handleUpPwdOpen () {
      console.log(this.authRequired)
      this.uppwdModalvisible = true
    },
    // 关闭密码修改窗口
    handleUpPwdclose () {
      this.uppwdModalvisible = false
    },
    ...mapActions(['Logout']),
    ...mapGetters(['nickname', 'avatar']),
    handleLogout () {
      const that = this

      this.$confirm({
        title: '提示',
        content: '真的要注销登录吗 ?',
        onOk () {
          return that.Logout({}).then(() => {
            window.location.reload()
          }).catch(err => {
            that.$message.error({
              title: '错误',
              description: err.message
            })
          })
        },
        onCancel () {
        }
      })
      // 前端登出系统
      // this.$store.dispatch('FedLogOut').then(() => { // 前端退出
      //   window.location.reload()
      // })
    }

  }
}
</script>

<style scoped>
</style>
