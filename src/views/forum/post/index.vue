<template>
  <div class="app-container">

    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">


      <el-form-item label="主题id" prop="title">
        <el-input
          v-model="queryParams.id"
          placeholder="请输入主题id  "
          clearable
          style="width: 240px;"
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入标题"
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

      <el-form-item label="节点名称" prop="node_name">
        <el-input
          v-model="queryParams.node_name"
          placeholder="请输入节点名称"
          clearable
          style="width: 240px;"
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="关键词" prop="filter_keyword">
        <el-input
          v-model="queryParams.filter_keyword"
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

      <el-form-item label="周期" prop="period">
        <el-select
          v-model="queryParams.period"
          placeholder="状态"
          clearable
          size="small"
          style="width: 240px"
        >

          <!--          Day1  TimePeriod = 1-->
          <!--          Day3  TimePeriod = 3-->
          <!--          Day7  TimePeriod = 7-->
          <!--          Month TimePeriod = 30-->
          <!--          Year  TimePeriod = 365-->


          <el-option label="不限" value="0"></el-option>
          <el-option label="1天内" value="1"></el-option>
          <el-option label="3天内" value="3"></el-option>
          <el-option label="7天内" value="7"></el-option>
          <el-option label="30天内" value="30"></el-option>
          <el-option label="365天内" value="365"></el-option>

        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="list" @sort-change="changeSort">
      <el-table-column label="ID" prop="id"></el-table-column>

      <el-table-column label="标题" width="200px">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="点击跳转到主题页面" placement="top">
            <el-link type="primary" :href="frontDomain+'/post/'+scope.row.id" target="_blank">{{
                scope.row.title
              }}
            </el-link>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column label="用户" prop="username" align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="点击查看用户" placement="top">
            <el-link type="primary" @click="jumpUser(scope.row)" target="_blank">{{ scope.row.username }}</el-link>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="回复数量" sortable prop="reply_amount" align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="点击查看回复" placement="top">
            <el-link type="primary" @click="jumpComments(scope.row)" target="_blank">{{
                scope.row.reply_amount
              }}
            </el-link>
          </el-tooltip>
        </template>
      </el-table-column>


      <el-table-column label="收藏数量" sortable prop="collection_amount" align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="点击查看收藏用户" placement="top">
            <el-link type="primary" @click="jumpAssociation('collect_post',scope.row.id)" target="_blank">
              {{ scope.row.collection_amount }}
            </el-link>
          </el-tooltip>
        </template>
      </el-table-column>


      <el-table-column label="屏蔽数量" sortable prop="shielded_amount" align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="点击查看屏蔽用户" placement="top">
            <el-link type="primary" @click="jumpAssociation('shield_post',scope.row.id)" target="_blank">{{
                scope.row.shielded_amount
              }}
            </el-link>
          </el-tooltip>
        </template>
      </el-table-column>


      <el-table-column label="感谢数量" sortable prop="thanks_amount" align="center">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="点击查看感谢用户" placement="top">
            <el-link type="primary" @click="jumpAssociation('thanks_post',scope.row.id)" target="_blank">{{
                scope.row.thanks_amount
              }}
            </el-link>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="点击数量" sortable align="center" prop="visit_amount"/>
      <el-table-column label="置顶时间" align="center" prop="top_end_time"/>

      <el-table-column label="所属节点" align="center" prop="node_name"/>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-tag type="danger" v-if="scope.row.status === 0 ">未审核</el-tag>
          <el-tag type="success" v-if="scope.row.status === 1">已审核</el-tag>
          <el-tag type="danger" v-if="scope.row.status === -1">已屏蔽</el-tag>
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
    <el-dialog title="主题详情" :visible.sync="detailOpen" width="600px" append-to-body>
      <div class="content" v-html="detailContent">

      </div>
    </el-dialog>


    <!-- 添加或修改参数配置对话框 -->
    <el-dialog title="管理主题" :visible.sync="manageOpen" width="80%" append-to-body>
      <el-form ref="form" :model="form">
        <el-row>
          <el-col :span="24">
            <el-form-item label="置顶截止时间">

              <el-date-picker
                v-model="form.top_end_time"
                type="datetime"
                placeholder="选择日期时间"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>


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

  </div>
</template>
<script>
import { listPost, delPost, auditPost, updatePost, infoPost } from '../../../api/forum'

export default {
  name: 'post',
  data() {
    return {
      loading: false,
      queryParams: {
        page: 1,
        size: 10,
        period: undefined,
        order_field: '',
        order_direction: '',
        id: undefined
      },

      list: [],
      total: 0,
      detailOpen: false,
      manageOpen: false,
      form: {},
      detailContent: '',
      frontDomain: ''
    }
  },
  created() {
    this.queryParams.id = this.$route.query.id
    this.getList()
  },

  methods: {
    getList() {
      this.loading = true
      listPost(this.queryParams).then(response => {

          this.list = response.data.list
          this.total = response.data.total
          this.loading = false
          this.frontDomain = response.data.front_domain
        }
      )
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1
      this.getList()
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id).join(',')
      this.multiple = !selection.length
    },

    changeSort(info) {
      this.queryParams.order_direction = info.order === 'descending' ? 'desc' : 'asc'
      this.queryParams.order_field = info.prop
      this.getList()
    },
    jumpComments(row) {
      this.$router.push({ path: `/post-reply/reply?postId=${row.id}` })
    },
    jumpUser(row) {
      this.$router.push({ path: `/user-manage/users?username=${row.username}` })
    },
    jumpAssociation(type, targetId) {
      this.$router.push({ path: `/forum/association?type=${type}&targetId=${targetId}` })
    },
    handleView(row) {
      infoPost(row.id).then(res => {
        console.log(res.data)
        this.detailContent = res.data.html_content
        console.log(this.detailContent)

        this.detailOpen = true
      })

    },
    handleAudit(id) {
      this.$confirm('确定要审核通过该主题么', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        auditPost({ id: id }).then(response => {
          if (response.code !== 0) {
            this.msgError(response.msg)
          } else {
            this.getList()
            this.msgSuccess('审核成功')
          }
        })
      })

    },
    submitForm() {
      updatePost(this.form).then(response => {
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

    },

    /** 删除按钮操作 */
    handleDelete(row) {

      let id = row.id
      this.$confirm('是否确认删除编号为"' + id + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delPost(id)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(function() {
      })
    }
  }
}
</script>
