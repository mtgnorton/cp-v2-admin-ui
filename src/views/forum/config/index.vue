<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">

      <el-tab-pane label="网站设置" name="site">

        <el-form ref="form" :model="forum" label-width="200px">

          <el-form-item label="网站名称">

            <el-input v-model="forum.site_name"></el-input>

          </el-form-item>


          <el-form-item label="网站slogan">

            <el-input
              type="textarea"
              :rows="5"
              placeholder="请输入内容"
              v-model="forum.site_slogan"
            >
            </el-input>
          </el-form-item>

          <el-form-item label="网站描述">

            <el-input
              type="textarea"
              :rows="5"
              placeholder="请输入内容"
              v-model="forum.site_description"
            >
            </el-input>
            <div class="warning-tips">会用于seo</div>
          </el-form-item>


          <el-form-item label="网站域名">

            <el-input v-model="forum.site_domain"></el-input>

          </el-form-item>

          <el-form-item label="网站logo">

            <el-upload
              class="uploader"
              action="/admin/upload-logo"
              :show-file-list="false"
              name="logo"
              :on-success="handleLogoSuccess"
            >
              <img v-if="forum.logo" :src="forum.logo" class="logo">
              <i v-else class="el-icon-plus uploader-icon"></i>
            </el-upload>


          </el-form-item>

          <el-form-item label="网站favicon">

            <el-upload
              class="uploader"
              action="/admin/upload-favicon"
              :show-file-list="false"
              name="favicon"
              :on-success="handleFaviconSuccess"
            >
              <img v-if="forum.favicon" :src="forum.favicon" class="logo">
              <i v-else class="el-icon-plus uploader-icon"></i>
            </el-upload>


          </el-form-item>
          <!--          <el-form-item label="网站名称">-->
          <!--            <el-radio v-model="forum.posts_is_need_audit" label="1">是</el-radio>-->
          <!--            <el-radio v-model="forum.posts_is_need_audit" label="0">否</el-radio>-->
          <!--          </el-form-item>-->


          <el-form-item>
            <el-button type="primary" @click="submit">保存</el-button>
          </el-form-item>
        </el-form>

      </el-tab-pane>
      <el-tab-pane label="主题设置" name="post">

        <el-form ref="form" :model="forum" label-width="200px">

          <el-form-item label="发帖是否需要后台审核">
            <el-radio v-model="forum.posts_is_need_audit" label="1">是</el-radio>
            <el-radio v-model="forum.posts_is_need_audit" label="0">否</el-radio>
          </el-form-item>

          <el-form-item label="每天最大发帖数量">

            <el-input-number v-model="forum.posts_every_day_max" :min="0" label="每天最大发帖数量"></el-input-number>
            <div class="warning-tips">为0不限制</div>

          </el-form-item>

          <el-form-item label="发帖字符最大数量">

            <el-input-number v-model="forum.posts_character_max" :min="0"></el-input-number>

            <div class="warning-tips">为0不限制</div>

          </el-form-item>


          <el-form-item label="发帖修改有效时间(单位：min)">

            <el-input-number v-model="forum.posts_can_update_time" :min="0"></el-input-number>
            <div class="warning-tips">为0不限制</div>
          </el-form-item>

          <el-form-item label="发帖修改最大回复数量">

            <el-input-number v-model="forum.posts_can_update_reply_amount" :min="0"></el-input-number>
            <div class="warning-tips">为0不限制</div>
          </el-form-item>


          <el-form-item>
            <el-button type="primary" @click="submit">保存</el-button>
          </el-form-item>
        </el-form>

      </el-tab-pane>

      <el-tab-pane label="回复设置" name="reply">

        <el-form ref="form" :model="forum" label-width="200px">

          <el-form-item label="回帖是否需要后台审核">
            <el-radio v-model="forum.reply_is_need_audit" label="1">是</el-radio>
            <el-radio v-model="forum.reply_is_need_audit" label="0">否</el-radio>
          </el-form-item>

          <el-form-item label="每天最大回复数量">

            <el-input-number v-model="forum.reply_every_day_max" :min="0"></el-input-number>
            <div class="warning-tips">为0不限制</div>

          </el-form-item>

          <el-form-item label="回复字符最大数量">

            <el-input-number v-model="forum.reply_character_max" :min="0"></el-input-number>

            <div class="warning-tips">为0不限制</div>

          </el-form-item>


          <el-form-item>
            <el-button type="primary" @click="submit">保存</el-button>
          </el-form-item>
        </el-form>

      </el-tab-pane>


      <el-tab-pane label="token设置" name="token">

        <el-form ref="form" :model="forum" label-width="200px">


          <el-form-item label="注册赠送token数量">

            <el-input-number v-model="forum.token_register_give" :min="0"></el-input-number>
          </el-form-item>

          <el-form-item label="每日登录赠送token数量">

            <el-input-number v-model="forum.token_login_give" :min="0"></el-input-number>

          </el-form-item>

          <el-form-item label="发帖扣除token数量">

            <el-input-number v-model="forum.token_establish_posts_deduct" :min="0"></el-input-number>

          </el-form-item>

          <el-form-item label="修改帖子扣除token数量">

            <el-input-number v-model="forum.token_update_posts_deduct" :min="0"></el-input-number>

          </el-form-item>

          <el-form-item label="回复扣除token数量">

            <el-input-number v-model="forum.token_establish_reply_deduct" :min="0"></el-input-number>

          </el-form-item>

          <el-form-item label="感谢帖子扣除token数量">

            <el-input-number v-model="forum.token_thanks_posts_deduct" :min="0"></el-input-number>

          </el-form-item>

          <el-form-item label="感谢回复扣除token数量">

            <el-input-number v-model="forum.token_thanks_reply_deduct" :min="0"></el-input-number>

          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submit">保存</el-button>
          </el-form-item>
        </el-form>

      </el-tab-pane>

      <el-tab-pane label="邮箱设置" name="email">

        <el-form ref="form" :model="forum" label-width="200px">

          <el-form-item label="邮箱账号">

            <el-input v-model="forum.email_user"></el-input>

          </el-form-item>


          <el-form-item label="邮箱SMTP密码">

            <el-input v-model="forum.email_password"></el-input>
            <div class="warning-tips">
              不是邮箱密码,需要登陆你的邮箱，在设置，账号，启用IMAP/SMTP服务，会发送一段身份验证符号
            </div>
          </el-form-item>

          <el-form-item label="邮箱HOST">

            <el-input v-model="forum.email_host"></el-input>

          </el-form-item>

          <el-form-item label="发件人名称">

            <el-input v-model="forum.email_send_name"></el-input>

          </el-form-item>


          <!--          <el-form-item label="网站名称">-->
          <!--            <el-radio v-model="forum.posts_is_need_audit" label="1">是</el-radio>-->
          <!--            <el-radio v-model="forum.posts_is_need_audit" label="0">否</el-radio>-->
          <!--          </el-form-item>-->


          <el-form-item>
            <el-button type="primary" @click="submit">保存</el-button>
          </el-form-item>
        </el-form>

      </el-tab-pane>


      <el-tab-pane label="注册相关" name="register">

        <el-form ref="form" :model="forum" label-width="200px">

          <el-form-item label="注册邮件发送时间间隔(单位小时)">

            <el-input-number v-model="forum.register_send_email_diff_hour" :min="0"></el-input-number>

          </el-form-item>

          <el-form-item label="注册默认头像">

            <el-upload
              class="uploader"
              action="/admin/upload-default-avatar"
              :show-file-list="false"
              name="avatar"
              :on-success="handleAvatarSuccess"
            >
              <img v-if="forum.register_default_avatar" :src="forum.default_avatar" class="logo">
              <i v-else class="el-icon-plus uploader-icon"></i>
            </el-upload>


          </el-form-item>
          <!--          <el-form-item label="网站名称">-->
          <!--            <el-radio v-model="forum.posts_is_need_audit" label="1">是</el-radio>-->
          <!--            <el-radio v-model="forum.posts_is_need_audit" label="0">否</el-radio>-->
          <!--          </el-form-item>-->


          <el-form-item>
            <el-button type="primary" @click="submit">保存</el-button>
          </el-form-item>
        </el-form>

      </el-tab-pane>
    </el-tabs>
  </div>
</template>


<script>
import { listConfig, updateConfig } from '../../../api/system/config'

export default {
  data() {
    return {
      activeName: 'site',
      forum: {
        favicon: undefined
      }
    }
  },

  created() {
    this.getConfigs()
  },
  methods: {
    getConfigs() {
      listConfig({
        'modules': ['forum']
      }).then(response => {

        this.forum = response.data.data.forum
        console.log(this.forum)

      })
    },

    submit: function() {
      updateConfig('forum', this.forum).then(response => {

        this.msgSuccess(response.message)
      })
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    handleLogoSuccess(res, file) {
      this.forum.logo = res.data.url + '?v' + Math.random()
    },
    handleAvatarSuccess(res, file) {
      console.log(res.data)

      this.forum.default_avatar = res.data.url + '?v' + Math.random()
    },
    handleFaviconSuccess(res, file) {
      this.forum.favicon = res.data.url + '?v' + Math.random()
      console.log(this.forum.favicon);

    }
  }
}
</script>
<style>
.uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  padding: 10px;
}

.uploader .el-upload:hover {
  border-color: #409EFF;
}

.uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}

.logo {
  width: 100px;
  height: 100px;
  display: block;
}
</style>
