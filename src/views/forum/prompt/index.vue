<template>
  <div class="app-container">
    <el-row :gutter="20">

      <!--用户数据-->
      <el-col :span="24" :xs="24">


        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
            >新增
            </el-button>
          </el-col>


        </el-row>

        <el-table v-loading="loading" :data="promptList">
          <el-table-column label="编号" align="center" prop="id"/>
          <el-table-column label="位置" width="100px" align="center" prop="position"/>
          <el-table-column label="内容" :show-overflow-tooltip="true" align="center" prop="content"/>
          <el-table-column label="描述" :show-overflow-tooltip="true" align="center" prop="description"/>
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.is_disabled === 0">正常</el-tag>
              <el-tag type="danger" v-else>禁用</el-tag>
            </template>
          </el-table-column>
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
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
              >修改
              </el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['DELETE:/system/user']"
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

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="80%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="位置" prop="position">
              <el-input v-model="form.position" placeholder="请输入位置"/>
            </el-form-item>
          </el-col>
          <el-col :span="24" style="    height: 350px;">
            <el-form-item label="内容" prop="content">
              <quill-editor
                style="height: 250px;margin-bottom: 20px;"
                ref="myQuillEditor"
                v-model="form.content"
                :options="editorOption"
              />
            </el-form-item>

          </el-col>
          <el-col :span="24">
            <el-form-item label="描述" prop="username">
              <el-input v-model="form.description" placeholder="请输入描述"/>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="状态">
              <el-radio-group v-model="form.is_disabled">
                <el-radio label="0"> 正常</el-radio>
                <el-radio label="1"> 禁用</el-radio>
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

  </div>
</template>

<script>
import {
  listPrompt,
  getPrompt,
  delPrompt,
  addPrompt,
  updatePrompt,
  exportUser,
  resetUserPwd,
  changeUserStatus,
  importTemplate
} from '@/api/forum'
import { getToken } from '@/utils/auth'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import { quillEditor } from 'vue-quill-editor'

export default {
  name: 'User',
  components: { quillEditor },
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
      // 用户表格数据
      promptList: null,
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 默认密码
      initPassword: '123456',
      // 日期范围
      dateRange: [],
      // 状态数据字典
      statusOptions: [],
      // 性别状态字典
      sexOptions: [],
      // 岗位选项
      postOptions: [],
      // 角色选项
      roleOptions: [],
      // 表单参数
      form: {},
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      editorOption: {},
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: '',
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: 'Bearer ' + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + '/system/user/importData'
      },
      // 查询参数
      queryParams: {
        page: 1,
        size: 10,
        username: undefined,
        status: undefined
      },
      rules: {
        position: [
          { required: true, message: '请输入位置', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ]
      }
    }
  },

  created() {
    this.getList()

  },
  methods: {
    /** 查询用户列表 */
    getList() {
      this.loading = true

      listPrompt(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.promptList = response.data.list
          this.total = response.data.total
          this.loading = false
        }
      )
    },

    // 筛选节点
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.deptId = data.id
      this.getList()
    },
    // 用户状态修改
    handleStatusChange(row) {
      let text = row.status === 'normal' ? '启用' : '停用'
      this.$confirm('确认要"' + text + '""' + row.user_name + '"用户吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return changeUserStatus(row.id, row.status)
      }).then(() => {
        this.msgSuccess(text + '成功')
      }).catch(function() {
        row.status = row.status === '0' ? '1' : '0'
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        position: undefined,
        content: undefined,
        description: undefined,
        is_disabled: '0'
      }
      this.resetForm('form')
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
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加提示语'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const promptId = row.id
      let that = this
      getPrompt(promptId).then(response => {
        that.form = response.data
        this.form.is_disabled = response.data.is_disabled.toString()
        console.log(response.data)
        that.open = true
        that.title = '修改提示'
      })
    },

    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          var that = this
          if (this.form.id !== undefined) {
            updatePrompt(this.form).then(response => {
              if (response.code === 0) {
                this.msgSuccess('修改成功')
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            }).catch(() => {
            })
          } else {
            addPrompt(this.form).then(response => {
              if (response.code === 0) {
                this.msgSuccess('新增成功')
                this.open = false
                this.getList()
              } else {
                this.msgError(response.msg)
              }
            }).catch(() => {
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const id = row.id

      this.$confirm('是否确认删除编号为"' + id + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delPrompt(id)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(function() {
      })
    }

  }
}
</script>
