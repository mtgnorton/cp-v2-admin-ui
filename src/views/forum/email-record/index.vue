<template>
  <div class="app-container">
    <el-row :gutter="20">

      <!--用户数据-->
      <el-col :span="24" :xs="24">


        <el-table v-loading="loading" :data="emailList">
          <el-table-column label="编号" align="center" prop="id"/>
          <el-table-column label="用户名" width="100px" align="center" prop="username"/>
          <el-table-column label="类型" :show-overflow-tooltip="true" align="center" prop="type"/>
          <el-table-column label="邮箱" :show-overflow-tooltip="true" align="center" prop="email"/>
          <el-table-column label="标题" :show-overflow-tooltip="true" align="center" prop="title"/>
          <el-table-column label="内容" :show-overflow-tooltip="true" align="center" prop="content"/>
          <el-table-column label="错误" :show-overflow-tooltip="true" align="center" prop="error"/>

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
                @click="handleView(scope.row)"
              >查看内容
              </el-button>
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
  listEmailRecord,
  delEmailRecord
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
        email: undefined

      },
      emailList: [],

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

      listEmailRecord(this.queryParams).then(response => {
          this.emailList = response.data.list
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
        return delEmailRecord(id)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(function() {
      })
    }

  }
}
</script>
