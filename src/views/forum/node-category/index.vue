<template>
  <div class="app-container">

    <el-row :gutter="20">

      <!--用户数据-->
      <el-col :span="20" :xs="24">

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

      </el-col>
    </el-row>

    <el-table v-loading="loading" row-key="id"
              :data="listNodeCategory" :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >

      <el-table-column label="Id" prop="id"/>
      <el-table-column label="名称" prop="name" :show-overflow-tooltip="true"/>

      <el-table-column label="是否首页导航">
        <template slot-scope="scope">
          <el-tag type="primary" v-if="scope.row.is_index_navigation===0">否</el-tag>
          <el-tag type="success" v-if="scope.row.is_index_navigation===1">是</el-tag>
        </template>
      </el-table-column>


      <el-table-column label="顺序" prop="sort" :show-overflow-tooltip="true"/>


      <el-table-column
        label="操作"
        align="center"
        width="180"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">

          <el-button
            v-if="scope.row.is_disabled_edit !== 1"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleUpdate(scope.row)"
          >编辑
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            v-hasPermi="['PUT:/system/menu']"
          >新增
          </el-button>

          <el-button
            v-if="scope.row.is_disabled_edit !== 1"
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
    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>

      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级节点">
              <treeselect
                v-model="form.parent_id"
                :options="nodeOptions"
                :normalizer="normalizer"
                :show-count="true"
                placeholder="选择上级节点"
              />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入名称"/>
            </el-form-item>

          </el-col>


          <el-col :span="24">
            <el-form-item label="首页导航">
              <el-radio-group v-model="form.is_index_navigation">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>


          <el-col :span="24">
            <el-form-item label="顺序" prop="sort">
              <el-input v-model="form.sort" placeholder="越小越靠前"/>

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
  listNodeCategory,
  storeNodeCategory,
  updateNodeCategory,
  infoNodeCategory,
  destroyNodeCategory
} from '@/api/forum'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'node_category_index',
  components: { Treeselect },
  data() {
    return {
      loading: true,
      total: 0,
      nodeOptions: [],
      // 是否显示弹出层
      open: false,
      form: {},

      title: '',
      listNodeCategory: [],
      // 查询参数
      queryParams: {
        page: 1,
        size: 20
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }

        ]
      }
    }
  },

  created() {
    this.getList()
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true
      listNodeCategory(this.queryParams).then(response => {
          this.listNodeCategory = this.handleTree(response.data.list)
          console.log(JSON.parse(JSON.stringify(this.listNodeCategory)))
          this.total = response.data.total

          this.loading = false
        }
      )
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        name: '',
        keyword: '',
        description: '',
        detail: '',
        img: '',
        parent_id: 0,
        is_index: 0,
        sort: 0,
        remote_image_url: '',
        is_index_navigation: 0
      }
      this.resetForm('form')
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset()
      this.getTreeselect()
      if (row != null) {
        this.form.parent_id = row.id
      }
      this.open = true
      this.title = '添加节点'

    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      this.getTreeselect()

      infoNodeCategory(row.id).then(response => {
          this.form = response.data
          this.open = true
          this.title = '修改节点'
        }
      )

    },
    /** 删除按钮操作 */
    handleDelete(row) {

      this.$confirm('是否确认删除编号为"' + row.id + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return destroyNodeCategory(row.id)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(function() {
      })
    },
    /** 提交按钮 */
    submitForm: function() {

      var that = this

      if (this.form.id === undefined) {
        storeNodeCategory(this.form).then(response => {
          if (response.code === 0) {
            this.msgSuccess('新增成功')
            this.open = false
            this.getList()
          } else {
            this.msgError(response.msg)
          }
        })

      } else {
        updateNodeCategory(this.form).then(response => {
          if (response.code === 0) {
            this.msgSuccess('更新成功')
            this.open = false
            this.getList()
          } else {
            this.msgError(response.msg)
          }
        })
      }
    },
    /** 查询菜单下拉树结构 */
    getTreeselect() {
      listNodeCategory().then(response => {
        this.nodeOptions = []
        console.log(response)

        const nodes = { id: 0, name: '根节点', children: [] }
        nodes.children = this.handleTree(response.data.list)
        this.nodeOptions.push(nodes)
      })
    },

    /** 转换菜单数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children
      }
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    handleAvatarSuccess(res, file) {
      console.log(res, 1111, res.data.url)

      this.form.img = res.data.url
    },
    beforeAvatarUpload(file) {
      return true
    },
    downloadRemote() {
      nodeDownloadRemoteImage({ image_url: this.form.remote_image_url }).then(response => {
        if (response.code === 0) {
          this.form.img = response.data.url
        } else {
          this.msgError(response.msg)
        }
      })
    }
  }
}
</script>

<style>
.node-img-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  padding: 10px;
}

.node-img-uploader .el-upload:hover {
  border-color: #409EFF;
}

.node-img-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}

.node-img {
  width: 100px;
  height: 100px;
  display: block;
}
</style>


