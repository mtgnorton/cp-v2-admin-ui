<template>
  <div class="app-container">

    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <!--      PostId    uint   // 可以为0,所属主题ID-->
      <!--      UserId    uint   // 可以为0,所属用户ID-->
      <!--      SeeUserId uint   //可以为0,查看回复的用户id，用户可能会屏蔽某些回复-->
      <!--      Keyword   string //为空不筛选-->
      <!--      Status    string `v:"in:normal,no_audit,shield" json:"status"` //为空不筛选-->
      <el-form-item label="主题id" prop="post_id">
        <el-input
          v-model="queryParams.post_id"
          placeholder="请输入主题id"
          clearable
          style="width: 240px;"
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="用户名" prop="username">
        <el-input
          v-model="queryParams.username"
          placeholder="请输入用户名"
          clearable
          style="width: 240px;"
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="关键词" prop="keyword">
        <el-input
          v-model="queryParams.keyword"
          placeholder="请输入关键词"
          clearable
          style="width: 240px;"
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="状态"
          clearable
          size="small"
          style="width: 240px"
        >
          <!--          状态：no_audit, normal, shielded-->
          <el-option label="所有" value=""></el-option>
          <el-option label="未审核" value="0"></el-option>
          <el-option label="正常" value="1"></el-option>

        </el-select>
      </el-form-item>


      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="list">
      <el-table-column label="id" width="100px" align="center" prop="id"/>
      <el-table-column label="用户" prop="username" align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="点击查看用户" placement="top">
            <el-link type="primary" @click="jumpUser(scope.row)" target="_blank">{{ scope.row.username }}</el-link>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column label="内容" width="200px" :show-overflow-tooltip="true" align="center" prop="content"/>

      <el-table-column label="主题" width="200px" :show-overflow-tooltip="true" prop="post_title" align="center">
        <template slot-scope="scope">
          <el-link type="primary" @click="jumpPost(scope.row.post_id)" target="_blank">{{
              scope.row.post_title
            }}
          </el-link>

        </template>
      </el-table-column>

      <el-table-column label="感谢数量" sortable prop="thanks_amount" align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="点击查看感谢用户" placement="top">
            <el-link type="primary" @click="jumpAssociation('thanks_reply',scope.row.id)" target="_blank">{{
                scope.row.thanks_amount
              }}
            </el-link>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="屏蔽数量" sortable prop="shielded_amount" align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="点击查看屏蔽用户" placement="top">
            <el-link type="primary" @click="jumpAssociation('shield_reply',scope.row.id)" target="_blank">{{
                scope.row.shielded_amount
              }}
            </el-link>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-tag type="danger" v-if="scope.row.status === 0 ">未审核</el-tag>
          <el-tag type="success" v-if="scope.row.status ===1">正常</el-tag>
          <el-tag type="danger" v-if="scope.row.status ===-1">屏蔽</el-tag>
        </template>

      </el-table-column>
      <el-table-column label="创建日期" align="center" prop="created_at">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.created_at) }}</span>
        </template>
      </el-table-column>


      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleView(scope.row)"
          >详情
          </el-button>

          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            v-if="scope.row.status === 0"
            @click="handleAudit(scope.row.id)"
          >审核
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleManage(scope.row)"
          >管理
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleDelete(scope.row)"
          >删除
          </el-button>
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


    <!-- 添加或修改参数配置对话框 -->
    <el-dialog title="管理回复" :visible.sync="manageOpen" width="80%" append-to-body>
      <el-form ref="form" :model="form">
        <el-row>
          <el-col :span="24">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio :label="1"> 正常</el-radio>
                <el-radio :label="-1"> 屏蔽</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click.prevent="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 添加或修改参数配置对话框 -->
    <el-dialog title="回复详情" :visible.sync="detailOpen" width="600px" append-to-body>
      <div class="content" v-html="detailContent">
      </div>
    </el-dialog>

  </div>
</template>
<script>
import { listReply, auditReply, updateReply, delReply } from '../../../api/forum'

export default {
  name: 'reply',
  data() {
    return {
      loading: false,
      queryParams: {
        page: 1,
        size: 10
      },
      list: [],
      total: 0,
      detailOpen: false,
      form: {},
      manageOpen: false,
      detailContent: ''
    }
  },
  created() {
    this.queryParams.post_id = this.$route.query.postId

    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      listReply(this.queryParams).then(response => {

          this.list = response.data.list
          this.total = response.data.total
          this.loading = false
        }
      )
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1
      this.getList()
    },
    jumpPost(postId) {
      this.$router.push({
        path: `/post-reply/posts?id=${postId}`
      })
    },
    jumpAssociation(type, targetId) {
      this.$router.push({ path: `/forum/association?type=${type}&targetId=${targetId}` })
    },
    jumpUser(row) {
      this.$router.push({ path: `/user-manage/users?username=${row.username}` })
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id).join(',')
      this.multiple = !selection.length
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = []
      this.resetForm('queryForm')
      this.handleQuery()
    },
    handleView(row) {
      this.detailContent = row.content
      this.detailOpen = true
    },
    handleAudit(id) {
      this.$confirm('确定要审核通过该条回复么', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        auditReply({ id: id }).then(response => {
          if (response.code !== 0) {
            this.msgError(response.msg)
          } else {
            this.getList()
            this.msgSuccess('审核成功')
          }
        })
      })

    },
    /** 删除按钮操作 */
    handleDelete(row) {

      let id = row.id
      this.$confirm('是否确认删除编号为"' + id + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delReply(id)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(function() {
      })
    },
    submitForm() {
      updateReply(this.form).then(response => {
        if (response.code === 0) {
          this.msgSuccess('修改成功')
          this.manageOpen = false
          this.getList()
        } else {
          this.msgError(response.msg)
        }
      }).catch(() => {
      })
    },
    // 取消按钮
    cancel() {
      this.manageOpen = false
    },
    handleManage(row) {
      this.manageOpen = true
      this.form = JSON.parse(JSON.stringify(row))
      console.log(row)

    }
  }
}
</script>

<style>
.type {
  flex-wrap: wrap;
}
</style>
