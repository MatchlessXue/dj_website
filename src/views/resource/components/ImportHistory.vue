<template>
  <div class="form-layout-body">
    <a-modal title="导入历史" :width="900" :visible="visible" :maskClosable="false" :confirmLoading="confirmLoading" @cancel="handleaddCancel">
      <template slot="footer">
        <a-button key="back" @click="handleaddCancel">取消</a-button>
      </template>
      <s-table ref="table" :columns="columns" :data="loadData" bordered size="default" :scroll="{y: 340}" :showAlertInfo="false">
        <span slot="failedCount" slot-scope="text">
          <a style="color:#FF0505">{{text}}</a>
        </span>
        <span slot="takeTime" slot-scope="text" v-if="text">{{formatSeconds(text)}}</span>
        <span slot="action" slot-scope="text,record">
          <a v-if="record.canupload" :href="record.failedReportUri" :download="record.fileName">下载导入失败报告</a>
          <span v-else-if="record.errortext" style="color:gray">{{record.errortext}}</span>
        </span>
      </s-table>
    </a-modal>
  </div>
</template>
<script>
import { importHistory } from '@/api/import/import'
import STable from '@/components/table'

export default {
  name: 'ImportHistory',
  components: {
    STable
  },
  data () {
    return {
      visible: false,
      isFirst: true,
      confirmLoading: false,
      queryParam: {},
      columns: [
        {
          title: '导入文件名',
          dataIndex: 'fileName',
          width: 105
        },
        {
          title: '导入时间',
          dataIndex: 'startTime',
          width: 105
        },
        {
          title: '总导入数',
          dataIndex: 'totalCount',
          width: 105
        },
        {
          title: '导入成功数',
          dataIndex: 'successCount',
          width: 105
        },
        {
          title: '导入失败数',
          dataIndex: 'failedCount',
          width: 105,
          scopedSlots: { customRender: 'failedCount' }
        },
        {
          title: '操作人',
          dataIndex: 'userName',
          width: 65
        },
        {
          title: '预估剩余时间',
          dataIndex: 'takeTime',
          width: 115,
          scopedSlots: { customRender: 'takeTime' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: 124,
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        this.isFirst = false
        return importHistory(Object.assign(parameter, this.queryParam)).then(res => {
          // console.log('导入历史数据', res)
          res.data.records.forEach((item, i) => {
            if (item.failedCount !== 0) {
              if (item.failedReportUri) {
                item.canupload = true
              } else {
                item.errortext = item.takeTime === null ? '报告生成失败' : '报告生成中'
              }
            }
          })
          console.log(res.data)
          return res.data
        }
        )
      },
      data: []
    }
  },
  mounted () {

  },
  methods: {
    add (templateType, templateSubType) {
      this.visible = true
      this.queryParam.templateSubType = templateSubType
      this.queryParam.templateType = templateType
      if (!this.isFirst) this.$refs.table.refresh()
    },
    handleDownload () {
      console.log('下载')
    },
    handleaddCancel (isRefresh) {
      this.visible = false
      this.$emit('hideForm', isRefresh)
    },
    formatSeconds (value) {
      let secondTime = parseInt(value)// 秒
      let minuteTime = 0// 分
      let hourTime = 0// 小时
      if (secondTime > 60) { // 如果秒数大于60，将秒数转换成整数
        // 获取分钟，除以60取整数，得到整数分钟
        minuteTime = parseInt(secondTime / 60)
        // 获取秒数，秒数取佘，得到整数秒数
        secondTime = parseInt(secondTime % 60)
        // 如果分钟大于60，将分钟转换成小时
        if (minuteTime > 60) {
          // 获取小时，获取分钟除以60，得到整数小时
          hourTime = parseInt(minuteTime / 60)
          // 获取小时后取佘的分，获取分钟除以60取佘的分
          minuteTime = parseInt(minuteTime % 60)
        }
      }
      let result = '' + parseInt(secondTime) + '秒'

      if (minuteTime > 0) {
        result = '' + parseInt(minuteTime) + '分' + result
      }
      if (hourTime > 0) {
        result = '' + parseInt(hourTime) + '小时' + result
      }
      return result
	  }
  }
}
</script>
