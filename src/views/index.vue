<template>
  <div class="dashboard-editor-container">

    <panel-group :all-post-count="allPostCount" :all-reply-count="allReplyCount" :all-user-count="allUserCount"
                 :today-post-count="todayPostCount" :today-reply-count="todayReplyCount"
                 :today-user-coun="todayUserCount"/>

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData"/>
    </el-row>


  </div>
</template>

<script>
import PanelGroup from './dashboard/PanelGroup'
import LineChart from './dashboard/LineChart'
import { indexStatistics } from '../api/forum'

export default {
  name: 'Index',
  components: {
    PanelGroup,
    LineChart
  },
  created() {
    this.getStatistics()
  },
  data() {
    return {
      todayUserCount: 0,
      todayPostCount: 0,
      todayReplyCount: 0,
      allUserCount: 0,
      allPostCount: 0,
      allReplyCount: 0,
      lineChartData: {
        users: [],
        posts: [],
        replies: [],
        xCoordinate: []
      }
    }
  },
  methods: {
    getStatistics() {
      indexStatistics().then(response => {
        const data = response.data
        this.todayUserCount = data.today_user_count
        this.todayPostCount = data.today_post_count
        this.todayReplyCount = data.today_reply_count
        this.allUserCount = data.all_user_count
        this.allPostCount = data.all_post_count
        this.allReplyCount = data.all_reply_count
        this.lineChartData.users = data.day_30_user_inc
        this.lineChartData.posts = data.day_30_post_inc
        this.lineChartData.replies = data.day_30_reply_inc
        this.lineChartData.xCoordinate = data.day_30_date

      })
    }

  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
