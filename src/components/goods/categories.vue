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
        <template slot="handle" slot-scope="goodsScope">
          <el-button type="primary" @click="editCate(goodsScope.row)" icon="el-icon-edit" size="mini"
            >编辑</el-button
          >
          <el-button type="danger" @click="deleteCate(goodsScope.row)" icon="el-icon-delete" size="mini"
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
    <el-cascader
    v-model="selectedKeys"
    :options="parentList"
    :props="parentListProps"
    @change="handleChange"
    clearable></el-cascader>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="adddCateDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCateHandle">确 定</el-button>
  </span>
</el-dialog>
<!-- 编辑分类对话框 -->
<el-dialog
  title="编辑分类"
  :visible.sync="editCateDialogVisible"
  @close="resetEditFields"
  width="50%">
  <el-form ref="editFormRef" :rules="editFormRules" :model="editForm" label-width="80px">
  <el-form-item label="分类名称" prop="cat_name">
    <el-input v-model="editForm.cat_name"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editCateDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editFormHandle">确 定</el-button>
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
          { min: 1, max: 6, message: '长度在 1 到 6 个字符', trigger: 'blur' }
        ]
      },
      // 父级分类列表
      parentList: [],
      // 分类级联选择器配置
      parentListProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      },
      // 级联选择器选择的值
      selectedKeys: [],
      // 当前分类id
      cateId: '',
      // 编辑分类
      editForm: {
        cat_name: ''
      },
      editFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 1, max: 6, message: '长度在 1 到 6 个字符', trigger: 'blur' }
        ]
      },
      editCateDialogVisible: false
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
      this.getParentList()
      this.adddCateDialogVisible = true
    },
    // 重置添加分类验证规则
    resetAddCateFile () {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    // 获取父级分类列表
    async getParentList () {
      const { data: res } = await this.$http.get('categories', {
        params: {
          type: 2
        }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类失败')
      }
      // console.log(res.data)
      this.parentList = res.data
    },
    // 级联选择器改变事件
    handleChange () {
      // console.log(this.selectedKeys)
      if (this.selectedKeys.length > 0) {
        // 当前分类的父id
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 当前分类的等级
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 添加分类提交
    addCateHandle () {
      this.$refs.addCateFormRef.validate(async addCateFlag => {
        // console.log(addCateFlag)
        if (!addCateFlag) {
          return this.$message.error('校验未通过')
        }
        // console.log(this.addCateForm)
        const { data: res } = await this.$http.post('categories', this.addCateForm)
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        this.getGoodsList()
        this.adddCateDialogVisible = false
      })
    },
    // 编辑分类
    editCate (cate) {
      this.cateId = cate.cat_id
      this.getCateById()
      this.editCateDialogVisible = true
    },
    // 编辑提交分类
    async editFormHandle () {
      const { data: res } = await this.$http.put(`categories/${this.cateId}`, {
        cat_name: this.editForm.cat_name
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.getGoodsList()
      // console.log(11)
      this.editCateDialogVisible = false
    },
    // 重置编辑分类验证
    resetEditFields () {
      this.$refs.editFormRef.resetFields()
      this.cateId = ''
    },
    // 删除分类
    deleteCate (cate) {
      this.cateId = cate.cat_id
      // console.log(this.cateId)
      this.$confirm('此操作将永久删除该商品分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete(`categories/${this.cateId}`)
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.getGoodsList()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    async getCateById () {
      const { data: res } = await this.$http.get(`categories/${this.cateId}`)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.editForm.cat_name = res.data.cat_name
    }
  }
}
</script>

<style lang="less" scoped>
.treeTable {
    margin-top: 15px;
}

.el-cascader {
  width: 100%;
}
</style>
