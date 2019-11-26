<template>
  <div class="settlement-odd-detail" style="padding-left: 160px; padding-top:15px;">
    <a-timeline mode="left">
      <template v-for="node in data">
        <a-timeline-item  :key="node.nodeId">
          <div slot="dot" class="circle"></div>
          <p class="ps">{{node.createDate}}</p >
          <div>{{node.nodeTypeName}}</div>
          <div>{{node.createAccountName}}</div>
          <div>{{node.nodeContent}}</div>
          <div class="imgList" v-if="node.picJson && JSON.parse(node.picJson).length">
            <viewer class="itemImg" v-for="(item, index) in JSON.parse(node.picJson)" :key="index">
              <img :src="item"  width="88">
            </viewer>
          </div>
        </a-timeline-item>
      </template>
    </a-timeline>
  </div>
</template>

<script>
import { countCollumnsWidth } from '@/utils/util'
import { list } from '@/api/node/node'

export default {
  name: 'good-node-info',
  props: {
    waybillId: {
      type: String,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      data: [{
        nodeTypeName: '',
        createAccountName: ''
      }]
    }
  },
  mounted () {
    list({ waybillId: this.waybillId }).then(res => {
      this.data = res.data || []
    })
  },
  computed: {
    scrollX () {
      return countCollumnsWidth(this.columns)
    }
  },
  watch: {
    queryParam (n, o) {

    }
  }
}
</script>

<style lang="less">
.settlement-odd-detail {
    background: #fff;
  }
.circle {
  background: #1890ff;
  width: 10px;
  height: 10px;
  border-radius: 100px;
  position: relative;
  transition: all 0.3s;
}
.ps {
  position: absolute;
  width: 100%;
  right: 100%;
  text-align: right;
  padding-right: 36px;
}
.ant-timeline-item-tail {
  position: absolute;
  left: 4px;
  top: 0.75em;
  height: 100%;
  border-left: 2px solid #1890ff;
}
.imgList {
  margin-top: 8px;
}
.itemImg {
  display: inline-block;
  margin-right: 20px;
  padding: 8px;
  border: 1px solid #666;
}
</style>
