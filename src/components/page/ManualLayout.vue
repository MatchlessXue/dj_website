<template>
  <a-layout class="layout"
            :class="[device]">
    <template v-if="isSideMenu()">
      <a-drawer v-if="isMobile()"
                :wrapClassName="'drawer-sider ' + navTheme"
                :closable="false"
                :visible="collapsed"
                placement="left"
                @close="() => this.collapsed = false">
        <side-menu :menus="menus"
                   :theme="navTheme"
                   :collapsed="false"
                   :collapsible="true"
                   mode="inline"
                   @menuSelect="menuSelect"></side-menu>
      </a-drawer>

      <side-menu v-else
                 mode="inline"
                 :menus="menus"
                 :theme="navTheme"
                 :collapsed="collapsed"
                 :collapsible="true"></side-menu>
    </template>
    <!-- 下次优化这些代码 -->
    <template v-else>
      <a-drawer v-if="isMobile()"
                :wrapClassName="'drawer-sider ' + navTheme"
                placement="left"
                @close="() => this.collapsed = false"
                :closable="false"
                :visible="collapsed">
        <side-menu :menus="menus"
                   :theme="navTheme"
                   :collapsed="false"
                   :collapsible="true"
                   mode="inline"
                   @menuSelect="menuSelect"></side-menu>
      </a-drawer>
    </template>

    <a-layout :class="[layoutMode, `content-width-${contentWidth}`]"
              :style="{ paddingLeft: contentPaddingLeft, minHeight: '100vh' }">
      <!-- layout header -->
      <!--<global-header-->
      <!--:mode="layoutMode"-->
      <!--:menus="menus"-->
      <!--:theme="navTheme"-->
      <!--:collapsed="collapsed"-->
      <!--:device="device"-->
      <!--@toggle="toggle"-->
      <!--/>-->

      <!-- layout content -->
      <a-layout-content :style="{ margin: '10px 10px 0', height: '100%', paddingTop: fixedHeader ? '64px' : '0' }">
        <slot></slot>
      </a-layout-content>

      <!-- layout footer -->
      <a-layout-footer style="padding: 0">
        <global-footer />
      </a-layout-footer>
      <!-- <setting-drawer></setting-drawer> -->
    </a-layout>
  </a-layout>
</template>

<script>
import ManualSideMenu from '@/components/menu/ManualSideMenu'
// import GlobalHeader from '@/components/page/GlobalHeader'
import GlobalFooter from '@/components/page/GlobalFooter'
import { triggerWindowResizeEvent } from '@/utils/util'
// import { mapState, mapActions } from 'vuex'
import { mixin, mixinDevice } from '@/utils/mixin.js'

export default {
  name: 'ManualLayout',
  components: {
    SideMenu: ManualSideMenu,
    // GlobalHeader,
    GlobalFooter
  },
  mixins: [mixin, mixinDevice],
  data () {
    const manualMenus = [
      // {
      //   id: '01',
      //   name: '工作台',
      //   children: []
      // },
      {
        id: '02',
        name: '用户中心',
        routeName: 'ManualUserCenter',
        children: [
          {
            id: '0201',
            name: '企业认证',
            routeName: 'ManualEmployerAuth',
            children: []
          },
          {
            id: '0202',
            name: '企业信息',
            routeName: 'ManualEmployerInfo',
            children: []
          }]
      },
      {
        id: '03',
        name: '系统管理',
        routeName: 'ManualSystemManagement',
        children: [
          {
            id: '0301',
            name: '新增角色',
            routeName: 'ManualAddRole',
            children: []
          },
          {
            id: '0302',
            name: '新增部门',
            routeName: 'ManualAddDepartment',
            children: []
          },
          {
            id: '0303',
            name: '新增账号',
            routeName: 'ManualAddAccount',
            children: []
          }]
      },
      {
        id: '04',
        name: '资源管理',
        routeName: 'ManualResourceManagement',
        children: [
          {
            id: '0401',
            name: '新增客户',
            routeName: 'ManualAddCustomer',
            children: []
          },
          {
            id: '0402',
            name: '新增承运商',
            routeName: 'ManualAddCarrier',
            children: []
          },
          {
            id: '0403',
            name: '新增服务商',
            routeName: 'ManualAddFacilitator',
            children: []
          },
          {
            id: '0404',
            name: '新增司机',
            routeName: 'ManualAddDriver',
            children: []
          },
          {
            id: '0405',
            name: '新增车辆',
            routeName: 'ManualAddVehicle',
            children: []
          },
          {
            id: '0406',
            name: '新增货物',
            routeName: 'ManualAddCargo',
            children: []
          },
          {
            id: '0407',
            name: '新增合同',
            routeName: 'ManualAddContract',
            children: []
          },
          {
            id: '0408',
            name: '新增价格',
            routeName: 'ManualAddPrice',
            children: []
          },
          {
            id: '0409',
            name: '新增GPS设备',
            routeName: 'ManualAddGPSEquipment',
            children: []
          },
          {
            id: '0410',
            name: '新增发货方',
            routeName: 'ManualAddSender',
            children: []
          },
          {
            id: '0411',
            name: '新增收货方',
            routeName: 'ManualAddReceiver',
            children: []
          },
          {
            id: '0412',
            name: '新增中转站',
            routeName: 'ManualAddFreightStation',
            children: []
          }]
      },
      {
        id: '05',
        name: '订单管理',
        routeName: 'ManualOrderManagement',
        children: [
          {
            id: '0501',
            name: '新增订单',
            routeName: 'ManualAddOrder',
            children: []
          }]
      },
      {
        id: '06',
        name: '运单管理',
        routeName: 'WaybillManagement',
        children: [
          {
            id: '0601',
            name: '修改运单',
            routeName: 'ManualUpdateWaybill',
            children: []
          }]
      },
      {
        id: '07',
        name: '调度管理',
        routeName: 'ManualDispatchManagement',
        children: [
          {
            id: '0701',
            name: '线路调度',
            routeName: 'ManualLineRoadDispatch',
            children: []
          },
          {
            id: '0702',
            name: '查看调度单',
            routeName: 'ManualLookAtDispatch',
            children: []
          }]
      },
      {
        id: '08',
        name: '跟踪管理',
        routeName: 'TrackingManagement',
        children: [
          {
            id: '0801',
            name: '在途跟踪',
            routeName: 'ManualOnWayTracking',
            children: []
          }]
      },
      {
        id: '09',
        name: '回单管理',
        routeName: 'ManualReceiptManagement',
        children: [
          {
            id: '0901',
            name: '登记回单',
            routeName: 'ManualRegisterReceipt',
            children: []
          },
          {
            id: '0902',
            name: '收货人签收',
            routeName: 'ManualSenderSigning',
            children: []
          },
          {
            id: '0903',
            name: '回单寄出',
            routeName: 'ManualReceiptOut',
            children: []
          },
          {
            id: '0904',
            name: '货主签收',
            routeName: 'ManualConsignorSigning',
            children: []
          }]
      },
      {
        id: '10',
        name: '结算管理',
        routeName: 'ManualSettlementManagement',
        children: [
          {
            id: '1001',
            name: '客户结算',
            routeName: 'ManualCustomerSettlement',
            children: []
          },
          {
            id: '1002',
            name: '司机结算',
            routeName: 'ManualDriverSettlement',
            children: []
          },
          {
            id: '1003',
            name: '承运商结算',
            routeName: 'ManualCarrierSettlement',
            children: []
          }]
      }
    ]
    return {
      collapsed: false,
      menus: manualMenus
    }
  },
  computed: {
    // ...mapState({
    //   // 主路由
    //   mainMenu: state => state.permission.addRouters
    // }),
    contentPaddingLeft () {
      if (!this.fixSidebar || this.isMobile()) {
        return '0'
      }
      if (this.sidebarOpened) {
        return '256px'
      }
      return '80px'
    }
  },
  watch: {
    sidebarOpened (val) {
      console.log('sidebarOpened', val)
      this.collapsed = !val
    }
  },
  created () {
    // this.menus = this.mainMenu.find((item) => item.path === '/').children
    this.collapsed = !this.sidebarOpened
  },
  methods: {
    // ...mapActions(['setSidebar']),
    toggle () {
      this.collapsed = !this.collapsed
      this.setSidebar(!this.collapsed)
      triggerWindowResizeEvent()
    },
    paddingCalc () {
      let left = ''
      if (this.sidebarOpened) {
        left = this.isDesktop() ? '256px' : '80px'
      } else {
        left = (this.isMobile() && '0') || ((this.fixSidebar && '80px') || '0')
      }
      console.log('left', left)
      return left
    },
    menuSelect () {
      if (!this.isDesktop()) {
        this.collapsed = false
      }
    }
  }
}
</script>

<style lang="less">
body {
  // 打开滚动条固定显示
  overflow-y: scroll;

  &.colorWeak {
    filter: invert(80%);
  }
}

.layout.ant-layout {
  overflow-x: hidden;
  .ant-layout-content {
    .hide-form-item {
      margin: 0;
      height: 0;
      display: block !important;
    }
  }

  &.mobile,
  &.tablet {
    .ant-layout-content {
      .content {
        margin: 24px 0 0;
      }
    }

    /**
       * ant-table-wrapper
       * 覆盖的表格手机模式样式，如果想修改在手机上表格最低宽度，可以在这里改动
       */
    .ant-table-wrapper {
      .ant-table-content {
        overflow-y: auto;
      }
      // .ant-table-body {
      //   // min-width: 800px;
      // }
    }
    .topmenu {
      /* 必须为 topmenu  才能启用流式布局 */
      &.content-width-Fluid {
        .header-index-wide {
          margin-left: 0;
        }
      }
    }
  }

  &.mobile {
    .sidemenu {
      .ant-header-fixedHeader {
        &.ant-header-side-opened,
        &.ant-header-side-closed {
          width: 100%;
        }
      }
    }
  }

  &.ant-layout-has-sider {
    flex-direction: row;
  }

  .trigger {
    font-size: 20px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;
    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .topmenu {
    .ant-header-fixedHeader {
      position: fixed;
      top: 0;
      right: 0;
      z-index: 9;
      width: 100%;
      transition: width 0.2s;

      &.ant-header-side-opened {
        width: 100%;
      }

      &.ant-header-side-closed {
        width: 100%;
      }
    }
    /* 必须为 topmenu  才能启用流式布局 */
    &.content-width-Fluid {
      .header-index-wide {
        max-width: unset;
        margin-left: 24px;
      }

      .page-header-index-wide {
        max-width: unset;
      }
    }
  }

  .sidemenu {
    .ant-header-fixedHeader {
      position: fixed;
      top: 0;
      right: 0;
      z-index: 9;
      width: 100%;
      transition: width 0.2s;

      &.ant-header-side-opened {
        width: calc(100% - 256px);
      }

      &.ant-header-side-closed {
        width: calc(100% - 80px);
      }
    }
  }

  .header {
    height: 64px;
    padding: 0 12px 0 0;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    position: relative;
  }

  .header,
  .top-nav-header-index {
    .user-wrapper {
      float: right;
      height: 100%;

      .action {
        cursor: pointer;
        padding: 0 12px;
        display: inline-block;
        transition: all 0.3s;
        height: 100%;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }

        .avatar {
          margin: 20px 8px 20px 0;
          color: #1890ff;
          background: hsla(0, 0%, 100%, 0.85);
          vertical-align: middle;
        }

        .icon {
          font-size: 16px;
          padding: 4px;
        }
      }
    }

    &.dark {
      .user-wrapper {
        .action {
          color: rgba(255, 255, 255, 0.85);

          &:hover {
            background: rgba(255, 255, 255, 0.16);
          }
        }
      }
    }
  }

  &.mobile,
  &.tablet {
    .top-nav-header-index {
      .header-index-wide {
        .header-index-left {
          .trigger {
            color: rgba(255, 255, 255, 0.85);
            padding: 0 12px;
          }

          .logo.top-nav-header {
            text-align: center;
            width: 56px;
            line-height: 58px;
          }
        }
      }

      &.light {
        .header-index-wide {
          .header-index-left {
            .trigger {
              color: rgba(0, 0, 0, 0.65);
            }
          }
        }
        //
      }
    }
  }

  &.tablet {
    // overflow: hidden; text-overflow:ellipsis; white-space: nowrap;
    .top-nav-header-index {
      .header-index-wide {
        .header-index-left {
          .logo > a {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
  }

  .top-nav-header-index {
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    position: relative;
    transition: background 0.3s, width 0.2s;

    .header-index-wide {
      max-width: 1200px;
      margin: auto;
      padding-left: 0;
      display: flex;
      height: 64px;

      .ant-menu.ant-menu-horizontal {
        border: none;
        height: 64px;
        line-height: 64px;
      }

      .header-index-left {
        flex: 1 1;
        display: flex;

        .logo.top-nav-header {
          width: 165px;
          height: 64px;
          position: relative;
          line-height: 64px;
          transition: all 0.3s;
          overflow: hidden;

          img {
            display: inline-block;
            vertical-align: middle;
            height: 32px;
          }

          h1 {
            color: #fff;
            display: inline-block;
            vertical-align: top;
            font-size: 16px;
            margin: 0 0 0 12px;
            font-weight: 400;
          }
        }
      }

      .header-index-right {
        float: right;
        height: 64px;
        overflow: hidden;
      }
    }

    &.light {
      background-color: #fff;

      .header-index-wide {
        .header-index-left {
          .logo {
            h1 {
              color: #002140;
            }
          }
        }
      }
    }
  }

  // 内容区
  .layout-content {
    margin: 24px 24px 0px;
    height: 100%;
    height: 64px;
    padding: 0 12px 0 0;
  }
}

.topmenu {
  .page-header-index-wide {
    max-width: 1200px;
    margin: 0 auto;
  }
}

// drawer-sider 自定义
.ant-drawer.drawer-sider {
  .sider {
    box-shadow: none;
  }

  &.dark {
    .ant-drawer-content {
      background-color: rgb(0, 21, 41);
    }
  }
  &.light {
    box-shadow: none;
    .ant-drawer-content {
      background-color: #fff;
    }
  }

  .ant-drawer-body {
    padding: 0;
  }
}

// 菜单样式
.sider {
  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
  position: relative;
  z-index: 10;

  .ant-layout-sider-children {
    overflow-y: auto;
  }

  &.ant-fixed-sidemenu {
    position: fixed;
    height: 100%;
  }

  .logo {
    height: 64px;
    position: relative;
    line-height: 64px;
    padding-left: 24px;
    -webkit-transition: all 0.3s;
    transition: all 0.3s;
    background: #002140;
    overflow: hidden;

    img,
    h1 {
      display: inline-block;
      vertical-align: middle;
    }

    img {
      height: 32px;
    }

    h1 {
      color: #fff;
      font-size: 20px;
      margin: 0 0 0 12px;
      font-family: 'Chinese Quote', -apple-system, BlinkMacSystemFont,
        'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei',
        'Helvetica Neue', Helvetica, Arial, sans-serif, 'Apple Color Emoji',
        'Segoe UI Emoji', 'Segoe UI Symbol';
      font-weight: 600;
    }
  }

  &.light {
    background-color: #fff;
    box-shadow: 2px 0px 8px 0px rgba(29, 35, 41, 0.05);

    .logo {
      background: #fff;
      box-shadow: 1px 1px 0px 0px #e8e8e8;

      h1 {
        color: unset;
      }
    }

    .ant-menu-light {
      border-right-color: transparent;
    }
  }
}

// 外置的样式控制
.user-dropdown-menu-wrapper.ant-dropdown-menu {
  padding: 4px 0;

  .ant-dropdown-menu-item {
    width: 160px;
  }

  .ant-dropdown-menu-item > .anticon:first-child,
  .ant-dropdown-menu-item > a > .anticon:first-child,
  .ant-dropdown-menu-submenu-title
    > .anticon:first-child
    .ant-dropdown-menu-submenu-title
    > a
    > .anticon:first-child {
    min-width: 12px;
    margin-right: 8px;
  }
}

// 数据列表 样式
.table-alert {
  margin-bottom: 16px;
}
// 卡片样式
.page-container {
  .card-container {
    .ant-card-body {
      padding: 10px;
    }
    .table-page-option-wrapper {
      padding-bottom: 10px;
    }
  }
}

// 表单布局
.form-layout-body {
  .ant-card-wider-padding .ant-card-body {
    padding: 6px 16px 16px;
  }
  .ant-table-tbody > tr > td {
    padding: 10px;
  }
  .card {
    margin-bottom: 10px;
  }
}
.table-page-search-wrapper {
  // padding-left: 10px;
  .ant-form-inline {
    .ant-form-item {
      display: flex;
      margin-top: 10px;
      margin-bottom: 10px;
      margin-right: 0;
      .ant-form-item-control-wrapper {
        flex: 1 1;
        display: inline-block;
        vertical-align: middle;
      }

      > .ant-form-item-label {
        line-height: 32px;
        padding-right: 8px;
        width: auto;
      }
      .ant-form-item-control {
        height: 32px;
        line-height: 32px;
      }
    }
  }
  .ant-input-number {
    width: auto;
  }

  .table-page-search-submitButtons {
    display: block;
    margin: 10px 0;
    white-space: nowrap;
  }
}

.content {
  .table-operator {
    margin-bottom: 18px;

    button {
      margin-right: 8px;
    }
  }
}

// 切换的tab的card样式
.tabbar-container {
  &.card-container {
    margin-bottom: 10px;
    .ant-card-body {
      padding: 10px 10px 0;
    }
  }
  .ant-tabs-bar {
    margin: 0;
  }
}
// 样式wl 样式覆盖 样式修改
body {
  .ant-table-thead > tr > th {
    font-weight: 600;
    text-align: center;
  }
  .ant-table-tbody > tr > td {
    text-align: center;
  }
  // 修改upload
  .myUpload {
    display: inline-block;
    width: 350px;
    .ant-upload-list {
      float: none;
    }
  }
  .myUpload2 {
    display: inline-block;
    // width: 350px;
    .ant-upload-list {
      float: none;
    }
    width: 100%;
  }
}
</style>
