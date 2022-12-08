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

        <el-table v-loading="loading"        row-key="id"
                  :data="nodeList" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">

          <el-table-column label="id" prop="id" :show-overflow-tooltip="true" />
          <el-table-column label="名称" prop="name" :show-overflow-tooltip="true"/>

          <el-table-column label="是否首页显示">
            <template slot-scope="scope">
              <el-tag type="primary" v-if="scope.row.is_index==0">否</el-tag>
              <el-tag type="success" v-if="scope.row.is_index==1">是</el-tag>
            </template>
          </el-table-column>

          <el-table-column label="描述" align="center" prop="description"/>

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

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.async="open" width="900px">

      <el-form ref="form" :model="form" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入名称"/>
            </el-form-item>


          </el-col>

          <el-col :span="24">
            <el-form-item label="描述" prop="description">
              <!--              <el-input type="textarea"-->
              <!--                        :rows="5"-->

              <!--                        v-model="form.description" placeholder="请输入描述"-->
              <!--              />-->

              <editor
                v-model="form.description"
                modal="false"
                style="z-index:3000"

                api-key="a9cigkql8eaks4eg3k90zet0czn6emo68dgc5odd5vfz6ekd"
                :init="{
        plugins: 'lists link image table code help wordcount',
        height: '400',
              }"
              />
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
  nodeList, nodeStore, nodeUpdate, nodeInfo, nodeDestroy
} from '@/api/forum'

import Editor from '@tinymce/tinymce-vue'

export default {
  name: 'lose_block',
  data() {
    return {
      loading: true,
      total: 0,
      // 是否显示弹出层
      open: false,
      form: {},
      title: '',
      nodeList: [],
      // 查询参数
      queryParams: {
        page: 1,
        size: 10
      }
    }
  },
  components: {
    'editor': Editor
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true
      nodeList(this.queryParams).then(response => {
          this.nodeList = this.handleTree(response.data.list)
          console.log(JSON.parse(JSON.stringify(this.nodeList)))

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
        is_index: 0,
        name: '',
        description: ''
      }
      this.resetForm('form')
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加节点'

    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      nodeInfo({ 'id': row.id }).then(response => {
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
        return nodeDestroy({ 'id': row.id })
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
        nodeStore(this.form).then(response => {
          if (response.code === 0) {
            this.msgSuccess('新增成功')
            this.open = false
            this.getList()
          } else {
            this.msgError(response.msg)
          }
        })

      } else {
        nodeUpdate(this.form).then(response => {
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

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    }
  }
}
</script>

<style>
.tox-tinymce-aux {
  z-index: 3000 !important;
}

.tox {
  z-index: 3000;
}
</style>
