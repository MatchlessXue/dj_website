<template>
  <div class="check-container">
    <a-button @click="handleClick">{{title}}</a-button>
    <a-card v-show="isShow" class="check-content" :style="{width: cardWidth}">
      <!-- <div :style="{ borderBottom: '1px solid #E9E9E9' }">
        <a-checkbox
          :indeterminate="indeterminate"
          @change="onCheckAllChange"
          :checked="checkAll"
        >
        全部
        </a-checkbox>
      </div> -->
      <a-checkbox-group v-model="checkedList"  @change="onChange" >
        <a-row>
          <a-col :span="24/itemCount" v-for="(item, index) in plainOptions" :key="index">
            <a-checkbox :value="item.value">{{item.label}}</a-checkbox>
          </a-col>
        </a-row>
      </a-checkbox-group>
    </a-card>
  </div>
</template>

<script>

export default {
  name: 'CheckboxMulty',
  props: {
    title: {
      type: String,
      default: '我是按钮'
    },
    // 需要显示几列？  有可能需要显示2列 或是3列
    itemCount: {
      type: Number,
      default: 1
    },
    // 设置层的宽度，配合上面的itemCount列使用（一般多列的时候需要定义）
    cardWidth: {
      type: String,
      default: ''
    },
    plainOptions: {
      type: Array,
      default: function () {
        return []
      }
    },
    defaultCheckedList: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
      isShow: false,
      checkedList: this.defaultCheckedList,
      indeterminate: true,
      checkAll: false
    }
  },
  created () {
  },
  computed: {
  },
  methods: {
    handleClick () {
      this.isShow = !this.isShow
    },
    onChange (checkedList) {
      console.log('========checkedList=======')
      console.log(checkedList)
      console.log('========checkedList=======')

      this.indeterminate = !!checkedList.length && (checkedList.length < this.plainOptions.length)
      this.checkAll = checkedList.length === this.plainOptions.length
      this.$emit('change', checkedList)
    },
    onCheckAllChange (e) {
      Object.assign(this, {
        checkedList: e.target.checked ? this.plainOptions.map(function (item) {
          return item.value
        }) : [],
        indeterminate: false,
        checkAll: e.target.checked
      })
      this.$emit('checkAll')
    },
    setCol (checkedList) {
      this.checkedList = checkedList
    }
  }
}
</script>

<style lang="less" scoped>
.check-container {
  display: inline-block;
  position: relative;
  .check-content {
    z-index: 999;
    text-align: left;
    max-height: 200px;
    overflow-x: hidden;
    overflow-y: scroll;
    position: absolute;
    right: 0;
  }
}
.check-container .check-content /deep/ label {
  white-space: nowrap
}

</style>
