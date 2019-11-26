import T from 'ant-design-vue/es/table/Table'
import get from 'lodash.get'

export default {
  data() {
    const tablePagination=T.props.pagination
    tablePagination.pageSizeOptions=['20', '50','100','200','500']
    return {
      tablePagination,
      needTotalList: [],

      selectedRows: [],
      selectedRowKeys: [],

      localLoading: false,
      localDataSource: [],
      localPagination: Object.assign({},tablePagination)
    }
  },
  props: Object.assign({},T.props,{
    rowKey: {
      type: [String,Function],
      default: 'id'
    },
    data: {
      type: Function,
      required: true
    },
    pageNum: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 20
    },
    showSizeChanger: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: 'default'
    },
    /**
     * {
     *   show: true,
     *   clear: Function
     * }
     */
    alert: {
      type: [Object,Boolean],
      default: null
    },
    /** @Deprecated */
    showAlertInfo: {
      type: Boolean,
      default: false
    },
    showPagination: {
      type: String,
      default: 'auto'
    }
  }),
  watch: {
    'localPagination.current'(val) {
      this.$router.push({
        name: this.$route.name,
        params: Object.assign({},this.$route.params,{
          page: val
        })
      })
    },
    pageNum(val) {
      Object.assign(this.localPagination,{
        current: val
      })
    },
    pageSize(val) {
      Object.assign(this.localPagination,{
        pageSize: val
      })
    },
    showSizeChanger(val) {
      Object.assign(this.localPagination,{
        showSizeChanger: val
      })
    }
  },
  created() {
    this.refreshPaginationOptionsAndData()
  },
  methods: {
    /**
     * 表格重新加载方法
     * 如果参数为 true, 则强制刷新到第一页
     * @param Boolean bool
     */
    refresh(bool=false) {
      this.loadData(bool? { current: 1 }:{})
    },
    // 刷新分页可选项['50','100','200','500']和数据
    refreshPaginationOptionsAndData() {
      this.localPagination=['auto',true].includes(this.showPagination)&&Object.assign({},this.localPagination,{
        current: this.pageNum,
        pageSize: this.pageSize||50,
        showSizeChanger: this.showSizeChanger,
        showQuickJumper: true,
        pageSizeOptions: ['20', '50','100','200','500'],
        showTotal: total => `共 ${total} 条数据`
      })
      this.needTotalList=this.initTotalList(this.columns)
      this.loadData()
    },
    /**
     * 加载数据方法
     * @param {Object} pagination 分页选项器
     * @param {Object} filters 过滤条件
     * @param {Object} sorter 排序条件
     */
    loadData(pagination,filters,sorter) {
      this.$emit('change',pagination,filters,sorter)
      this.localLoading=true
      console.log('查看ppppppp',pagination)
      var result=this.data(Object.assign({
        page: (pagination&&pagination.current)||
          this.localPagination.current||1,
        pageSize: (pagination&&pagination.pageSize)||
          this.localPagination.pageSize||50
      },
        (sorter&&sorter.field&&{
          sortField: sorter.field
        })||{},
        (sorter&&sorter.order&&{
          sortOrder: sorter.order
        })||{},{
          ...filters
        }
      )).catch((res) => {
        console.log('catch ..... res',res)
        this.localDataSource=[] // 返回结果中的数组数据
        this.localLoading=false
      })

      console.log('查看result',result)

      // 对接自己的通用数据接口需要修改下方代码中的 r.pageNo, r.totalCount, r.data
      // 为了兼容IE 暂时注释Promise判断
      // if (result instanceof Promise) {
      result.then(r => {
        console.log('查看rrrrrrrr',r)
        this.localPagination=Object.assign({},this.localPagination,{
          current: r.current, // 返回结果中的当前分页数
          total: r.total, // 返回结果中的总记录数
          showSizeChanger: this.showSizeChanger,
          pageSize: (pagination&&pagination.pageSize)||
            this.localPagination.pageSize||50
        })

        // 为防止删除数据后导致页面当前页面数据长度为 0 ,自动翻页到上一页
        console.log('查看records',r.records,r)
        if (r.records.length===0&&this.localPagination.current!==1) {
          this.localPagination.current--
          this.loadData()
          return
        }

        // 这里用于判断接口是否有返回 r.totalCount 或 this.showPagination = false
        // 当情况满足时，表示数据不满足分页大小，关闭 table 分页功能
        !r.total&&['auto',false].includes(this.showPagination)&&(this.localPagination=false)
        this.localDataSource=r.records // 返回结果中的数组数据
        this.$emit('tableData',r.records)
        this.localLoading=false
      })
      // }
    },
    initTotalList(columns) {
      const totalList=[]
      columns&&columns instanceof Array&&columns.forEach(column => {
        if (column.needTotal) {
          totalList.push({
            ...column,
            total: 0
          })
        }
      })
      return totalList
    },
    /**
     * 用于更新已选中的列表数据 total 统计
     * @param selectedRowKeys
     * @param selectedRows
     */
    updateSelect(selectedRowKeys,selectedRows) {
      this.selectedRows=selectedRows
      const list=this.needTotalList
      this.needTotalList=list.map(item => {
        return {
          ...item,
          total: selectedRows.reduce((sum,val) => {
            const total=sum+get(val,item.dataIndex)
            return isNaN(total)? 0:total
          },0)
        }
      })
    },
    /**
     * 清空 table 已选中项
     */
    clearSelected() {
      if (this.rowSelection) {
        this.rowSelection.onChange([],[])
        this.updateSelect([],[])
      }
    },
    /**
     * 处理交给 table 使用者去处理 clear 事件时，内部选中统计同时调用
     * @param callback
     * @returns {*}
     */
    renderClear(callback) {
      return (
        <a style="margin-left: 24px" onClick={() => {
          callback()
          this.clearSelected()
        }}>清空</a>
      )
    },
    renderAlert() {
      // 绘制统计列数据
      const needTotalItems=this.needTotalList.map((item) => {
        return (<span style="margin-right: 12px">
          {item.title}总计 <a style="font-weight: 600">{!item.customRender? item.total:item.customRender(item.total)}</a>
        </span>)
      })

      // 绘制 清空 按钮
      const clearItem=(typeof this.alert.clear==='boolean'&&this.alert.clear)? (
        this.renderClear(this.clearSelected)
      ):(this.alert!==null&&typeof this.alert.clear==='function')? (
        this.renderClear(this.alert.clear)
      ):null

      // 绘制 alert 组件
      return (
        <a-alert showIcon={true} style="margin-bottom: 16px">
          <template slot="message">
            <span style="margin-right: 12px">已选择: <a style="font-weight: 600">{this.selectedRows.length}</a></span>
            {needTotalItems}
            {clearItem}
          </template>
        </a-alert>
      )
    }
  },

  render() {
    const props={}
    const localKeys=Object.keys(this.$data)
    const showAlert=(typeof this.alert==='object'&&this.alert!==null&&this.alert.show)||this.alert

    Object.keys(T.props).forEach(k => {
      const localKey=`local${k.substring(0,1).toUpperCase()}${k.substring(1)}`
      if (localKeys.includes(localKey)) {
        return (props[k]=this[localKey])
      }
      if (showAlert&&k==='rowSelection') {
        // 重新绑定 rowSelection 事件
        return (props[k]={
          selectedRowKeys: this[k].selectedRowKeys,
          onChange: (selectedRowKeys,selectedRows) => {
            this.updateSelect(selectedRowKeys,selectedRows)
            this[k].onChange(selectedRowKeys,selectedRows)
          }
        })
      }
      return (props[k]=this[k])
    })

    const table=(
      <a-table {...{ props,scopedSlots: { ...this.$scopedSlots } }} onChange={this.loadData}>
        {this.$slots.default}
      </a-table>
    )

    return (
      <div class="table-wrapper">
        {showAlert? this.renderAlert():null}
        {table}
      </div>
    )
  }
}
