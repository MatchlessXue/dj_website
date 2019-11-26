<template>
  <div class="">
    <div class="">
      <router-link :to="{name:'dashboard'}">
<!--      <img src="~@/assets/logo.png" alt="logo">-->
      <!-- <h1 v-if="showTitle">{{ title }}</h1> -->
    </router-link>
    </div>

  </div>
</template>

<script>
export default {
  name: 'Logo',
  props: {
    title: {
      type: String,
      default: 'Ant Design Pro',
      required: false
    },
    showTitle: {
      type: Boolean,
      default: true,
      required: false
    }
  }
}
</script>
<style scoped>
  .logoDiv{
    background: #4A6384;
    text-align: center;
    height: 32px;
    margin: 16px 24px 16px 0px;
  }
  .sider .logo{
    line-height: 30px;
    height: 48px;
    background: #001529;
  }
  .sider .logo img{
    height: 29px;
  }
</style>
