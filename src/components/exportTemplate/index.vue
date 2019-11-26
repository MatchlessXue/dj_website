<!--
 * @TODO: 
 * @Author: haoming
 * @LastEditors: Please set LastEditors
 * @Date: 2019-04-26 15:58:54
 * @LastEditTime: 2019-05-27 16:01:27
 -->
<template>
  <div>
    <a-modal
      okText="确认导出"
      :visible="visible"
      @ok="exportTem"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
      width="650px"
      class="exportTemplate"
      >
      <template slot="title">
        设置导出模板<a href="javascript:;" style="font-size: 12px; margin-left: 10px;">(可调整序号移动列位置)</a>
      </template>
      <div>
        <a-row :gutter="24">
          <a-col :md="24">
            <a-button type="primary" @click="handlerTop()">
              <img src="~@/assets/icons/dj-zhiding.svg" style="margin-right:5px;transform: translateY(-1px)" />
              置顶
            </a-button>
            <a-button type="primary" style="margin-left:10px;" @click="handlerUp">
              <img src="~@/assets/icons/dj-xiayi.svg" style="margin-right:5px;transform: translateY(-1px)" />
              上移
            </a-button>
            <a-button type="primary" style="margin-left:10px;" @click="handlerDown">
              <img style="transform: rotate(180deg);margin-right:5px;" src="~@/assets/icons/dj-xiayi.svg" alt="">下移
            </a-button>
            <a-button type="primary" style="margin-left:10px;" @click="handlerBottom">
              <img src="~@/assets/icons/dj-zhidi.svg" alt="">
            </a-button>
          </a-col>
        </a-row>
        <a-table
          :rowSelection="onRowSelection"
          :columns="columned"
          :dataSource="templatedList"
          :pagination="false"
          :custom-row="customRow"
          :rowClassName="rowClassName"
          bordered
          :scroll="{ y: 350 }"
          rowKey="systemCode"
          >
            <!-- rowKey="systemCode"  不要修改，会影响逻辑 selectedRowKeyArr数据用于提交时候数据处理-->
            <span slot="expName" slot-scope="text, re ,index" href="javascript:;">
              <span v-if='index !== tableMess' @click.stop='tableRowClick(index)'>{{ text }}</span>
              <a-input @click.stop="()=>{}" :ref='"input" + index' v-else size="small" v-model="re.expName" @blur='inputChange' auto-focus />
            </span>
            <span slot="customTitle"><a-icon type="form" /> 导出列名</span>
        </a-table>
      </div>
      <div class="exportFoot">
        <span class="export-item">选择模板：</span>
        <a-select
          showSearch
          placeholder="请选择已保存的模板"
          optionFilterProp="children"
          style="width: 200px"
          @change="handleChange"
          :filterOption="exportFilterOption"
          >
          <a-select-option v-for="item in expTmpList" :key="item.tmpId" :value="item.tmpId">{{item.tmpName}}</a-select-option>
        </a-select>
        <a href="javascript:;" class="export-setting" @click="saveTemplate">另存为模板</a>
      </div>
    </a-modal>
    <a-modal
      title="另存为模板"
      :visible="saveTemplateVisible"
      @ok="saveTemplateOk"
      :confirmLoading="confirmLoading"
      @cancel="saveTemplateCancel"
      width="411px"
      >
      <div style="text-align:center">
        模板名称：<a-input style="width:222px;height:32px;" placeholder="请输入模板名称" v-model="saveTemplateName"/>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { trim } from 'lodash'
import { getExpTmpList, saveOrUpdateExpTmp, exportWaybillByExpTmpId, getExpTmpSys, getExpTmpDetailById} from '@api/export/export'
import { Promise } from 'q';
import axios from 'axios'
export default {
  data () {
    return {
      expTmpList: [], // 模板列
      expTmpSys: [],
      clickIndex: 9999,
      tableClickCode: '', // 选中行的systemCode
      // 另存为模板，name
      saveTemplateName: '',
      // 另存为模板，弹出显隐
      saveTemplateVisible: false,
      visible: this.value,
      confirmLoading: false,
      exportCurr: '',
      selectedRowKeyArr: [],
      columned: [{
        title: '序号',
        dataIndex: 'name',
        key: '1',
        width: 100,
        customRender: (text, record, index) => {
          return (<span>{index + 1}</span>)
        }
      }, {
        title: '系统别名',
        dataIndex: 'systemName',
        key: '3',
        width: 170
      }, {
        dataIndex: 'expName',
        key: '4',
        width: 170,
        slots: { title: 'customTitle' },
        scopedSlots: { customRender: 'expName' }
      }],
      templatedList: [
        {
          expName: '运单号',
          expSeleted: "1",
          systemName: '运单号',
          systemCode: '01'
        }, {
          expName: '客户名称',
          expSeleted: "1",
          systemName: '客户名称',
          systemCode: '02'
        }, {
          expName: '客户单号',
          expSeleted: "1",
          systemName: '客户单号',
          systemCode: '03'
        }, {
          expName: '发货区域',
          expSeleted: "1",
          systemName: '发货区域',
          systemCode: '04'
        }, {
          expName: '发货方名称',
          expSeleted: "1",
          systemName: '发货方名称',
          systemCode: '05'
        }, {
          expName: '收货区域',
          expSeleted: "1",
          systemName: '收货区域',
          systemCode: '06'
        }, {
          expName: '收货方名称',
          expSeleted: "1",
          systemName: '收货方名称',
          systemCode: '07'
        }, {
          expName: '收货方地址',
          expSeleted: "1",
          systemName: '收货方地址',
          systemCode: '08'
        }, {
          expName: '运单状态',
          expSeleted: "1",
          systemName: '运单状态',
          systemCode: '09'
        }, {
          expName: '件数',
          expSeleted: "1",
          systemName: '件数',
          systemCode: '10'
        }, {
          expName: '重量',
          expSeleted: "1",
          systemName: '重量',
          systemCode: '11'
        }, {
          expName: '体积',
          expSeleted: "1",
          systemName: '体积',
          systemCode: '12'
        }, {
          expName: '要求提货时间',
          expSeleted: "1",
          systemName: '要求提货时间',
          systemCode: '13'
        }, {
          expName: '要求送达时间',
          expSeleted: "1",
          systemName: '要求送达时间',
          systemCode: '14'
        }, {
          expName: '回单份数',
          expSeleted: "1",
          systemName: '回单份数',
          systemCode: '15'
        }, {
          expName: '备注',
          expSeleted: "1",
          systemName: '备注',
          systemCode: '16'
        }
      ],
      tableMess: null
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    // 运单id
    waybillId: {
      type: Array,
      default: [],
      required: true
    },
    // 条件查询参数
    queryParam: {
      type: Object,
      default: {},
      required: true
    },
    // 导出类型
    tmplateSubType: {
      type: Number,
      default: 1,
      required: true
    },
    tmplateType: {
      type: Number,
      default: 1,
      required: true
    }
  },
  components: {},
  computed: {
    // a-table 配置参数
    onRowSelection () {
      return {
        selectedRowKeys: this.selectedRowKeyArr,
        onChange: this.onTemplateChange,
        columnTitle: '是否导出',
        columnWidth: 90,
        fixed: false,
        hideDefaultSelections: true
      }
    }
  },
  watch: {
    visible (val) {
      this.tableMess = null
      this.$emit('input', val)
    },
    value (val) {
      this.visible = val
    }
  },
  created () {
    // 拉去模板列表
    this.getExpTmpList()
    // 查询导出模板名
    this.getExpTmpSys()
  },
  mounted () {},
  methods: {
    getExpTmpSys() {
      getExpTmpSys({}).then(res=> {
        this.expTmpSys = res.data
      })
    },
    getExpTmpList() {
      getExpTmpList({}).then(res => {
        console.log(res)
        this.expTmpList = res.data
      })
    },
    // table-每一行的类名
    rowClassName (record, index) {
      return record.systemCode === this.tableClickCode ? 'active' : ''
    },
    // table-点击某一行的元素
    customRow (record, index) {
      return {
        props: {
          class: 'active'
        },
        on: {
          click: (e) => {
            // systemCode唯一标识
            // 二次点击 取消选中
            if (this.tableClickCode === record.systemCode) {
              this.tableClickCode = ''
              this.clickIndex = 9999
            } else {
              this.tableClickCode = record.systemCode
              this.clickIndex = index
            }
          }
        }
      }
    },
    // 置顶
    handlerTop () {
      // 未选中，不上移或第一个不置顶
      if(this.clickIndex === 9999 || !this.clickIndex) return
      // 操作数据
      this.templatedList.unshift(this.templatedList[this.clickIndex])
      this.templatedList.splice(this.clickIndex + 1,1)
      // 修改选中行Index
      this.clickIndex = 0
    },
    // 上移
    handlerUp () {
      // 未选中，不上移或第一个不上移
      if(this.clickIndex === 9999 || !this.clickIndex) return
      // 操作数据
      this.templatedList[this.clickIndex] = this.templatedList.splice(this.clickIndex - 1, 1, this.templatedList[this.clickIndex])[0]
      // 修改选中行Index
      this.clickIndex -= 1
    },
    // 下移
    handlerDown () {
      // 未选中，不上移或最后一个不下移
      if(this.clickIndex === 9999 || this.clickIndex === this.templatedList.length - 1) return
      // 操作数据
      this.templatedList[this.clickIndex] = this.templatedList.splice(this.clickIndex + 1, 1, this.templatedList[this.clickIndex])[0]
      // 修改选中行Index
      this.clickIndex += 1
    },
    // 置底
    handlerBottom () {
      // 未选中，不置底或最后一个不置底
      if(this.clickIndex === 9999 || this.clickIndex === this.templatedList.length - 1) return
      // 操作数据
      this.templatedList.push(this.templatedList[this.clickIndex])
      this.templatedList.splice(this.clickIndex,1)
      // 修改选中行Index
      this.clickIndex = this.templatedList.length - 1
    },
    // 确定导出
    exportTem () {
      // 构建系统列名code
      Object.values(this.expTmpSys).forEach((item, index) => {
        this.templatedList.forEach(it => {
          if(it.systemName === item) {
            it.systemCode = Object.keys(this.expTmpSys)[index]
          }
        })
      })
      // 必须选择要导出的列名才允许导出
      if(!this.selectedRowKeyArr.length) {
        this.$message.error('请选择导出列名')
        return
      }
      // 构建提交数据
      this.formatUpLoadTemplatedList()
      // 判断是不是默认模板，弹窗提示
      let tmpName = "默认模板"
      let tmpId = ""
      // 判断是不是用户输入了，输入了，采用用户输入的
      if(this.saveTemplateName.length > 0) {
        tmpName = this.saveTemplateName
      }
      // 判断用户是否选择
      if(this.exportCurr.length > 0) {
        tmpId = this.exportCurr
      }
      // this.expTmpList.forEach()
      this.expTmpList.forEach(item => {
        if(item.tmpId === tmpId) {
          tmpName = item.tmpName
        }
      })
      console.log(this.templatedList)
      // 要把选中的提前
      // this.uoloadTemplatedList()
      // 如果用户选择了
      saveOrUpdateExpTmp({
        detailList: this.templatedList,
        tmpName: tmpName,
        tmpId: tmpId,
        tempType: 1,
        tempSubType: 1
      }).then( res=> {
        if(res.data) {
          // tmplateSubType=1&tmplateType=1
          let hosturl = "/api/dataio/export/exportByExpTmpId?"
          let parmas = `expTmpId=${res.data}&ids=${this.waybillId.join(',')}&tmplateSubType=${this.tmplateSubType}&tmplateType=${this.tmplateType}`
          // if(!this.queryParam.waybillId) {
          if (this.queryParam.partnerId === undefined) {
            console.log('undefined ---  没有选择 --- 不拼接')
            // 时间急，没来得及做换行
            // parmas += `partnerId=${this.queryParam.partnerId}&waybillId=${this.queryParam.waybillId}&orderEnd=${this.queryParam.orderEnd}&orderStart=${this.queryParam.orderStart}&rvName=${this.queryParam.rvName}&rvAddress=${this.queryParam.rvAddress}&waybillCode=${this.queryParam.waybillCode}`
          } else {
            console.log('bushi  undefinded  --- 选择了  --- 拼接')
            parmas = parmas + `&partnerId=${this.queryParam.partnerId}&waybillId=${this.queryParam.waybillId}&orderEnd=${this.queryParam.orderEnd}&orderStart=${this.queryParam.orderStart}&rvName=${this.queryParam.rvName}&rvAddress=${this.queryParam.rvAddress}&waybillCode=${this.queryParam.waybillCode}`
          }
          // 时间急，没来得及做换行
          // console.log(hosturl + parmas)
          window.open(hosturl + parmas)
        }
      })
      // 导出请求接口，然后调用打印接口
      this.visible = false
    },
    // 取消
    handleCancel () {
      this.visible = false
    },
    // 模板改变
    handleChange (value, obj) {
      this.selectedRowKeyArr = []
      // 获取id，请求模板数据
      this.exportCurr = obj.data.key
      getExpTmpDetailById({
        expTmpId: obj.data.key
      }).then(res => {
        // 更新选中的状态
        res.data.forEach((item) => {
          if (item.expSeleted === "0") {
            this.selectedRowKeyArr.push(item.systemCode)
          }
        })
        // 返回的数据顺序不对
        res.data.sort(function (i1, i2) {
          return Number(i1.expSeleted) - (i2.expSeleted)
        })
        this.templatedList = res.data
      })
    },
    // 是否根据输入项进行筛选
    exportFilterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    onTemplateChange (selectedRowKeys, obj) {
      console.log(selectedRowKeys, obj)
      this.selectedRowKeyArr = selectedRowKeys
    },
    // input修改内容
    inputChange () {
      this.tableMess = null
    },
    // 导出列名被点击
    tableRowClick (index) {
      this.tableMess = index
      this.$nextTick(function () {
        this.$refs["input" + index].focus()
      })
    },
    // 显示另存为模板
    saveTemplate () {
      console.log('另存为模板') 
      this.saveTemplateVisible = true
    },
    // 另存为模板 OK
    saveTemplateOk () {
      console.log(`用户另存为模板名称是：${this.saveTemplateName}`)
      // 模板名称允许输入20汉字
      if(this.saveTemplateName.length > 40) {
        this.$message.error('模板名称最多允许输入20汉字')
        return
      }
      this.formatUpLoadTemplatedList()
      // 必须选择列名才允许导出
      if(!this.selectedRowKeyArr.length) {
        this.$message.error('请选择导出列名')
        return
      }     
      // 另存为肯定是新增
      let templatedList = []
      this.templatedList.forEach(item => {
        templatedList.push({
          detailIndex: item.detailIndex,
          expName: item.expName,
          expSeleted: item.expSeleted,
          systemCode: item.systemCode,
          systemName: item.systemName
        })
      })
      // 另存为模板
      saveOrUpdateExpTmp({
        detailList: templatedList,
        tmpName: this.saveTemplateName,
        tempType: 1,
        tempSubType: 1
      }).then(res=> {
        // 成功后，刷新模板列表
        // this.selectedRowKeyArr = [] // 选中的
        // this.exportCurr = ''
        this.$message.success(`模板${this.saveTemplateName}已保存成功`)
        this.saveTemplateName = ""
        this.getExpTmpList()
      })
      this.saveTemplateVisible = false
    },
    // 另存为模板 cancel
    saveTemplateCancel () {
      // 取消，要清空输入的数据
      this.saveTemplateName = ""
      this.saveTemplateVisible = false
    },
    // 构建上传列表的数据
    formatUpLoadTemplatedList () {
      // 选中的数据，构建组装
      let that = this
      // this.selectedRowKeyArr.forEach(item => {
      //   that.templatedList[item].expSeleted = "0"
      // })
      // 此处手动存入detailIndex，下次获取排序
      this.templatedList.forEach((item, index) => {
        item.detailIndex = index + ''
        // selectedRowKeyArr存的就是systemCode，把获取行的expSeleted设置为0
        for (let obj of that.selectedRowKeyArr) {
          if (obj == item.systemCode) {
            item.expSeleted = "0"
          } 
        }
      })
    }
  },
  destroyed () {}
}
</script>

<style lang="less">
.ant-modal {
  top: 70px;
}
.exportTemplate {
  .ant-modal-body {
    padding-top: 15px;
  }
  .ant-modal-footer {
    text-align: center;
    div {
      text-align: center;
    }
  }
  .exportFoot {
    margin-top: 20px;
    .export-item {
      margin-left: 25px;
    }
    .export-setting {
      margin-left: 20px;
    }
  }
  .ant-row {
    text-align: right;
    padding-bottom: 20px;
    padding-right: 25px;
  }
  .ant-table-wrapper {
    margin: 0 25px;
  }
  .ant-table-row {
    height: 54px;
    td:last-child {
      padding: 6px 3px;
      input {
        height: 40px;
        display: inline-block;
        line-height: 40px;
        border: none
      }
      span {
        span {
          height: 40px;
          display: inline-block;
          line-height: 40px;
          width: 100%;
        }
      }
    }
  }
  .active {
    background-color: #e6f7ff;
  }
}
.ant-table-tbody > tr.active td {
  background-color: #e6f7ff;
}
</style>