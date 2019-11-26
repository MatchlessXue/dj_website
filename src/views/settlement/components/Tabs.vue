<template>
  <a-tabs @change="callback" :defaultActiveKey="1" :animated='false' :activeKey="active()">
    <a-tab-pane
      v-for="(m, idx) in items"
      :tab="m.title"
      :disabled="setClickStatus(m, idx)"
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
    },
    bizStatus: {
      type: Number,
      default: 0
    },
    defaultActiveKey: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      tabActive: this.items[0].pathName
    }
  },
  mounted () {
    console.log(this.bizStatus)
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
    },
    setClickStatus (s, idx) {
      if (this.bizStatus > 0) {
        if (idx === 0 && this.bizStatus === 300) {
          return false
        } else if (idx <= 1 && this.bizStatus >= 301) {
          return false
        } else if (idx <= 3 && this.bizStatus >= 302) {
          return false
        } else {
          return true
        }
      } else {
        return s.show
      }
    }
  }

}
</script>
