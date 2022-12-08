<template>
  <div class="app-container">

    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">

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

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['POST:/system/user']"
        >新增
        </el-button>
      </el-col>

      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          @click="handleDelete"
          v-hasPermi="['DELETE:/system/user']"
        >删除
        </el-button>
      </el-col>

    </el-row>
    <el-table v-loading="loading" :data="list" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="60" align="center"/>

      <el-table-column label="ID" prop="id"></el-table-column>

      <el-table-column label="敏感词" width="100px" align="center" prop="word"/>
      <el-table-column label="类型" width="100px" align="center" prop="type"/>

      <el-table-column label="创建日期" align="center" prop="created_at" width="180">
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
            v-if="scope.row.status === 0"
            @click="handleAudit(scope.row.id)"
          >审核
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
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="敏感词" prop="form.word">
              <el-input v-model="form.word" placeholder="请输入敏感词"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="类型" prop="password">
              <el-input v-model="form.type" placeholder="请输入类型" />
            </el-form-item>
          </el-col>


        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click.prevent="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>


  </div>
</template>
<script>
import { sensitiveWordList, addSensitiveWord, delSensitiveWord } from '../../../api/forum'

export default {
  name: 'reply',
  data() {
    return {
      loading: false,
      queryParams: {
        page: 1,
        size: 10
      },
      title: '新增',
      open: false,
      list: [],
      total: 0,
      detailOpen: false,
      detailContent: '',
      form: {}
    }
  },
  created() {
    this.queryParams.post_id = this.$route.query.postId

    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      sensitiveWordList(this.queryParams).then(response => {

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
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        type: undefined,
        word: undefined
      }
      this.resetForm('form')
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          var that = this
          addSensitiveWord(this.form).then(response => {
            if (response.code === 0) {
              this.msgSuccess('新增成功')
              this.open = false
              this.getList()
            } else {
              this.msgError(response.msg)
            }
          })
        }
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    /** 删除按钮操作 */
    handleDelete(row) {

      const ids = row.id ? [row.id] : this.ids

      this.$confirm('是否确认删除编号为"' + ids + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delSensitiveWord({ ids: ids })
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(function() {
      })
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
    }
  }

}
</script>

<style>
.type {
  flex-wrap: wrap;
}
</style>
