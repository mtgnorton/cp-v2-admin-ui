<template>
  <div class="app-container">
    <el-row :gutter="20">

      <!--用户数据-->
      <el-col :span="24" :xs="24">
        <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
          <el-form-item label="用户名称" prop="username">
            <el-input
              v-model="queryParams.username"
              placeholder="请输入用户名称"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="目标id" prop="username">
            <el-input
              v-model="queryParams.target_id"
              placeholder="请输入目标id"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <el-select
              v-model="queryParams.type"
              placeholder="类型"
              clearable
              size="small"
              style="width: 240px"
            >

              <!--            感谢主题:thanks_posts,感谢回复: thanks_reply,屏蔽主题: shield_posts,屏蔽回复: shield_reply,收藏主题:collect_posts,收藏节点: collect_nodes,follow_user:关注用户,shield_user:屏蔽用户-->

              <el-option label="感谢主题" value="thanks_posts"></el-option>
              <el-option label="感谢回复" value="thanks_reply"></el-option>
              <el-option label="屏蔽主题" value="shield_posts"></el-option>
              <el-option label="屏蔽回复" value="shield_reply"></el-option>
              <el-option label="收藏主题" value="collect_posts"></el-option>
              <el-option label="收藏节点" value="collect_nodes"></el-option>
              <el-option label="关注用户" value="follow_user"></el-option>
              <el-option label="屏蔽用户" value="shield_user"></el-option>


            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>


        <el-table v-loading="loading" :data="associationList">
          <el-table-column label="编号" align="center" prop="id"/>
          <el-table-column label="用户名" width="100px" align="center" prop="username"/>
          <el-table-column label="目标id" width="100px" align="center" prop="target_id"/>

          <el-table-column label="类型" align="center" prop="type" width="160">


            <!--            AssociationTypeThanksPost  = "thanks_post"-->
            <!--            AssociationTypeThanksReply = "thanks_reply"-->
            <!--            AssociationTypeShieldPost  = "shield_post"-->
            <!--            AssociationTypeShieldReply = "shield_reply"-->
            <!--            AssociationTypeCollectPost = "collect_post"-->
            <!--            AssociationTypeCollectNode = "collect_node"-->
            <!--            AssociationTypeFollowUser  = "follow_user"-->
            <!--            AssociationTypeShieldUser  = "shield_user"-->

            <!--            感谢主题:thanks_posts,感谢回复: thanks_reply,屏蔽主题: shield_posts,屏蔽回复: shield_reply,收藏主题:collect_posts,收藏节点: collect_nodes,follow_user:关注用户,shield_user:屏蔽用户-->
            <template slot-scope="scope">
              <el-tag type="primary" v-if="scope.row.type=== 'thanks_post'">感谢主题</el-tag>
              <el-tag type="primary" v-if="scope.row.type=== 'thanks_reply'">感谢回复</el-tag>
              <el-tag type="primary" v-if="scope.row.type=== 'shield_post'">屏蔽主题</el-tag>
              <el-tag type="primary" v-if="scope.row.type=== 'shield_reply'">屏蔽回复</el-tag>
              <el-tag type="primary" v-if="scope.row.type=== 'collect_post'">收藏主题</el-tag>
              <el-tag type="primary" v-if="scope.row.type=== 'collect_node'">收藏节点</el-tag>
              <el-tag type="primary" v-if="scope.row.type=== 'follow_user'">关注用户</el-tag>
              <el-tag type="primary" v-if="scope.row.type=== 'shield_user'">屏蔽用户</el-tag>

            </template>
          </el-table-column>
          <el-table-column label="内容" :show-overflow-tooltip="true" align="center" prop="target_content"/>
          <el-table-column label="关联用户" :show-overflow-tooltip="true" align="center" prop="target_username"/>


          <el-table-column label="创建时间" align="center" prop="created_at" width="160">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.created_at) }}</span>
            </template>
          </el-table-column>

        </el-table>

        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.page"
          :limit.sync="queryParams.size"
          @pagination="getList"
        />
      </el-col>
    </el-row>

    <el-dialog title="内容" :visible.sync="open" width="800px" append-to-body>
      <div v-html="viewContent">

      </div>
    </el-dialog>

  </div>
</template>

<script>
import {
  listAssociation
} from '@/api/forum'

export default {
  name: 'association',
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,

      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 表单参数
      form: {},
      defaultProps: {
        children: 'children',
        label: 'label'
      },

      // 查询参数
      queryParams: {
        page: 1,
        size: 10,
        username: undefined,
        type: undefined,
        target_id: undefined

      },
      associationList: [],

      viewContent: ''
    }
  },

  created() {
    this.queryParams.type = this.$route.query.type
    this.queryParams.target_id = this.$route.query.targetId

    this.getList()

  },
  methods: {
    /** 查询用户列表 */
    getList() {
      this.loading = true

      listAssociation(this.queryParams).then(response => {
          this.associationList = response.data.list
          this.total = response.data.total
          this.loading = false
        }
      )
    },
    handleView(row) {
      this.open = true
      console.log(row.content, 2222)

      this.viewContent = row.content
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      this.resetForm('queryForm')
      this.handleQuery()
    }

  }
}
</script>
