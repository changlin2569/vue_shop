<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <el-button type="primary" @click="adddCate">添加分类</el-button>
      <!-- 商品分类列表 -->
      <tree-table
      class="treeTable"
        :data="goodsList"
        :columns="columns"
        :selection-type="false"
        show-index
        index-text="#"
        :expand-type="false"
        :show-row-hover="false"
        border
      >
        <template slot="isOk" slot-scope="goodsScope">
          <i
            class="el-icon-circle-check"
            v-if="goodsScope.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-circle-close" v-else style="color: red"></i>
        </template>
        <template slot="sort" slot-scope="goodsScope">
          <el-tag v-if="goodsScope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="goodsScope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <template slot="handle">
          <el-button type="primary" icon="el-icon-edit" size="mini"
            >编辑</el-button
          >
          <el-button type="danger" icon="el-icon-delete" size="mini"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="paramsGoods.pagenum"
      :page-sizes="[1, 4, 5, 8]"
      :page-size="5"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalGoods">
    </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
  title="添加分类"
  :visible.sync="adddCateDialogVisible" @close="resetAddCateFile"
  width="50%">
  <el-form ref="addCateFormRef" :model="addCateForm" :rules="addCateFormRules" label-width="80px">
  <el-form-item label="分类名称" prop="cat_name">
    <el-input v-model="addCateForm.cat_name"></el-input>
  </el-form-item>
  <el-form-item label="父级分类">
    <el-input></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="adddCateDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="adddCateDialogVisible = false">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 商品列表
      goodsList: [],
      // 请求参数
      paramsGoods: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      //  商品总数
      totalGoods: 0,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isOk'
        },
        {
          label: '排序',
          type: 'template',
          template: 'sort'
        },
        {
          label: '操作',
          type: 'template',
          template: 'handle'
        }
      ],
      //   控制添加分类对话框
      adddCateDialogVisible: false,
      //   添加分类信息
      addCateForm: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getGoodsList()
  },
  methods: {
    async getGoodsList () {
      const { data: res } = await this.$http.get('categories', {
        params: this.paramsGoods
      })
      //   console.log(res.data)
      this.goodsList = res.data.result
      this.totalGoods = res.data.total
    },
    // 页面显示条数发生变化
    handleSizeChange (newSize) {
      this.paramsGoods.pagesize = newSize
      this.getGoodsList()
    },
    // 当前页面发生变化
    handleCurrentChange (newPage) {
      this.paramsGoods.pagenum = newPage
      this.getGoodsList()
    },
    // 添加分类对话框
    adddCate () {
      this.adddCateDialogVisible = true
    },
    // 重置添加分类验证规则
    resetAddCateFile () {
      this.$refs.addCateFormRef.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.treeTable {
    margin-top: 15px;
}
</style>
