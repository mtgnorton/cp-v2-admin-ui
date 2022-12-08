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
          <el-form-item label="类型" prop="type">
            <el-select
              v-model="queryParams.type"
              placeholder="类型"
              clearable
              size="small"
              style="width: 240px"
            >
              <el-option label="登录奖励" value="login"></el-option>
              <el-option label="注册奖励" value="register"></el-option>
              <el-option label="发布主题扣除" value="establish_post_deduct"></el-option>
              <el-option label="发布回复扣除" value="establish_reply_deduct"></el-option>
              <el-option label="发布回复奖励创建主题者" value="establish_reply_reward"></el-option>
              <el-option label="感谢回复扣除" value="thanks_reply_deduct"></el-option>
              <el-option label="感谢回复奖励创建回复者" value="thanks_reply_reward"></el-option>
              <el-option label="感谢主题扣除" value="thanks_post_deduct"></el-option>
              <el-option label="感谢主题奖励创建主题者" value="thanks_post_reward"></el-option>
              <el-option label="活跃度奖励" value="activity"></el-option>


            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>


        <el-table v-loading="loading" :data="balanceLogList">
          <el-table-column label="编号" align="center" prop="id"/>
          <el-table-column label="用户名" width="100px" align="center" prop="username"/>

          <el-table-column label="类型" align="center" prop="type" width="160">
            <template slot-scope="scope">
              <el-tag type="primary">{{ scope.row.type_show }}</el-tag>

            </template>

          </el-table-column>

          <el-table-column label="金额" align="center" prop="amount"/>
          <el-table-column label="变动前余额" align="center" prop="before"/>
          <el-table-column label="变动后余额" align="center" prop="after"/>
          <el-table-column label="关联id" align="center" prop="relation_id"/>
          <el-table-column label="备注" align="center" :show-overflow-tooltip="true" prop="remark"/>


          <el-table-column label="创建时间" align="center" prop="created_at" width="160">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.created_at) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="180"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
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
  listBalanceLogRecord,
  delBalanceLogRecord
} from '@/api/forum'

export default {
  name: 'email-record',
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
        type: undefined
      },
      balanceLogList: [],

      viewContent: ''
    }
  },

  created() {
    this.getList()

  },
  methods: {
    /** 查询用户列表 */
    getList() {
      this.loading = true

      listBalanceLogRecord(this.queryParams).then(response => {
          this.balanceLogList = response.data.list
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
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length != 1
      this.multiple = !selection.length
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id

      this.$confirm('是否确认删除编号为"' + id + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delBalanceLogRecord(id)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(function() {
      })
    }

  }
}
</script>
