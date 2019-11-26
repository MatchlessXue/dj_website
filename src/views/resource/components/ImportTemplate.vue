<template>
  <div class="co_import_excel_dialog">
    <el-dialog
      :visible.sync="visible"
      title="导入运单"
      width="700px"
      :close-on-click-modal="false"
      v-loading.fullscreen.lock="confirmLoading">
      <el-form>
        <!-- 提示 -->
        <div class="co_import_excel_tip">
          <h3>导入注意事项</h3>
          <p v-for="(desc, descIndex) in descriptionArr" :key="descIndex">{{ desc }}</p>
        </div>
        <!-- 上传文件组件 -->
        <el-upload
          class="co_import_excel_upload"
          action=""
          :limit="1"
          :file-list="fileList"
          :http-request="beforeUpload"
          :before-remove="beforeRemove">
          <el-button type="primary" icon="el-icon-upload">
            导入文件
          </el-button>
          <em>单次只能上传一个文件，仅支持扩展名：.xls.xlsx</em>
        </el-upload>
        <!-- 2019年05月13日15:25:47-类型为1，需要两排 -->
        <div v-if="moduleType === 1" class="co_import_excel_option">
          <el-form-item label="导入表格" label-width="80px">
            <el-select
              filterable
              clearable
              placeholder="请选择导入文件的sheet表"
              style="width: 220px"
              @change="sheetChange"
              v-model="sheetNo"
            >
              <el-option
                v-for="value in tableMap"
                :key="value.sheetNo"
                :label="value.name"
                :value="value.sheetNo"
              >{{value.name}}
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择模板" label-width="80px">
            <el-select
              filterable
              clearable
              placeholder="请选择以保持的模板"
              style="width: 220px"
              @change="tempChange"
              v-model="tempId"
              >
              <el-option
                v-for="value in tempMap"
                :key="value.tempId"
                :label="value.tempName"
                :value="value.tempId">
                {{value.tempName}}
              </el-option>
            </el-select>
          </el-form-item>
          <div style="clear:both;"></div>
          <!-- 客户名称和项目 -->
          <el-form-item label="客户名称" label-width="80px" required>
            <el-select
              filterable
              clearable
              placeholder="请选择客户名称"
              style="width: 220px"
              @change="partnerChange"
              v-model="partnerName"
            >
              <el-option
                v-for="partner in allPartnerList"
                :key="partner.partnerId"
                :label="partner.partnerName"
                :value="partner"
                >{{partner.partnerName}}</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="项目" label-width="80px" required>
            <el-select
              filterable
              clearable
              placeholder="请选择项目"
              style="width: 220px"
              @change="projectChange"
              v-model="projectName"
            >
              <el-option
                v-for="project in projectNameList"
                :key="project.projectId"
                :label="project.projectName"
                :value="project"
                >{{project.projectName}}</el-option>
            </el-select>
          </el-form-item>
          <!-- 运单导入问题：未选择客户名称和项目时，增加一个提示文案，并且表格字段名称置灰不可选，仅当客户名称和项目都选择了后表格字段名称才可以编辑 -->
          <div class="import_tip_msg" v-if="showTip">请选择需要导入的客户和项目</div>
        </div>
        <div class="co_import_excel_option" v-else>
          <el-form-item label="选择表格" label-width="80px">
            <el-select
              filterable
              clearable
              placeholder="请选择导入文件的sheet表"
              style="width: 220px"
              @change="sheetChange"
              v-model="sheetNo"
            >
              <el-option
                v-for="value in tableMap"
                :key="value.sheetNo"
                :label="value.name"
                :value="value.sheetNo"
              >{{value.name}}
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择模板" label-width="80px">
            <el-select
              filterable
              clearable
              placeholder="请选择以保持的模板"
              style="width: 220px"
              @change="tempChange"
              v-model="tempId"
              >
              <el-option
                v-for="value in tempMap"
                :key="value.tempId"
                :label="value.tempName"
                :value="value.tempId">
                {{value.tempName}}
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <!-- 表格 -->
        <el-table border :data="computedData">
          <el-table-column
            :prop="columns[0].dataIndex"
            :label="columns[0].title">
            <template slot-scope="{row}">
              <template><span v-if="row.required" style="color: red"> * </span>{{row.fieldName}}</template>
            </template>
          </el-table-column>
          <el-table-column
            :prop="columns[1].dataIndex"
            :label="columns[1].title">
            <template slot-scope="{row}">
              <el-select
                placeholder="请选择表格列名"
                filterable
                clearable
                :disabled="showTip"
                v-model="row.customFieldName"
                @change="e => handleChange(e, row.fieldCode, columns[1].dataIndex)">
                <el-option
                  v-for="(value, index) in customFieldMap"
                  :key="index"
                  :label="value.tempName"
                  :value="value.customFieldName">
                {{value.customFieldName}}
                </el-option>
              </el-select>
            </template>
          </el-table-column>
        </el-table>

        <div class="co_import_excel_savebtn">
          <el-button @click="saveTemplate()" type="text">另存为模板</el-button>
        </div>
      </el-form>
      <template #footer class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="handleOk">确认导入</el-button>
      </template>
    </el-dialog>
    <el-dialog
      :visible.sync="confirmVisible"
      title="另存为模板"
      width="400px"
      >
      <el-form class="form" label-width="60px">
        <el-form-item label="模板名称">
          <el-input v-model="templateName" placeholder="请输入模板名称"  maxLength="20"/>
        </el-form-item>
      </el-form>
      <template #footer class="dialog-footer">
        <el-button @click="confirmHandleCancel">取 消</el-button>
        <el-button type="primary" @click="confirmHandleOk">保 存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import * as types from '@/store/mutation-types'

export default {
  name: "ImportTemplate",
  props: {
    // 2019年05月13日11:41:19-黄雪峰
    // 哪个模块调用的，用于区分业务逻辑
    moduleType: {
      type: Number,
      required: false,
      default: 0 // 默认0，1：运单
    },
    // 客户名称列-运单导入专属
    allPartnerList:{
      type: Array,
      required: false,
      default () {
        return []
      }
    },
    // 显示帮助-已废弃
    showHelp: false,
    templateType: {
      type: Number,
      required: true,
      default : 0
    },
    templateSubType: {
      type: Number,
      required: true,
      default : 0
    },
    title: {
      type: String,
      default : '导入模板'
    },
    contractId: {
      default : ''
    },
    descriptionArr: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      // 是否显示弹窗
      visible: false,
      // 另存模板显示和隐藏
      confirmVisible: false,
      // 实在显示加载中
      confirmLoading: false,
      // 文件列表
      fileList: [],
      // 表格列名
      customFieldMap: [],
      //
      data: [],
      sheetNo: undefined,
      tableMap: [],
      tempMap: [],
      tempId: undefined,
      partnerId: undefined,
      partnerName: '',
      projectId: undefined,
      projectName: '',
      templateName: "",
      // 2019年05月14日12:01:04-黄雪峰-项目列表-运单专属
      projectNameList:[],
      //
      columns: [{
        title: '系统字段名称',
        dataIndex: 'fieldName',
        width: '20%',
        scopedSlots: { customRender: 'fieldName' }
      }, {
        title: '表格字段名称',
        dataIndex: 'customFieldName',
        width: '25%',
        scopedSlots: { customRender: 'customFieldName' }
      }],
      // 动态费用
      costData: [],
      // 动态费用copy
      costDataTemp: []
    }
  },
  methods: {
    // 根据客户id切换，获取项目列表-1.2.1-运单专属，因为是联动的，所以添加到内部
    partnerChange(value) {
      // 保存数据
      this.partnerId = value.partnerId
      this.partnerName = value.partnerName
      // console.log(value) // 客户id
      this.$Api.getProjectList({
        method: 'post',
        params: {
          partnerId: value.partnerId
        }}).then(res => {
        const datas = res.data || []
        this.projectNameList = res.data
        // 如果只有一个，就直接显示项目
        if (this.projectNameList.length === 1) {
          this.projectName = this.projectNameList[0].projectName
          this.projectId = this.projectNameList[0].projectId
          this.getCostList(this.projectNameList[0].projectId)
        }
      })
    },
    // 项目切换，会自动更新用户下属项目列-1.2.1-提交数据接口待开发
    projectChange (value){
      // console.log(value); // 项目id
      this.projectId = value.projectId
      this.projectName = value.projectName
      this.getCostList(value.projectId)
    },
    // 获取动态费用
    getCostList (projectId) {
      this.$store.commit(types.SET_WAYBILL_INFO_PROJECT_ID, projectId)
      // 获取动态费用
      this.$store.dispatch('doTenantExpense').then(data => {
        // console.log(data)
        let source = []
        this.costDataTemp = data
        data.forEach(val => {
          source.push({
            fieldCode: 'expense_' + val.platformExpenseId + "_" + val.tanantNumberId,
            fieldName: val.expenseSelfName,
            required: false,
            customFieldName: undefined
          })
        })
        this.costData = source
        this.getTemplateMapById()
      })
    },
    // 初始化数据
    showModal () {
      this.getTemplateBase()
      this.sheetNo = undefined
      this.tempId = undefined
      this.templateName = undefined
      this.fileList = []
      this.excelFileList = []
      this.tableMap = []
      this.tempMap = []
      this.customFieldMap = []
      this.visible = true
      this.projectId = undefined
      this.projectName = ''
      this.partnerId = undefined
      this.partnerName = ''
      this.costData = []
    },
    // 另存为模板
    saveTemplate () {
      this.confirmVisible = true
      if (this.checkData()){
        this.confirmVisible = true
      }
    },
    getTemplateBase () {
      this.$Api.getTemplateBase({
        params: {
          templateType: this.templateType,
          templateSubType: this.templateSubType
        }
        }).then(res => {
        let source = []
        res.data.forEach(val => {
          source.push({ fieldCode: val.code, fieldName: val.name, required: val.required, customFieldName: undefined })
        })
        this.data = source
        // console.log('查看template，', this.data)
        this.updateCustomIntervals()
      })
    },
    beforeUpload (file) {
      const fileName = file.file.name
      var suffix = fileName.substr(fileName.lastIndexOf('.'))
      if (!fileName) {
        this.$message.error('请选择需要导入的Excel文件')
        return false
      }
      if (suffix !== '.xls' && suffix !== '.xlsx') {
        this.$message.error('仅支持扩展名为xls、xlsx的表格')
        return false
      }
      // this.fileList = []
      this.fileList = [...this.fileList, file.file]
      this.handleUpload()
    },
    handleUpload () {
      const { fileList } = this
      const formData = new FormData()
      formData.append('file', fileList[0])
      this.$Api.readExcelFile({
        method: 'post',
        type: 3,
        paramsUrl: formData,
        params: {
          templateType: this.templateType,
          templateSubType: this.templateSubType
        }
        }).then(res => {
        this.excelFileList = res.data
        let source = []
        res.data.forEach(val => {
          source.push({ sheetNo: val.sheetNo, name: val.name })
        })
        this.tableMap = source
        // 默认取第一个
        if (source.length > 0) {
          this.sheetNo = source[0].sheetNo
          this.initCustomFieldMap(this.sheetNo)
          this.getTemplateList()
          this.updateCustomIntervals()
        }
      })
    },
    sheetChange (v) {
      this.initCustomFieldMap(v)
      this.getTemplateMapById()
    },
    tempChange () {
      if (!this.sheetNo) {
        this.$message.error('请选择表格')
        return false
      }
      this.getTemplateMapById()
    },
    getTemplateMapById () {
      if (!this.tempId) {
        return
      }
      if (this.moduleType === 1) {
        this.computedData.forEach(item => {item.customFieldName = undefined })
      } else {
        this.data.forEach(item => {item.customFieldName = undefined })
      }
      this.$Api.getTemplateMapByTempId({
        method: 'post',
        params: {
          tempId: this.tempId
        }
        }).then(res => {
        var tempData = res.data
        if (!tempData || tempData.length === 0){
            return
        }
        // 2019年06月11日17:01:53-动态费用数据匹配，如果temp数据不是当前项目，需要动态匹配
        let newData
        if (this.moduleType === 1) {
          newData = [...this.computedData]
        } else {
          newData = [...this.data]
        }
        // 先匹配静态
        this.data.forEach(item => {
          tempData.forEach(itm => {
            if (item.fieldCode === itm.fieldCode) {
              item.fieldName = itm.fieldName
              item.customFieldName = itm.customFieldName
              item.mapId = itm.mapId
            }
          })
        })
        // 在匹配动态
        if (this.moduleType === 1) {
          // this.costData：每次更新切换项目，都会更新获取的
          // fieldCode: 'expense_' + val.platformExpenseId + "_" + val.tanantNumberId
          // 返回的：expense_28294_3958
          // expense_28294_  =>  expense_28294_3958
          this.costData.forEach((item, index) => {
            // console.log(this.costDataTemp[index])
            let str = 'expense_' + this.costDataTemp[index].platformExpenseId + '_'
            tempData.forEach(itm => {
              // 如果包含，那么说明存在
              // console.log(itm.fieldCode)
              if (itm.fieldCode.indexOf(str) !== -1) {
                item.fieldName = itm.fieldName
                item.customFieldName = itm.customFieldName
                item.mapId = itm.mapId
              }
            })
          })
        }
      })
    },
    /**
     * 格式化显示的数据customFieldMap={ customFieldName:'xxx },{xx:xx}]
     */
    initCustomFieldMap (v) {
      const target = this.excelFileList.filter(item => v === item.sheetNo)[0]
      if (target) {
        let source = []
        target.heads.forEach((val, i) => {
          source.push({ customFieldName: val })
        })
        this.customFieldMap = source
      }
    },
    /**
     * 获取模板列表
     */
    getTemplateList () {
      this.$Api.getTemplateList({
        method: 'post',
        params: {
          templateType: this.templateType,
          templateSubType: this.templateSubType
        }}).then(res => {
          console.log(res.data)
          this.tempMap = res.data
        })
    },
     // 更新动态字段
    updateCustomIntervals () {
      this.removeDiyField()
      // 只有是合同的时候才动态处理字段
      if (!this.isAgreement) return false
      // 如果选过模板了  就不动态添加字段，用模板的字段
      if (this.tempId) return false
      // 如果没有任何字段，也不做任何处理
      if (this.data.length === 0) return false
      if (this.sheetNo) {
        const currentSheet = this.excelFileList.find(item => item.sheetNo === this.sheetNo)
        console.log('查看sheet', currentSheet)
        if (currentSheet && currentSheet.customIntervals && currentSheet.customIntervals.length) {
          currentSheet.customIntervals.forEach((item, index) => {
            let fieldItem = {
              fieldCode: item,
              customFieldName: undefined,
              required: false,
              fieldName: '区间' + (index + 1),
              diy: true
            }
            this.addFieldValue(fieldItem)
          })
        }
      }
    },
    // 删除所有的动态字段
    removeDiyField () {
      this.data = this.data.filter(item => item.diy !== true)
    },
    // excel 选项切换
    handleChange (val, code, column) {
      const newData = [...this.data]
      const target = newData.filter(item => code === item.fieldCode)[0]
      if (target) {
        target[column] = val
        this.data = newData
      }
    },
    handleOk () {
      if(!this.checkData()){ // 必填校验
        return false
      }
      const { fileList } = this
      const formData = new FormData()
      formData.append('file', fileList[0])
      let dataList
      // 合同的时候导入合同id
      if (this.moduleType === 1) {
        dataList = this.computedData.slice(0)
      } else {
        dataList = this.data.slice(0)
      }
      if (this.isAgreement && this.contractId) {
        dataList.push({
          fieldCode: 'contractId',
          required: false,
          customFieldName: this.contractId
        })
      }
      formData.append('mapListJson', JSON.stringify(dataList))
      var template = {}
      template.templateId = this.tempId
      template.templateSubType = this.templateSubType
      template.templateType = this.templateType
      template.sheetNo = this.sheetNo
      // moduleType === 1  运单；要求：客户和项目不能为空
      if(this.moduleType === 1) {
        if(!this.partnerId && !this.partnerName) {
          this.$message.error('客户名称不能为空')
          return
        }
        if(!this.projectId && !this.projectName) {
          this.$message.error('项目名称不能为空')
          return
        }
        template.partnerId = this.partnerId
        template.partnerName = this.partnerName
        template.projectId = this.projectId
        template.projectName = this.projectName
      }

      this.confirmLoading = true
      this.$Api.dataImport({
        method: 'post',
        paramsUrl: formData,
        params: template
      }).then(res => {
        // if (!res.status) {
        //   this.$message.error(res.message)
        //   return false
        // }
        if (res.code === 0){
          let meg = res.data.message
          if (meg){
            if (res.data.isok) {
              this.$notification.success({
                description: meg,
                message: '导入完成',
                duration: null
              })
            } else {
              this.$notification.error({
                description: meg,
                message: '导入完成',
                duration: null
              })
            }

          }
          this.confirmLoading = false
          this.visible = false
          this.$emit('success', res)
          this.handleCancel()
        }
      }).catch(() => {
        this.confirmLoading = false
        this.$emit('error')
      })
    },
    checkData () {
      if (!this.data || this.data.length === 0) {
        return false
      }
      if (!this.fileList || this.fileList.length === 0) {
        this.$message.error('请上传模板文件')
        return false
      }
      if (!this.sheetNo) {
        this.$message.error('请选择表格')
        return false
      }
      for (let i = 0; i < this.data.length; i++) {
        var val = this.data[i]
        if (val.required && !val.customFieldName) {
          this.$message.error(val.fieldName + '不能为空')
          return false
        }
      }
      return true
    },
    confirmHandleOk () {
      if (!this.templateName) {
        this.$message.error('模板名称不能为空')
        return false
      }
      var template = {}
      if (this.moduleType === 1) {
         template.list = this.computedData
      } else {
        template.list = this.data
      }
      // 小勇需要去掉这个值
      // template.tempId = this.tempId
      template.tempName = this.templateName
      template.tempSubType = this.templateSubType
      template.tempType = this.templateType
      this.loading = true
      this.$Api.templateSave({
        requesType: true,
        method: 'post',
        params: template
      }).then(res => {
        this.getTemplateList()
        this.confirmVisible = false
      }).finally(() => {
        this.loading = false
      })
    },
    confirmHandleCancel () {
      this.confirmVisible = false
    },
    // 删除文件之前的钩子
    beforeRemove (file, fileList) {
      this.fileList = []
    }
  },
  computed: {
    // 是否是合同？
    isAgreement () { return this.templateType === 1},
    computedData () {
      return this.data.concat(this.costData)
    },
    showTip () {
      // 如果不是运单，必须允许编辑
      if (this.moduleType !== 1) {
        return false
      }
      return !(this.partnerId && this.partnerName && this.projectId && this.projectName)
    }
  },

}
</script>

<style>

</style>
