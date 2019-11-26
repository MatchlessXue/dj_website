<template>
    <a-tabs @change="callback" :animated='false' :activeKey="active()">
    <a-tab-pane
      v-for="m in items"
      :tab="m.title"
      :key="m.key"
    ></a-tab-pane>
  </a-tabs>

</template>

<script>
export default {
  name: 'tabs',
  props: {
    items: {
      type: Array,
      default: null
    },
    routerChange: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      tabActive: this.items[0].pathName
    }
  },
  mounted: function () {
    // console.log(this.items)
  },
  computed: { },
  methods: {
    callback (key) {
      this.items.map(item => {
        if (item.key === key) {
          if (this.routerChange) {
            this.$router.push({ name: item.pathName })
          } else {
            this.tabActive = item.pathName
            console.log(this.tabActive)
            this.$emit('tabActive', item)
          }
        }
      })
    },
    active () {
      let actKey
      this.items.map(item => {
        if (item.pathName === this.$route.name) {
          actKey = item.key
        } else if (item.pathName === this.tabActive) {
          actKey = item.key
        }
      })
      console.log(actKey)
      return actKey
    }
  }

}
</script>
