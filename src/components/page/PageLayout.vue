<template>
  <div :style="!$route.meta.pageHeader ? 'margin: -24px -24px 0px;' : null">
    <!-- pageHeader , route meta hideHeader:true on hide -->
    <page-header v-if="!$route.meta.pageHeader" :title="title" :logo="logo" :avatar="avatar">
      <slot slot="action" name="action"></slot>
      <slot slot="content" name="headerContent"></slot>
      <div slot="content" v-if="!this.$slots.headerContent && desc">
        <p style="font-size: 14px;color: rgba(0,0,0,.65)">{{ desc }}</p>
        <div class="link">
          <template v-for="(link, index) in linkList">
            <a :key="index" :href="link.href">
              <a-icon :type="link.icon"/>
              <span>{{ link.title }}</span>
            </a>
          </template>
        </div>
      </div>
      <slot slot="extra" name="extra"></slot>
      <div slot="pageMenu">
        <div class="page-menu-search" v-if="search">
          <a-input-search style="width: 80%; max-width: 522px;" placeholder="请输入..." size="large" enterButton="搜索" />
        </div>
        <div class="page-menu-tabs" v-if="tabs && tabs.items">
          <!-- @change="callback" :activeKey="activeKey" -->
          <a-tabs :tabBarStyle="{margin: 0}" @change="tabs.callback" :activeKey="tabs.active()">
            <a-tab-pane v-for="item in tabs.items" :tab="item.title" :key="item.key"></a-tab-pane>
          </a-tabs>
        </div>
      </div>
    </page-header>
    <div class="content">
      <div :class="['page-header-index-wide']">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import PageHeader from './PageHeader'

export default {
  name: 'LayoutContent',
  components: {
    PageHeader
  },
  // ['desc', 'logo', 'title', 'avatar', 'linkList', 'extraImage']
  props: {
    desc: {
      type: String,
      default: null
    },
    logo: {
      type: String,
      default: null
    },
    title: {
      type: String,
      default: null
    },
    avatar: {
      type: String,
      default: null
    },
    linkList: {
      type: Array,
      default: null
    },
    extraImage: {
      type: String,
      default: null
    },
    search: {
      type: Boolean,
      default: false
    },
    tabs: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
  }
}
</script>

<style lang="less">
  .content {
    // margin: 6px 8px 10px 10px;
    background:rgba(240,242,245,1);
    margin: 10px 24px 0;

    .link {
      margin-top: 16px;

      &:not(:empty) {
        margin-bottom: 16px;
      }
      a {
        margin-right: 32px;
        height: 24px;
        line-height: 24px;
        display: inline-block;

        i {
          font-size: 24px;
          margin-right: 8px;
          vertical-align: middle;
        }
        span {
          height: 24px;
          line-height: 24px;
          display: inline-block;
          vertical-align: middle;
        }
      }
    }
    .ant-card-head {
      min-height: 36px;
      padding: 0 16px !important;
      .ant-card-head-title {
        padding: 6px 0;
      }
    }
    /*.ant-form-item {*/
      /*margin-bottom: 10px;*/
    /*}*/

    // 列表布局
    .content-layout {
      background:rgba(240,242,245,1);
      .ant-card-body {
        padding: 0
      }
      .table-page-search-wrapper {
        margin-bottom: 10px;
        padding: 5px 10px;
        background: #fff;

        .table-page-search-wrapper .table-page-search-submitButtons {
          margin: 0;
        }
      }
      .ant-table-wrapper {
        background: #fff;
      }
    }
  }

  // 表单布局
  .form-layout-body {
    .ant-form-item {
      margin-bottom: 5px;
    }
    .ant-card-wider-padding .ant-card-body {
      padding: 6px 16px 16px ;
    }
    .ant-table-tbody > tr > td {
      padding: 10px;
    }
    .card{
      margin-bottom: 10px;
    }
  }

  // 表格表单
  .ant-table-row {
    .ant-form-item {
      margin-bottom: 0;
    }
  }

  .page-menu-search {
    text-align: center;
    margin-bottom: 16px;
  }
  .page-menu-tabs {
    margin-top: 48px;
  }
</style>
