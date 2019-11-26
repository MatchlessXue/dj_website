<template>
  <div class="enclosure-detail">
    <a-row>
      <a-form-item
          label="结算详情"
          :label-col="{ span: 2 }"
          :wrapper-col="{ span: 22 }">
        <span v-for="(item,idx) in dataSource"
              class="img-wrap"
              :key="idx">
          <img class="enclosure-detail-img" @click="clickImg(item.documentUrl)" :src="item.documentUrl" :alt="item.documentId">
        </span>
      </a-form-item>
    </a-row>
  </div>
</template>

<script>
export default {
  name: 'enclosure-detail',
  props: {
    dataSource: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {

    }
  },
  computed: {

  },
  created () {
    console.log(this.dataSource)
  },
  methods: {
    clickImg (url) {
      this.$emit('clickImg', url)
    }
  }
}
</script>

<style lang="less" scoped>
.enclosure-detail {
  .img-wrap {
    padding-right: 15px;
    .enclosure-detail-img {
      height: 200px;
      width: auto;
      max-width: 400px;
    }
  }
}
</style>
