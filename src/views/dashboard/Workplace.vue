<template>
  <div>
    <a-row :gutter="16">
      <a-col  :xs="24" :sm="16" :md="8" :lg="8" :xl="8">
        <a-card :hoverable="true" :bodyStyle="bodyStyleForCard">
          <a-row type="flex" justify="center" align="middle">
            <a-col><p class="counter">{{ statisticData.pickup || 0 }}</p></a-col>
          </a-row>
          <a-row type="flex" justify="center" align="middle">
            <a-col>
              <p>
                <!-- <span @click="toDispatchList">待调度</span> -->
                <a v-if="toDoDispatchListClickable" @click="toDispatchList" class="underline">待调度</a>
                <span v-else>待调度</span>
              </p>
            </a-col>
          </a-row>
        </a-card>
      </a-col>
      <a-col  :xs="24" :sm="16" :md="8" :lg="8" :xl="8">
        <a-card :hoverable="true" :bodyStyle="bodyStyleForCard">
          <a-row type="flex" justify="center" align="middle">
            <a-col><p class="counter">{{ statisticData.trace || 0 }}</p></a-col>
          </a-row>
          <a-row type="flex" justify="center" align="middle">
            <a-col><p>
              <!-- <span>在途跟踪</span> -->
              <!-- <a @click="toTraceList" class="underline">在途跟踪</a> -->
              <a v-if="abnormalListClickable" @click="toTraceList" class="underline">在途跟踪</a>
              <span v-else>在途跟踪</span>
            </p></a-col>
          </a-row>
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="16" :md="8" :lg="8" :xl="8">
        <a-card :hoverable="true" :bodyStyle="bodyStyleForCard">
          <a-row type="flex" justify="center" align="middle">
            <a-col>
              <p class="counter">{{ statisticData.receipt || 0 }}</p>
            </a-col>
          </a-row>
          <a-row type="flex" justify="center" align="middle">
            <a-col>
              <p>
                <!-- <span @click="toReceiptList">待回单</span> -->
                <a v-if="receiptClickable" @click="toReceiptList" class="underline">待回单</a>
                <span v-else>待回单</span>
              </p>
            </a-col>
          </a-row>
        </a-card>
      </a-col>
    </a-row>
    <br>
    <a-card>
      <div :style="{ textAlign: 'center', padding: '8%' }">
        <img src="@/assets/indexFlowPic.png" :style="{ width: '80%', height: '80%' }"/>
      </div>
    </a-card>
  </div>
</template>

<script>
import { getStatisticData } from '@/api/workbench/workbench'
import { getInfo } from '@/api/login'

export default {
  name: 'Workplace',
  components: {},
  data () {
    return {
      statisticData: {},
      menuLists: []
    }
  },
  created () {
    getStatisticData().then(res => {
      this.statisticData = res.data
    })
    getInfo().then(res => {
      this.menuLists = res.data.menuList
    })
  },
  mounted () {
    // console.log('this.menuList', this.menuList)
  },
  computed: {
    bodyStyleForCard () {
      return { textAlign: 'center' }
    },
    menuList () {
      return this.$store.getters.userInfo.menuList
    },
    receiptClickable () {
      return this.isClickable('receiptList')
    },
    abnormalListClickable () {
      return this.isClickable('track:AbnormalList')
    },
    toDoDispatchListClickable () {
      return this.isClickable('dispatch:roadlinelist')
    }
  },
  methods: {
    toDispatchList () {
      // this.$router.push('/dispatch/RoadLineList')
      this.$router.push({
        name: 'RoadLineList'
      })
    },
    toTraceList () {
      this.$router.push({
        name: 'AbnormalList'
      })
    },
    toReceiptList () {
      this.$router.push({
        name: 'receiptList'
      })
    },
    isClickable (permsStr) {
      // console.log(permsStr)
      const i = this.menuLists.findIndex(menu => {
        return menu.perms === permsStr
      })
      return i > -1
    }
  }
}
</script>

<style lang="less" scoped>
  .underline {
    border-bottom: 1px solid;
    padding-bottom: 1%;
    text-decoration: none;
  }

  p {
    width: 150px;
    height: 30px;
    font-size: 30px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    /*color: rgba(24, 144, 255, 1);*/
    line-height: 30px;
    text-align: center;
  }

  p.counter {
    width: 51px;
    height: 38px;
    font-size: 30px;
    font-family: HelveticaNeue;
    /*color: rgba(38, 38, 38, 1);*/
    line-height: 38px;
  }
</style>
