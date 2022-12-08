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
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="节点名称" prop="username">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入节点名称"
          clearable
          size="small"
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" row-key="id"
              :data="listNode" :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >

      <el-table-column label="Id" prop="id"/>
      <el-table-column label="名称" prop="name" :show-overflow-tooltip="true"/>
      <el-table-column label="分类" prop="node_category.name" :show-overflow-tooltip="true"/>
      <el-table-column label="关键词" prop="keyword" :show-overflow-tooltip="true"/>
      <el-table-column label="节点图片">
        <template slot-scope="scope">
          <img :src="scope.row.img" width="70px" alt="">
        </template>
      </el-table-column>

      <el-table-column label="是否首页显示">
        <template slot-scope="scope">
          <el-tag type="primary" v-if="scope.row.is_index==0">否</el-tag>
          <el-tag type="success" v-if="scope.row.is_index==1">是</el-tag>
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
            v-if="scope.row.is_disabled_edit !== 1"
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleUpdate(scope.row)"
          >编辑
          </el-button>
          <el-button
            v-if="scope.row.is_disabled_edit !== 1"

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
            <el-form-item label="节点分类">
              <treeselect
                v-model="form.category_id"
                :options="nodeCategoryOptions"
                :normalizer="normalizer"
                :show-count="true"
                placeholder="选择节点分类"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入名称"/>
            </el-form-item>

          </el-col>
          <el-col :span="24">
            <el-form-item label="关键词" prop="keyword">
              <el-input v-model="form.keyword" placeholder="请输入关键词，用于url等，不可重复"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="上传|下载 节点图片" prop="img">
              <el-input placeholder="输入图片链接或选择下方上传" style="margin-bottom: 20px"
                        v-model="form.remote_image_url"
                        class="input-with-select"
              >
                <el-button slot="append" icon="el-icon-search" @click="downloadRemote"></el-button>
              </el-input>

              <el-upload
                class="node-img-uploader"
                action="/admin/node-upload-img"
                :show-file-list="false"
                name="node_img"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="form.img" :src="form.img" class="node-img">
                <i v-else class="el-icon-plus node-img-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="描述" prop="description">
              <textarea name="" style="width: 100%" v-model="form.description" cols="30" rows="10"></textarea>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="详情" prop="detail">
              <textarea name="" v-model="form.detail" cols="30" rows="10"></textarea>
            </el-form-item>
          </el-col>


          <el-col :span="24">
            <el-form-item label="首页固定">
              <el-radio-group v-model="form.is_index">
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
  listNode, storeNode, updateNode, infoNode, destroyNode, nodeDownloadRemoteImage
} from '@/api/forum'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { listNodeCategory } from '../../../api/forum'

export default {
  name: 'node_index',
  components: { Treeselect },
  data() {
    return {
      loading: true,
      total: 0,
      nodeOptions: [],
      nodeCategoryOptions: [],
      // 是否显示弹出层
      open: false,
      form: {},

      title: '',
      listNode: [],
      // 查询参数
      queryParams: {
        page: 1,
        size: 10
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }

        ],
        keyword: [
          { required: true, message: '请输入关键词', trigger: 'blur' }
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
      listNode(this.queryParams).then(response => {
          this.listNode = this.handleTree(response.data.list)
          console.log(JSON.parse(JSON.stringify(this.listNode)))

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
        category_id: 0,
        is_index: 0,
        sort: 0,
        remote_image_url: ''
      }
      this.resetForm('form')
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset()
      this.getNodeTreeSelect()
      this.getNodeCategoryTreeSelect()
      if (row != null) {
        this.form.parent_id = row.id
      }
      this.open = true
      this.title = '添加节点'

    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      this.getNodeTreeSelect()
      this.getNodeCategoryTreeSelect()
      infoNode({ 'id': row.id }).then(response => {
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
        return destroyNode({ 'id': row.id })
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
        storeNode(this.form).then(response => {
          if (response.code === 0) {
            this.msgSuccess('新增成功')
            this.open = false
            this.getList()
          } else {
            this.msgError(response.msg)
          }
        })

      } else {
        updateNode(this.form).then(response => {
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
    /** 查询节点下拉树结构 */
    getNodeTreeSelect() {
      listNode().then(response => {
        this.nodeOptions = []
        console.log(response)

        const nodes = { id: 0, name: '根节点', children: [] }
        nodes.children = this.handleTree(response.data.list)
        this.nodeOptions.push(nodes)
      })
    },

    /** 查询节点分类下拉树结构 */
    getNodeCategoryTreeSelect() {
      listNodeCategory().then(response => {
        this.nodeCategoryOptions = []
        console.log(response)

        const categories = { id: 0, name: '根节点', children: [] }
        categories.children = this.handleTree(response.data.list)
        this.nodeCategoryOptions.push(categories)
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


