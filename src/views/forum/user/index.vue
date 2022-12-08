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
          <el-form-item label="状态" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="用户状态"
              clearable
              size="small"
              style="width: 240px"
            >
              <el-option label="正常" value="0"></el-option>
              <el-option label="禁止登录" value="1"></el-option>
              <el-option label="禁止发帖" value="2"></el-option>
              <el-option label="禁止回帖" value="4"></el-option>

            </el-select>
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
              :disabled="multiple"
              @click="handleDelete"
              v-hasPermi="['DELETE:/system/user']"
            >删除
            </el-button>
          </el-col>

        </el-row>

        <el-table v-loading="loading" :data="userList">
          <el-table-column label="用户编号" align="center" prop="id"/>
          <el-table-column label="用户名" width="100px" align="center" prop="username"/>
          <el-table-column label="邮箱" align="center" prop="email"/>


          <el-table-column label="头像" width="200px" align="center">
            <template slot-scope="scope">
              <img :src="scope.row.avatar" alt="">

            </template>

          </el-table-column>

          <el-table-column label="主题数量" align="center" prop="posts_amount"/>


          <el-table-column label="被屏蔽次数" sortable prop="shielded_amount" align="center">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="点击查看屏蔽用户" placement="top">
                <el-link @click="jumpAssociation('shield_user',scope.row.id)" target="_blank">
                  {{ scope.row.shielded_amount }}
                </el-link>
              </el-tooltip>
            </template>
          </el-table-column>

          <el-table-column label="被关注次数" sortable prop="follow_by_other_amount" align="center">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="点击查看关注q用户" placement="top">
                <el-link @click="jumpAssociation('follow_user',scope.row.id)" target="_blank">
                  {{ scope.row.follow_by_other_amount }}
                </el-link>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="今日活跃度" align="center" prop="today_activity"/>
          <el-table-column label="余额" align="center" prop="balance"/>

          <el-table-column label="状态" width="200px" align="center">
            <template slot-scope="scope">
              <!--              二进制位,0111 由低到高分别代表 禁止登录，禁止发帖，禁止回复-->

              <div v-html="showStatus(scope.row.status) "></div>

            </template>

          </el-table-column>

          <el-table-column label="最后登陆IP" align="center" prop="last_login_ip"/>
          <el-table-column label="最后登陆时间" align="center" prop="last_login_time"/>
          <el-table-column label="备注" align="center" prop="remark"/>
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
                v-hasPermi="['PUT:/system/user']"
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
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户名称" prop="username">
              <el-input v-model="form.username" :disabled="form.id !== undefined" placeholder="请输入用户名称"/>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入邮箱"/>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="用户密码" prop="password">
              <el-input v-model="form.password" placeholder="请输入用户密码" type="password"/>
              <div class="warning-tips">默认用户密码为：123456</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="重复用户密码" prop="password2">
              <el-input v-model="form.password2" placeholder="请输入用户密码" type="password"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="状态">
              <el-checkbox v-model="status.forbidLogin">禁止登录</el-checkbox>
              <el-checkbox v-model="status.forbidPost">禁止发帖</el-checkbox>
              <el-checkbox v-model="status.forbidReply">禁止回复</el-checkbox>
              <el-checkbox v-model="status.notActive">尚未激活</el-checkbox>
            </el-form-item>
          </el-col>


          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
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
  listUser,
  getUser,
  delUser,
  addUser,
  updateUser,
  exportUser,
  resetUserPwd,
  changeUserStatus,
  importTemplate
} from '@/api/forum'
import { getToken } from '@/utils/auth'
import { treeselect } from '@/api/system/dept'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'User',
  components: { Treeselect },
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
      userList: null,
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
      status: {
        forbidLogin: false,
        forbidPost: false,
        forbidReply: false,
        notActive: false
      },
      // 表单校验
      rules: {
        username: [
          { required: true, message: '用户名称不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '用户密码不能为空', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '用户邮箱不能为空', trigger: 'blur' }

        ]
      }
    }
  },

  created() {
    this.queryParams.username = this.$route.query.username
    this.getList()

  },
  methods: {
    /** 查询用户列表 */
    getList() {
      this.loading = true

      listUser(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
          this.userList = response.data.list
          this.total = response.data.total
          this.loading = false
        }
      )
    },
    jumpAssociation(type, targetId) {
      this.$router.push({ path: `/forum/association?type=${type}&targetId=${targetId}` })
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
        username: undefined,
        password: '123456',
        password2: '123456',
        status: 'normal',
        remark: undefined
      }
      this.status = {
        forbidLogin: false,
        forbidPost: false,
        forbidReply: false,
        notActive: false
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
      this.title = '添加用户'
      this.form.password = this.initPassword
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const userId = row.id
      console.log(userId)
      let that = this
      getUser(userId).then(response => {
        that.form = response.data
        console.log(response.data)
        that.open = true
        that.title = '修改用户'
        that.form.password = '******'
        that.form.password2 = '******'
        that.status.forbidLogin = (this.form.status & 1) > 0
        that.status.forbidPost = (this.form.status & 2) > 0
        that.status.forbidReply = (this.form.status & 4) > 0
        that.status.notActive = (this.form.status & 8) > 0
        console.log(this.status)

      })
    },

    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {

        console.log(this.status, this.form.status, '111')

        if (this.status.forbidLogin) {
          this.form.status = this.form.status | 1
        } else {
          this.form.status = this.form.status & (~1)
        }

        if (this.status.forbidPost) {
          this.form.status = this.form.status | 2
        } else {
          this.form.status = this.form.status & (~2)
        }

        if (this.status.forbidReply) {
          this.form.status = this.form.status | 4
        } else {
          this.form.status = this.form.status & (~4)
        }

        if (this.status.notActive) {
          this.form.status = this.form.status | 8
        } else {
          this.form.status = this.form.status & (~8)
        }

        if (valid) {
          if (this.form.id !== undefined) {
            updateUser(this.form).then(response => {
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
            addUser(this.form).then(response => {
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
      const ids = row.id ? [row.id] : this.ids

      this.$confirm('是否确认删除用户编号为"' + ids.join(',') + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delUser(ids)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(function() {
      })
    },

    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false
      this.upload.isUploading = false
      this.$refs.upload.clearFiles()
      this.$alert(response.msg, '导入结果', { dangerouslyUseHTMLString: true })
      this.getList()
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit()
    },
    showStatus(value) {
      // 二进制位,0111 由低到高分别代表 禁止登录，禁止发帖，禁止回复

      let show = ''

      if (value & 1) {
        show += '禁止登录 '
      }
      if (value & 1 << 1) {
        show += '禁止发帖 '
      }
      if (value & 1 << 2) {
        show += '禁止回复 '
      }
      if (value & 1 << 3) {
        show += '尚未激活 '
      }
      if (show === '') {
        return '<el-tag class="el-tag el-tag--success el-tag--medium el-tag--light">正常</el-tag>'
      } else {
        return '<el-tag class="el-tag el-tag--danger el-tag--medium el-tag--light">' + show + '</el-tag>'
      }

    }
  }
}
</script>
