<template>
  <el-row>
    <el-row :gutter="40" class="panel-group">
      <el-col :xs="8" :sm="8" :lg="8" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper user">
            <svg-icon icon-class="peoples" class-name="card-panel-icon"/>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              今日新增用户
            </div>
            <count-to :start-val="0" :end-val="todayUserCount" :duration="1000" class="card-panel-num"/>
          </div>
        </div>
      </el-col>

      <el-col :xs="8" :sm="8" :lg="8" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper post">
            <svg-icon icon-class="edit" class-name="card-panel-icon"/>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              今日新增主题
            </div>
            <count-to :start-val="0" :end-val="todayPostCount" :duration="3200" class="card-panel-num"/>
          </div>
        </div>
      </el-col>

      <el-col :xs="8" :sm="8" :lg="8" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper reply">
            <svg-icon icon-class="message" class-name="card-panel-icon"/>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              今日新增回复
            </div>
            <count-to :start-val="0" :end-val="todayPostCount" :duration="1000" class="card-panel-num"/>
          </div>
        </div>
      </el-col>

    </el-row>
    <el-row :gutter="40" class="panel-group">
      <el-col :xs="8" :sm="8" :lg="8" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper user">
            <svg-icon icon-class="peoples" class-name="card-panel-icon"/>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              所有用户
            </div>
            <count-to :start-val="0" :end-val="allUserCount" :duration="1000" class="card-panel-num"/>
          </div>
        </div>
      </el-col>

      <el-col :xs="8" :sm="8" :lg="8" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper post">
            <svg-icon icon-class="edit" class-name="card-panel-icon"/>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              所有主题
            </div>
            <count-to :start-val="0" :end-val="allPostCount" :duration="3200" class="card-panel-num"/>
          </div>
        </div>
      </el-col>

      <el-col :xs="8" :sm="8" :lg="8" class="card-panel-col">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper reply">
            <svg-icon icon-class="message" class-name="card-panel-icon"/>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              所有回复
            </div>
            <count-to :start-val="0" :end-val="allPostCount" :duration="1000" class="card-panel-num"/>
          </div>
        </div>
      </el-col>

    </el-row>
  </el-row>

</template>

<script>
import CountTo from 'vue-count-to'

export default {
  components: {
    CountTo
  },
  props: {
    todayUserCount: {
      type: Number,
      default: 0
    },
    todayPostCount: {
      type: Number,
      default: 0
    },
    todayReplyCount: {
      type: Number,
      default: 0
    },
    allUserCount: {
      type: Number,
      default: 0
    },
    allPostCount: {
      type: Number,
      default: 0
    },
    allReplyCount: {
      type: Number,
      default: 0
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .user {
        background: #40c9c6;
      }

      .post {
        background: #36a3f7;
      }
      .reply {
        background: #d2b213;
      }

    }

    .user {
      color: #40c9c6;
    }

    .post {
      color: #36a3f7;
    }
    .reply {
      color: #d2b213;
    }


    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
