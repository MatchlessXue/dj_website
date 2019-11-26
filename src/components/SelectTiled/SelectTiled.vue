<template>
  <div class="select-tiled-layout">
    <a-input :value="inputValue"
             :placeholder="placeholder"
             :disabled="false"
             @blur="handleBlur"
             @click="showList"></a-input>
    <div class="options-layout"
         v-show="isShowList">
      <p class="title">全部选项</p>
      <ul class="options-list">
        <li v-for="(val, key) in optionsList"
            :key="key"
            class="opt-item"
            @click="handleClick(key, val)">
          {{val}}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SelectTiled',
  props: {
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    keyName: {
      type: String,
      default: 'dictId'
    },
    valName: {
      type: String,
      default: 'dictName'
    }
  },
  data () {
    return {
      // inputKey: '',
      inputValue: '',
      isShowList: false
    }
  },
  computed: {
    optionsList () {
      const arr = {}
      const data = this.data
      // console.log('data===', data, this.keyName, this.valName)
      // const data = [
      //   { catalogId: 10, dictId: 0, dictName: '其他' },
      //   { catalogId: 10, dictId: 2000, dictName: '2.0m' },
      //   { catalogId: 10, dictId: 2001, dictName: '3.0m' },
      //   { catalogId: 10, dictId: 2002, dictName: '4.0m' },
      //   { catalogId: 10, dictId: 2003, dictName: '5.0m' },
      //   { catalogId: 10, dictId: 2004, dictName: '6.0m' }
      // ]
      for (let i = 0; i < data.length; i++) {
        const el = data[i]
        arr[el[this.keyName]] = el[this.valName]
      }
      // console.log(arr)
      arr[0] = '不限'
      return arr
    }
  },
  methods: {
    handleClick (key, value) {
      // console.log('handleClick')
      // console.log('clicl', key, value)
      // this.inputKey = key
      if (key + '' === '0') {
        this.inputValue = ''
        this.$emit('input', null)
      } else {
        this.inputValue = value
        this.$emit('input', key)
      }
      this.isShowList = false
    },
    handleBlur () {
      setTimeout(() => {
        this.isShowList = false
      }, 280)
    },
    showList () {
      // console.log('data', this.data)
      // console.log('optionsList', this.optionsList)
      this.isShowList = true
    }
  }
}
</script>

<style lang="less" scoped>
.select-tiled-layout {
  display: inline-block;
  color: #000000;
  z-index: 9999;
  .ant-input-disabled {
    background-color: #fff;
    opacity: 1;
    cursor: not-allowed;
    color: #333;
  }
  ul {
    list-style: none;
    margin-block-start: 0;
    margin-block-end: 0;
    padding-inline-start: 0;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    // justify-content: space-between;
    li {
      list-style: none;
      display: inline;
    }
  }
  .options-layout {
    position: absolute;
    left: 0;
    top: 25px;
    width: 386px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.15);
    border-radius: 4px;
    padding: 12px;
    z-index: 99999;
    .title {
      font-size: 15px;
      line-height: 15px;
      font-weight: 500;
      padding: 0 6px;
      border-left: 2px solid #1890ff;
    }
    .options-list {
      padding-left: 8px;
    }
    .opt-item {
      font-size: 14px;
      line-height: 22px;
      border-right: 1px solid #e8e8e8;
      margin: 8px 0;
      padding: 0 7px;
      // width: 50px;
      text-align: center;
      cursor: pointer;
      &:nth-child(1) {
        padding-left: 0;
      }
      &.actived {
        color: #1890ff;
      }
      &:hover {
        color: #1890ff;
      }
    }
  }
}
</style>
