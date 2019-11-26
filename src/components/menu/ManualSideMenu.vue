<template>
  <a-layout-sider
    :class="['sider', isDesktop() ? null : 'shadow', theme, fixSiderbar ? 'ant-fixed-sidemenu' : null ]"
    width="256px"
    :collapsible="collapsible"
    v-model="collapsed"
    :trigger="null">
    <logo/>
    <!--<br>-->
    <!--<a-input-search-->
      <!--placeholder="请输入搜索关键字"-->
      <!--@search="onSearch"-->
    <!--/>-->
    <br>
    <br>
    <a-menu
      mode="inline"
      theme="dark"
      :inlineCollapsed="collapsed"
      @click="handleMenuClick"
    >
        <a-menu-item key="ManualWorkbench">工作台</a-menu-item>
        <a-sub-menu v-for="menu in menus" :key="menu.routeName">
          <span slot="title">
            <span>{{menu.name}}</span>
          </span>
          <a-menu-item v-for="childMenu in menu.children" :key="childMenu.routeName">{{childMenu.name}}</a-menu-item>
        </a-sub-menu>
    </a-menu>
  </a-layout-sider>

</template>

<script>
import ALayoutSider from 'ant-design-vue/es/layout/Sider'
import Logo from '../tools/Logo'
import { mixin, mixinDevice } from '@/utils/mixin.js'

export default {
  name: 'ManualSideMenu',
  components: { ALayoutSider, Logo },
  mixins: [mixin, mixinDevice],
  props: {
    mode: {
      type: String,
      required: false,
      default: 'inline'
    },
    theme: {
      type: String,
      required: false,
      default: 'dark'
    },
    collapsible: {
      type: Boolean,
      required: false,
      default: false
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    },
    menus: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
    }
  },
  methods: {
    onSearch (value) {
      console.log(value)
    },
    onSelect (obj) {
      this.$emit('menuSelect', obj)
    },
    handleMenuClick ({ item, key, keyPath }) {
      // console.log('handleTitleClick->item, key', item, key)
      // if(key === '01') {
      //   console.log('handleTitleClick->key', key)
      this.$router.push({
        name: key
      })
      // }
    }
  }
}
</script>
